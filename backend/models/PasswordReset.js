import mongoose from "mongoose";

// One short-lived record per email address while a password reset is in progress.
// The OTP itself is never stored — only an HMAC of it. The whole record is removed by MongoDB after `purgeAt`.
const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otpHash: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null }, // the OTP is valid for 10 minutes
    attempts: { type: Number, default: 0 },      // wrong guesses for the current OTP
    resetTokenHash: { type: String, default: "" },        // set after the OTP is verified; lets the user choose a new password once
    resetTokenExpiresAt: { type: Date, default: null },
    lastSentAt: { type: Date, default: null },   // resend cooldown
    sendCount: { type: Number, default: 0 },     // OTP requests in the current hour
    purgeAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // start of the hourly window + 1 h
  },
  { timestamps: true }
);

export default mongoose.model("PasswordReset", passwordResetSchema);
