import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Wishlist.module.css";

const WishlistContext = createContext(null);
const KEY = "bhava_wishlist"; // list of product slugs (this browser)

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [slugs, setSlugs] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch { /* storage full / private mode */ }
  }, [slugs]);

  // keep several tabs in sync
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setSlugs(load()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const [toast, setToast] = useState(null); // { id, added, name }
  const timer = useRef(0);
  const slugsRef = useRef(slugs);
  useEffect(() => { slugsRef.current = slugs; }, [slugs]);

  const toggle = useCallback((slug, name = "Product") => {
    const added = !slugsRef.current.includes(slug);
    setSlugs((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur].slice(0, 100)));
    setToast({ id: Date.now(), added, name });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(() => ({ slugs, count: slugs.length, has: (s) => slugs.includes(s), toggle }), [slugs, toggle]);
  return (
    <WishlistContext.Provider value={value}>
      {children}
      {toast && (
        <div key={toast.id} className={styles.toast} role="status" aria-live="polite">
          <span className={styles.toastText}>
            <b>{toast.name}</b> {toast.added ? "added to your wishlist" : "removed from your wishlist"}
          </span>
          {toast.added && <Link to="/wishlist" className={styles.toastLink} onClick={() => setToast(null)}>View</Link>}
        </div>
      )}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- same provider+hook pattern as CartContext
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
