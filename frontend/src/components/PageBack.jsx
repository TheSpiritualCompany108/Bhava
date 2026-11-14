import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PageBack.module.css";

function useGoBack(fallbackPath) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.key && location.key !== "default") {
      navigate(-1);
      return;
    }
    navigate(fallbackPath);
  }, [location.key, navigate, fallbackPath]);
}

/** Compact back control for inside a page (e.g. PDP details column). */
export function InlineBack({ fallback = "/products", className = "" }) {
  const goBack = useGoBack(fallback);
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnInline} ${className}`.trim()}
      onClick={goBack}
      aria-label="Go back"
    >
      <span className={styles.arrow} aria-hidden="true">←</span>
      Back
    </button>
  );
}

function barFallback(path) {
  if (path === "/cart" || path === "/checkout") return "/products";
  if (path.startsWith("/account")) return "/";
  if (path.startsWith("/knowledge")) return "/knowledge";
  return "/";
}

/** Top bar under the navbar — pages that don’t have their own inline back. */
export default function PageBack() {
  const location = useLocation();
  const path = location.pathname;
  // No top back bar on primary nav / marketing landings (PDP still has InlineBack)
  const primaryLandings = new Set([
    "/",
    "/products",
    "/services",
    "/daily-horoscope",
    "/knowledge",
    "/about",
    "/app",
    "/community",
    "/explore-services",
    "/cart",
  ]);
  const hidden =
    primaryLandings.has(path)
    || path.startsWith("/product")
    || path.startsWith("/products/")
    || path.startsWith("/collection")
    || path.startsWith("/admin");

  const goBack = useGoBack(barFallback(path));

  if (hidden) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <button type="button" className={styles.btn} onClick={goBack} aria-label="Go back">
          <span className={styles.arrow} aria-hidden="true">←</span>
          Back
        </button>
      </div>
    </div>
  );
}
