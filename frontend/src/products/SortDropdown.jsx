import React, { useEffect, useRef, useState } from "react";
import styles from "./Products.module.css";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

/** Branded replacement for the native <select> (native popups can't be styled to match the site). */
export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef(null);
  const current = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("touchstart", away);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("touchstart", away); };
  }, [open]);

  const choose = (v) => { onChange(v); setOpen(false); };
  const toggle = () => { setActive(Math.max(0, OPTIONS.indexOf(current))); setOpen((o) => !o); };

  const onKey = (e) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { toggle(); return; }
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + OPTIONS.length) % OPTIONS.length);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      choose(OPTIONS[active].value);
    }
  };

  return (
    <div className={styles.sortDd} ref={wrap} onKeyDown={onKey}>
      <button
        type="button"
        id="sortSelect"
        className={`${styles.sortBtn} ${open ? styles.sortBtnOpen : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
      >
        <span>{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.sortChevron}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <ul className={styles.sortMenu} role="listbox" aria-labelledby="sortSelect">
          {OPTIONS.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`${styles.sortOpt} ${o.value === value ? styles.sortOptOn : ""} ${i === active ? styles.sortOptActive : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o.value)}
            >
              {o.label}
              {o.value === value && <span aria-hidden="true">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
