import React from "react";
import styles from "./MrpTag.module.css";
import { inr } from "../shop/shopUtils";

/** Struck-through MRP + "% OFF". Renders nothing unless Admin has set an MRP above the selling price. */
const pctOff = (mrp, price) => (mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);

export default function MrpTag({ mrp, price, className = "" }) {
  const off = pctOff(mrp, price);
  if (!off) return null;
  return (
    <span className={`${styles.wrap} ${className}`}>
      <s className={styles.mrp} aria-label={`MRP ${inr(mrp)}`}>{inr(mrp)}</s>
      <em className={styles.off}>{off}% OFF</em>
    </span>
  );
}
