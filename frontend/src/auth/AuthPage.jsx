import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AuthPage.module.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GSI_SRC = "https://accounts.google.com/gsi/client";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Where to go after auth (e.g. back to /cart when coming from checkout)
  const redirectTo = location.state?.from || "/";
  const googleBtnRef = useRef(null);
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
        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
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
        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
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

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, name: "", confirmPassword: "" }));
  };

  // Google Sign-In (Google Identity Services). Only active when a client ID is configured.
  const handleGoogleCredential = async (response) => {
    setLoading(true);
    setError("");
    const BASE = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Google sign-in failed. Please try again.");
      } else {
        localStorage.setItem("bhava_token", data.token);
        localStorage.setItem("bhava_user", JSON.stringify(data.user));
        setSuccess(`Welcome, ${data.user.name}!`);
        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleCallbackRef = useRef(handleGoogleCredential);
  googleCallbackRef.current = handleGoogleCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const init = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (r) => googleCallbackRef.current(r),
      });
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 400,
      });
    };

    if (window.google?.accounts?.id) {
      init();
      return;
    }
    let script = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", init);
    return () => script.removeEventListener("load", init);
  }, [mode]);

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

        {/* Sign In / Sign Up toggle */}
        <div className={styles.tabRow} style={{ width: "100%" }}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

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

        {/* Social sign-in */}
        <div className={styles.orDivider}>
          <span className={styles.orLine} />
          <span className={styles.orText}>or</span>
          <span className={styles.orLine} />
        </div>

        <div className={styles.socialGroup} style={{ alignItems: "center" }}>
          {GOOGLE_CLIENT_ID ? (
            // Real Google button (rendered by Google Identity Services)
            <div ref={googleBtnRef} />
          ) : (
            <button
              type="button"
              className={styles.btnSocial}
              onClick={() => setError("Google sign-in is not set up yet. Please use email for now.")}
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          )}
        </div>

        <p className={styles.termsText}>
          By clicking on Continue, you accept our{" "}
          <span className={styles.termsLink}>Terms of Service</span> and{" "}
          <span className={styles.termsLink}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
