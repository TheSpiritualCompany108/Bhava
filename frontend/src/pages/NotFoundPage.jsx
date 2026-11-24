import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <Seo
        title="Page Not Found (404) | Bhava:"
        description="The sacred path you are looking for does not exist or may have moved."
        noindex
      />
      <div className={styles.box}>
        <span className={`material-symbols-outlined ${styles.lotus}`}>spa</span>
        <p className={styles.code}>404 — Not Found</p>
        <h1 className={styles.title}>This sacred path is quiet</h1>
        <p className={styles.subtitle}>
          The page you requested could not be found. It may have been moved, renamed,
          or perhaps it was just a moment of wandering.
        </p>
        <div className={styles.actions}>
          <Link to="/products" className={styles.btnPrimary}>
            <span className="material-symbols-outlined">storefront</span>
            Explore Sacred Shop
          </Link>
          <Link to="/" className={styles.btnSecondary}>
            <span className="material-symbols-outlined">home</span>
            Back to Home
          </Link>
          <Link to="/knowledge" className={styles.btnSecondary}>
            <span className="material-symbols-outlined">menu_book</span>
            Sacred Knowledge
          </Link>
        </div>
      </div>
    </main>
  );
}
