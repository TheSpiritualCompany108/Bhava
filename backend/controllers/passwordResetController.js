import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import { mailConfigured, sendPasswordResetOtp, sendGoogleAccountNotice } from "../utils/mailer.js";

// ── Forgot password (email OTP) ────────────────────────────────────────────────
const OTP_MINUTES = 10;
const RESEND_COOLDOWN_S = 60;
const MAX_SENDS_PER_HOUR = 5;
const MAX_OTP_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const otpHash = (email, otp) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET || "dev-secret").update(`${email}:${otp}`).digest("hex");

// Small per-IP limiter (in memory) on top of the per-email limits stored in MongoDB.
const ipHits = new Map();
const ipLimited = (key, max, windowMs) => {
  const now = Date.now();
  const arr = (ipHits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    ipHits.set(key, arr);
    return true;
  }
  arr.push(now);
  ipHits.set(key, arr);
  if (ipHits.size > 5000) for (const [k, v] of ipHits) if (!v.some((t) => now - t < windowMs)) ipHits.delete(k);
  return false;
};

const GENERIC_SENT = `If an account exists for this email, we have sent a 6-digit code to it. It is valid for ${OTP_MINUTES} minutes.`;

// POST /api/auth/forgot-password  — body: { email }
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (ipLimited(`fp:${req.ip}`, 10, 10 * 60 * 1000)) {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again in a few minutes." });
    }
    const isProd = process.env.NODE_ENV === "production";
    if (!mailConfigured() && isProd) {
      console.error("Forgot password: SMTP is not configured (SMTP_USER / SMTP_PASS / SMTP_HOST or SMTP_SERVICE).");
      return res.status(503).json({ success: false, message: "Password reset by email is temporarily unavailable. Please contact us." });
    }

    const now = new Date();
    let rec = await PasswordReset.findOne({ email });
    if (rec && rec.purgeAt <= now) {
      await rec.deleteOne();
      rec = null;
    }
    if (rec?.lastSentAt) {
      const wait = Math.ceil(RESEND_COOLDOWN_S - (now - rec.lastSentAt) / 1000);
      if (wait > 0) {
        return res.status(429).json({ success: false, retryAfter: wait, message: `Please wait ${wait} seconds before asking for another code.` });
      }
    }
    if (rec && rec.sendCount >= MAX_SENDS_PER_HOUR) {
      return res.status(429).json({ success: false, message: "Too many codes requested for this email. Please try again in an hour." });
    }
    // The limits above apply to every email address, so the response never reveals whether an account exists.
    if (!rec) rec = new PasswordReset({ email, purgeAt: new Date(now.getTime() + 60 * 60 * 1000) });
    rec.lastSentAt = now;
    rec.sendCount += 1;

    const user = await User.findOne({ email }).select("+password");
    if (user) {
      try {
        if (user.password) {
          const otp = String(crypto.randomInt(100000, 1000000));
          rec.otpHash = otpHash(email, otp);
          rec.otpExpiresAt = new Date(now.getTime() + OTP_MINUTES * 60 * 1000);
          rec.attempts = 0;
          if (mailConfigured()) {
            await sendPasswordResetOtp({ to: email, name: user.name, otp, minutes: OTP_MINUTES });
          } else {
            // Development only (production returned 503 above). The code itself is never logged.
            console.warn("Forgot password: SMTP is not configured, so no email was sent. Set SMTP_* in backend/.env.");
          }
        } else if (mailConfigured()) {
          await sendGoogleAccountNotice({ to: email, name: user.name });
        }
      } catch (mailErr) {
        console.error("Forgot password: could not send email:", mailErr.message);
      }
    }
    await rec.save();
    res.json({ success: true, message: GENERIC_SENT, resendIn: RESEND_COOLDOWN_S });
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// POST /api/auth/verify-reset-otp  — body: { email, otp }  ->  { resetToken }
// Checks the emailed code. The code is single-use: on success it is replaced by a short-lived reset token.
export const verifyResetOtp = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "Enter the 6-digit code from your email." });
    }
    if (ipLimited(`vo:${req.ip}`, 30, 10 * 60 * 1000)) {
      return res.status(429).json({ success: false, message: "Too many attempts. Please try again in a few minutes." });
    }

    const invalid = { success: false, message: "This code is invalid or has expired. Please ask for a new one." };
    const rec = await PasswordReset.findOne({ email });
    if (!rec || !rec.otpHash || !rec.otpExpiresAt || rec.otpExpiresAt <= new Date()) return res.status(400).json(invalid);

    const given = Buffer.from(otpHash(email, otp), "hex");
    const real = Buffer.from(rec.otpHash, "hex");
    if (given.length !== real.length || !crypto.timingSafeEqual(given, real)) {
      rec.attempts += 1;
      if (rec.attempts >= MAX_OTP_ATTEMPTS) {
        rec.otpHash = "";
        rec.otpExpiresAt = null;
        await rec.save();
        return res.status(400).json({ success: false, expired: true, message: "Too many wrong attempts. Please ask for a new code." });
      }
      await rec.save();
      return res.status(400).json({ success: false, message: `Incorrect code. ${MAX_OTP_ATTEMPTS - rec.attempts} attempt(s) left.` });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    rec.otpHash = ""; // the OTP cannot be used again
    rec.otpExpiresAt = null;
    rec.attempts = 0;
    rec.resetTokenHash = otpHash(email, resetToken);
    rec.resetTokenExpiresAt = new Date(Date.now() + OTP_MINUTES * 60 * 1000);
    await rec.save();
    res.json({ success: true, message: "Code verified.", resetToken });
  } catch (err) {
    console.error("verifyResetOtp error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// POST /api/auth/reset-password  — body: { email, resetToken, password }
export const resetPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const resetToken = String(req.body?.resetToken || "").trim();
    const password = String(req.body?.password || "");
    if (!EMAIL_RE.test(email) || !/^[a-f0-9]{48}$/.test(resetToken)) {
      return res.status(400).json({ success: false, expired: true, message: "Please verify the code from your email first." });
    }
    if (password.length < 6 || password.length > 100) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }
    if (ipLimited(`rp:${req.ip}`, 30, 10 * 60 * 1000)) {
      return res.status(429).json({ success: false, message: "Too many attempts. Please try again in a few minutes." });
    }

    const expired = { success: false, expired: true, message: "This reset session has expired. Please start again." };
    const rec = await PasswordReset.findOne({ email });
    if (!rec || !rec.resetTokenHash || !rec.resetTokenExpiresAt || rec.resetTokenExpiresAt <= new Date()) return res.status(400).json(expired);
    const given = Buffer.from(otpHash(email, resetToken), "hex");
    const real = Buffer.from(rec.resetTokenHash, "hex");
    if (given.length !== real.length || !crypto.timingSafeEqual(given, real)) return res.status(400).json(expired);

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) return res.status(400).json(expired);
    user.password = password; // hashed by the model's pre-save hook
    await user.save();
    rec.resetTokenHash = ""; // single use
    rec.resetTokenExpiresAt = null;
    await rec.save();
    res.json({ success: true, message: "Your password has been reset. Please sign in with your new password." });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    console.error("resetPassword error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
