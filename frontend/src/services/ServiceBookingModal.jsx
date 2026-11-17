import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Services.module.css";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Booking-request form. Sends the request to the same inbox as the Contact page (shown in Admin → Contacts). */
export default function ServiceBookingModal({ service, onClose }) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", note: "", website: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");
  const [done, setDone] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    const name = form.name.trim();
    if (name.length < 2) err.name = "Please enter your full name.";
    else if (name.length > 80) err.name = "Name is too long.";
    else if (!/^[\p{L}][\p{L}\p{M}\s.'-]*$/u.test(name)) err.name = "Name can only contain letters, spaces, . ' and -";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) err.mobile = "Enter a valid 10-digit mobile number (starts with 6-9).";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) err.email = "Enter a valid email address.";
    if (form.note.trim().length > 500) err.note = "Please keep the note under 500 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    setApiError("");
    try {
      const res = await fetch(`${BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          service: service.title,
          website: form.website, // honeypot — stays empty for real users
          description: form.note.trim().length >= 10 ? form.note.trim() : `Please contact me with details and availability. ${form.note.trim()}`.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not send your request.");
      setDone(true);
    } catch (ex) {
      setApiError(ex.message || "Could not send your request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className={styles.bkBackdrop} onClick={onClose}>
      <div className={styles.bkCard} role="dialog" aria-modal="true" aria-label={`Book: ${service.title}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.bkClose} onClick={onClose} aria-label="Close">✕</button>
        {done ? (
          <div className={styles.bkDone}>
            <span className={styles.bkTick} aria-hidden="true">✓</span>
            <h3>Request received</h3>
            <p>Thank you, {form.name.trim().split(" ")[0]}. Our team will contact you on {form.mobile.trim()} about <b>{service.title}</b>.</p>
            <button type="button" className={styles.bookBtn} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className={styles.bkKicker}>{service.tag || "Booking request"}</span>
            <h3 className={styles.bkTitle}>{service.title}</h3>
            <p className={styles.bkSub}>Share your details and our team will get back to you to confirm the booking.</p>

            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
              <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></label>
            </div>
            <label className={styles.bkLabel}>Full name
              <input ref={firstRef} className={`${styles.bkInput} ${errors.name ? styles.bkInvalid : ""}`} value={form.name} onChange={set("name")} autoComplete="name" maxLength={80} placeholder="e.g. Asha Verma" />
              {errors.name && <span className={styles.bkErr}>{errors.name}</span>}
            </label>
            <label className={styles.bkLabel}>Mobile number
              <input className={`${styles.bkInput} ${errors.mobile ? styles.bkInvalid : ""}`} value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))} inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" autoComplete="tel-national" />
              {errors.mobile && <span className={styles.bkErr}>{errors.mobile}</span>}
            </label>
            <label className={styles.bkLabel}>Email <small>(optional)</small>
              <input className={`${styles.bkInput} ${errors.email ? styles.bkInvalid : ""}`} value={form.email} onChange={set("email")} type="email" autoComplete="email" placeholder="you@example.com" />
              {errors.email && <span className={styles.bkErr}>{errors.email}</span>}
            </label>
            <label className={styles.bkLabel}>Preferred date or notes <small>(optional)</small>
              <textarea className={`${styles.bkInput} ${errors.note ? styles.bkInvalid : ""}`} rows={3} value={form.note} onChange={set("note")} maxLength={500} placeholder="e.g. Preferred date, puja type, or any request" />
              {errors.note && <span className={styles.bkErr}>{errors.note}</span>}
            </label>

            {apiError && <p className={styles.bkErr} role="alert">{apiError}</p>}
            <button type="submit" className={styles.bkSubmit} disabled={busy}>{busy ? "Sending…" : "Send booking request"}</button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
