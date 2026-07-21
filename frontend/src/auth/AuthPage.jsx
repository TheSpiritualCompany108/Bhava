import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");   // shown when redirected to signup
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // Detects "user not found" type errors from the backend
  const isNotFoundError = (msg = "") => {
    const lower = msg.toLowerCase();
    return (
      lower.includes("not found") ||
      lower.includes("no account") ||
      lower.includes("does not exist") ||
      lower.includes("doesn't exist") ||
      lower.includes("not registered") ||
      lower.includes("invalid email") ||
      lower.includes("user not")
    );
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    const BASE = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (!data.success) {
        if (isNotFoundError(data.message)) {
          // Account doesn't exist — guide user to sign up
          setMode("signup");
          setInfo("No account found with this email. Please create one below.");
          setError("");
        } else {
          setError(data.message || "Incorrect password. Please try again.");
        }
      } else {
        localStorage.setItem("bhava_token", data.token);
        localStorage.setItem("bhava_user", JSON.stringify(data.user));
        setSuccess(`Welcome back, ${data.user.name}!`);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    const BASE = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        localStorage.setItem("bhava_token", data.token);
        localStorage.setItem("bhava_user", JSON.stringify(data.user));
        setSuccess(`Welcome to Bhava, ${data.user.name}!`);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") handleLogin();
    else handleSignup();
  };

  const switchToLogin = () => {
    setMode("login");
    setError("");
    setInfo("");
    setFormData((prev) => ({ ...prev, name: "", confirmPassword: "" }));
  };

  return (
    <div className={styles.page}>
      {/* Close button */}
      <button className={styles.closeBtn} onClick={() => navigate(-1)} aria-label="Close">
        &#x2715;
      </button>

      <div className={styles.card}>
        {/* Bhava Logo */}
        <img src="/bhava-icon.png" alt="Bhava" className={styles.logoMark} />
        {/* <div className={styles.logoText}>BHAVA  <span className={styles.dotsBhava}>
                          <span className={styles.dotName}></span>
                          <span className={styles.dotName}></span>
                        </span></div> */}

                          <h2 className={styles.heading}>
                                         BHAVA
                                         <span className={styles.dotsBhava}>
                                           <span className={styles.dotName}></span>
                                           <span className={styles.dotName}></span>
                                         </span>
                                       </h2>

        <h1 className={styles.title}>
          {mode === "login" ? "Swagatam" : "Create Account"}
        </h1>
        <p className={styles.subtitle}>
          {mode === "login"
            ? "We'll check if you have an account, and help create one if you don't."
            : "Fill in the details below to begin your sacred journey."}
        </p>

        {/* Info banner (shown when redirected from login) */}
        {info && <p className={styles.infoMsg}>{info}</p>}

        <form onSubmit={handleSubmit} className={styles.mainForm}>
          {/* Full Name — signup only */}
          {mode === "signup" && (
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
            </div>
          )}

          {/* Email */}
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              autoFocus={mode === "login"}
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
            />
          </div>

          {/* Confirm Password — signup only */}
          {mode === "signup" && (
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
              />
            </div>
          )}

          {error && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <button type="submit" className={styles.btnContinue} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Social options — login only */}
        {mode === "login" && (
          <>
            <div className={styles.orDivider}>
              <span className={styles.orLine} />
              <span className={styles.orText}>or</span>
              <span className={styles.orLine} />
            </div>

            <div className={styles.socialGroup}>
              <button className={styles.btnSocial}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <button className={styles.btnSocial}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Continue with Apple
              </button>
            </div>
          </>
        )}

        <p className={styles.termsText}>
          By clicking on Continue, you accept our{" "}
          <span className={styles.termsLink}>Terms of Service</span> and{" "}
          <span className={styles.termsLink}>Privacy Policy</span>
        </p>

        {/* Switch back to login from signup */}
        {mode === "signup" && (
          <button className={styles.backBtn} onClick={switchToLogin}>
            &#8592; Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
