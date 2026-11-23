import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Seo, { siteOrigin } from "../components/Seo";
import styles from "./ContactUs.module.css";

const BASE = import.meta.env.VITE_API_URL || "";

function ContactUs() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Please describe your message.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Message must be at least 10 characters.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter((f) => f.size <= 10 * 1024 * 1024);
    setFiles((prev) => [...prev, ...valid].slice(0, 10));
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      const res = await fetch(`${BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          description: form.description.trim(),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setApiError(data.message || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setApiError("Unable to send message. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Message Sent!</h2>
          <p className={styles.successText}>
            Thank you for reaching out. We will get back to you soon.
          </p>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Seo
        title="Contact & Support | Bhava:"
        description="We'd love to hear from you. Send us your inquiry or feedback and our team will respond with care."
        canonical={`${siteOrigin()}/contact`}
      />
      <div className={styles.card}>

        <button className={styles.backArrow} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            We'd love to hear from you. Send us your message and we'll respond with devotion.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          {/* Mobile No — Mandatory */}
          <div className={styles.field}>
            <label className={styles.label}>
              Mobile No. <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              className={`${styles.input} ${errors.mobile ? styles.inputError : ""}`}
            />
            {errors.mobile && <span className={styles.errorMsg}>{errors.mobile}</span>}
          </div>

          {/* Email — Optional */}
          <div className={styles.field}>
            <label className={styles.label}>
              Email <span className={styles.optional}>(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          {/* Message */}
          <div className={styles.field}>
            <label className={styles.label}>
              Your Message <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your message..."
              rows={5}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
            />
            {errors.description && (
              <span className={styles.errorMsg}>{errors.description}</span>
            )}
          </div>

          {/* Attach Files */}
          <div className={styles.field}>
            <label className={styles.label}>
              Attachments <span className={styles.optional}>(Optional)</span>
            </label>
            <label className={styles.fileDropZone}>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className={styles.fileInput}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <span className={styles.fileIcon}>📎</span>
              <span className={styles.fileText}>Attach Files</span>
            </label>
            <p className={styles.fileHint}>
              Attach up to 10 files. The maximum allowed size per file is 10 MB.
            </p>
            {files.length > 0 && (
              <ul className={styles.fileList}>
                {files.map((f, i) => (
                  <li key={i} className={styles.fileItem}>
                    <span className={styles.fileName}>{f.name}</span>
                    <button
                      type="button"
                      className={styles.fileRemove}
                      onClick={() => removeFile(i)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {apiError && <p className={styles.apiError}>{apiError}</p>}

          <button type="submit" className={styles.sendBtn} disabled={submitting}>
            {submitting ? "Sending..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ContactUs;
