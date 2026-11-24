import nodemailer from "nodemailer";

// SMTP settings come from the environment (backend/.env):
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE ("true" for port 465), SMTP_USER, SMTP_PASS, MAIL_FROM
//   or SMTP_SERVICE=gmail with SMTP_USER / SMTP_PASS (a Gmail *app password*, not the normal password).
export const mailConfigured = () =>
  !!(process.env.SMTP_USER && process.env.SMTP_PASS && (process.env.SMTP_HOST || process.env.SMTP_SERVICE));

// The TLS mode must match the port, otherwise the connection fails with
// "ssl3_get_record:wrong version number" (TLS spoken to a plain-text port):
//   465 -> implicit TLS (secure: true)      587 / 25 -> plain connection upgraded with STARTTLS (secure: false)
// Any other port follows SMTP_SECURE.
export const tlsOptionsFor = (port) => {
  if (port === 465) return { port, secure: true };
  if (port === 587 || port === 25) return { port, secure: false, requireTLS: port === 587 };
  return { port, secure: String(process.env.SMTP_SECURE).toLowerCase() === "true" };
};

let transporter;
const getTransporter = () => {
  if (transporter) return transporter;
  const auth = { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
  transporter = process.env.SMTP_SERVICE
    ? nodemailer.createTransport({ service: process.env.SMTP_SERVICE, auth })
    : nodemailer.createTransport({ host: process.env.SMTP_HOST, ...tlsOptionsFor(Number(process.env.SMTP_PORT) || 587), auth });
  return transporter;
};

const fromAddress = () => process.env.MAIL_FROM || `Bhava: <${process.env.SMTP_USER}>`;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Sends the password-reset OTP. Throws if the mail could not be sent. */
export async function sendPasswordResetOtp({ to, name, otp, minutes }) {
  const hi = name ? `Hi ${esc(name)},` : "Hi,";
  await getTransporter().sendMail({
    from: fromAddress(),
    to,
    subject: `${otp} is your Bhava: password reset code`,
    text: `${name ? `Hi ${name},` : "Hi,"}\n\nYour Bhava: password reset code is ${otp}.\nIt is valid for ${minutes} minutes. Do not share it with anyone.\n\nIf you did not ask to reset your password, you can ignore this email - your password stays the same.\n\nBhava: by The Spiritual Company`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:460px;margin:0 auto;padding:28px;background:#FFF8F0;border:1px solid #E8D8C8;border-radius:14px;color:#4A0B1D">
  <h2 style="margin:0 0 4px;color:#D57F45;letter-spacing:1px">BHAVA:</h2>
  <p style="margin:18px 0 6px">${hi}</p>
  <p style="margin:0 0 14px">Use this code to reset your password:</p>
  <p style="font-size:34px;font-weight:700;letter-spacing:10px;margin:0 0 14px;color:#4A0B1D">${esc(otp)}</p>
  <p style="margin:0 0 14px;font-size:14px">It is valid for ${minutes} minutes. Please do not share it with anyone.</p>
  <p style="margin:0;font-size:12px;color:#7a6a6e">If you did not ask to reset your password, you can ignore this email - your password stays the same.</p>
</div>`,
  });
}

/** Tells a Google-sign-in user that they have no password to reset. */
export async function sendGoogleAccountNotice({ to, name }) {
  await getTransporter().sendMail({
    from: fromAddress(),
    to,
    subject: "Your Bhava: account uses Google sign-in",
    text: `${name ? `Hi ${name},` : "Hi,"}\n\nSomeone asked to reset the password for this email address. Your Bhava: account signs in with Google, so there is no password to reset - please use "Continue with Google" on the sign-in page.\n\nIf this wasn't you, you can ignore this email.\n\nBhava: by The Spiritual Company`,
  });
}
