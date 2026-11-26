import React from "react";
import styles from "./MrpTag.module.css";
import { inr } from "../shop/shopUtils";

/** Struck-through MRP + "% OFF". Renders nothing unless Admin has set an MRP above the selling price. */
const pctOff = (mrp, price) => (mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);

export default function MrpTag({ mrp, price, className = "", variant = "", note = "" }) {
  const off = pctOff(mrp, price);
  if (!off) return null;
  if (variant === "savings") {
    // Product pages: struck MRP beside the price, then a "You save ₹X (N%)" line underneath
    return (
      <>
        <s className={`${styles.mrp} ${styles.mrpInline}`} aria-label={`MRP ${inr(mrp)}`}>{inr(mrp)}</s>
        <span className={styles.save}>
          <span className={styles.saveText}>You save {inr(mrp - price)} ({off}% off)</span>
          {note && (<><span className={styles.saveSep} aria-hidden="true" /><span className={styles.saveNote}>{note}</span></>)}
        </span>
      </>
    );
  }
  return (
    <span className={`${styles.wrap} ${className}`}>
      <s className={styles.mrp} aria-label={`MRP ${inr(mrp)}`}>{inr(mrp)}</s>
      <em className={styles.off}>{off}% OFF</em>
    </span>
  );
}

