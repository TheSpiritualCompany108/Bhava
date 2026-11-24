import React, { useEffect, useRef, useState } from "react";
import styles from "./ForgotPassword.module.css";

const BASE = import.meta.env.VITE_API_URL || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_LEN = 6;

async function post(path, body) {
  const res = await fetch(`${BASE}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page */
  }
  return { ok: res.ok && data.success, data };
}

const maskEmail = (email) => {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 2)}••••@${domain}`;
};

const Icon = ({ name }) => (
  <span className="material-symbols-outlined" aria-hidden="true">{name}</span>
);

/**
 * Forgot-password flow, three screens:
 *   1) email  -> a 6-digit code is emailed
 *   2) otp    -> six boxes; the code is checked on the server ("Verify OTP")
 *   3) password -> choose a new password (needs the token returned by step 2)
 * `onBack()` returns to sign-in, `onDone(email, message)` runs after a successful reset,
 * `notify(type, message)` shows a toast at the top of the page.
 */
export default function ForgotPassword({ initialEmail = "", onBack, onDone, notify }) {
  const [step, setStep] = useState("email"); // "email" | "otp" | "password"
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState(Array(OTP_LEN).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const boxes = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp") boxes.current[0]?.focus();
  }, [step]);

  const code = digits.join("");

  // ── 1) send the code ──
  const sendCode = async (e, isResend = false) => {
    e?.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      notify("error", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await post("forgot-password", { email: clean });
      if (!ok) {
        if (data.retryAfter) {
          setCooldown(data.retryAfter);
          if (step === "email") { setEmail(clean); setStep("otp"); }
        }
        notify("error", data.message || "Could not send the code. Please try again.");
        return;
      }
      setEmail(clean);
      setCooldown(data.resendIn || 60);
      setDigits(Array(OTP_LEN).fill(""));
      setStep("otp");
      notify("success", isResend ? "A new code has been sent to your email." : "Verification code sent — please check your email.");
    } catch {
      notify("error", "Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP boxes ──
  const setDigit = (i, value) => setDigits((d) => d.map((x, k) => (k === i ? value : x)));
  const fillFrom = (i, text) => {
    const chars = text.replace(/\D/g, "").slice(0, OTP_LEN - i).split("");
    if (!chars.length) return;
    setDigits((d) => d.map((x, k) => (k >= i && k < i + chars.length ? chars[k - i] : x)));
    boxes.current[Math.min(i + chars.length, OTP_LEN - 1)]?.focus();
  };
  const onBoxChange = (i, e) => {
    setOtpError(false);
    const v = e.target.value.replace(/\D/g, "");
    if (v.length > 1) return fillFrom(i, v); // autofill / paste straight into one box
    setDigit(i, v);
    if (v && i < OTP_LEN - 1) boxes.current[i + 1]?.focus();
    return undefined;
  };
  const onBoxKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setDigit(i - 1, "");
      boxes.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      boxes.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < OTP_LEN - 1) {
      boxes.current[i + 1]?.focus();
    }
  };
  const onBoxPaste = (e) => {
    e.preventDefault();
    setOtpError(false);
    fillFrom(0, e.clipboardData.getData("text")); // a pasted code always starts from the first box
  };

  // ── 2) verify the code ──
  const verifyCode = async (e) => {
    e?.preventDefault();
    if (code.length !== OTP_LEN) {
      notify("error", "Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await post("verify-reset-otp", { email, otp: code });
      if (!ok) {
        setOtpError(true);
        notify("error", data.message || "Could not verify the code. Please try again.");
        setDigits(Array(OTP_LEN).fill(""));
        setTimeout(() => boxes.current[0]?.focus(), 0);
        return;
      }
      setResetToken(data.resetToken);
      setStep("password");
      notify("success", "Code verified. Now choose a new password.");
    } catch {
      notify("error", "Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── 3) set the new password ──
  const resetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      notify("error", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      notify("error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await post("reset-password", { email, resetToken, password });
      if (!ok) {
        notify("error", data.message || "Could not reset the password. Please try again.");
        if (data.expired) { setStep("email"); setResetToken(""); }
        return;
      }
      onDone(email, data.message);
    } catch {
      notify("error", "Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Spinner = <span className={styles.spinner} />;

  return (
    <div className={styles.wrap}>
      {step === "email" && (
        <form onSubmit={sendCode} noValidate>
          <button type="button" className={styles.back} onClick={onBack}>
            <Icon name="arrow_back" /> Back to Sign In
          </button>
          <div className={styles.badge}><Icon name="lock_reset" /></div>
          <h2 className={styles.title}>Forgot password?</h2>
          <p className={styles.lead}>Enter your account email and we&apos;ll send you a 6-digit code to reset your password.</p>

          <label className={styles.label} htmlFor="fp-email">Email address</label>
          <div className={styles.field}>
            <span className={`material-symbols-outlined ${styles.fieldIcon}`} aria-hidden="true">mail</span>
            <input
              id="fp-email"
              className={styles.fieldInput}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.primary} disabled={loading}>
            {loading ? Spinner : "Send Code"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyCode} noValidate>
          <button type="button" className={styles.back} onClick={() => setStep("email")}>
            <Icon name="arrow_back" /> Back
          </button>
          <div className={styles.badge}><Icon name="verified_user" /></div>
          <h2 className={styles.title}>Verify OTP</h2>
          <p className={styles.lead}>Enter the 6-digit verification code sent to your email address.</p>
          <div className={styles.pill}><Icon name="mail" /> {maskEmail(email)}</div>

          <span className={`${styles.label} ${styles.labelCenter}`} id="fp-otp-label">Verification code</span>
          <div className={styles.otpRow} role="group" aria-labelledby="fp-otp-label">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { boxes.current[i] = el; }}
                className={`${styles.otpBox} ${d ? styles.otpFilled : ""} ${otpError ? styles.otpError : ""}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={OTP_LEN}
                value={d}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => onBoxChange(i, e)}
                onKeyDown={(e) => onBoxKeyDown(i, e)}
                onPaste={onBoxPaste}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button type="submit" className={styles.primary} disabled={loading || code.length !== OTP_LEN}>
            {loading ? Spinner : "Verify OTP"}
          </button>
          <p className={styles.resend}>
            <span className={styles.muted}>Didn&apos;t receive the code?</span>{" "}
            {cooldown > 0 ? (
              <span className={styles.muted}>Resend OTP in {cooldown}s</span>
            ) : (
              <button type="button" className={styles.linkBtn} onClick={(e) => sendCode(e, true)} disabled={loading}>
                Resend OTP
              </button>
            )}
          </p>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={resetPassword} noValidate>
          <button type="button" className={styles.back} onClick={onBack}>
            <Icon name="arrow_back" /> Back to Sign In
          </button>
          <h2 className={styles.title} style={{ textAlign: "left" }}>Create a new password</h2>
          <p className={styles.lead} style={{ textAlign: "left", marginLeft: 0 }}>
            Choose a fresh password for your Bhava: account.
          </p>

          <label className={styles.label} htmlFor="fp-new">New password</label>
          <div className={styles.field}>
            <span className={`material-symbols-outlined ${styles.fieldIcon}`} aria-hidden="true">lock</span>
            <input
              id="fp-new"
              className={styles.fieldInput}
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className={styles.eye} onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
              <Icon name={showPassword ? "visibility_off" : "visibility"} />
            </button>
          </div>

          <label className={styles.label} htmlFor="fp-confirm">Confirm password</label>
          <div className={styles.field}>
            <span className={`material-symbols-outlined ${styles.fieldIcon}`} aria-hidden="true">lock</span>
            <input
              id="fp-confirm"
              className={styles.fieldInput}
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {confirm && (
            <p className={`${styles.hint} ${password === confirm ? styles.hintOk : styles.hintBad}`}>
              {password === confirm ? "✓ Passwords match" : "Passwords do not match yet"}
            </p>
          )}

          <button type="submit" className={styles.primary} disabled={loading || password.length < 6 || password !== confirm}>
            {loading ? Spinner : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
