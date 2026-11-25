import React from "react";
import styles from "./BraceletPreview.module.css";
import { imgSrc } from "../shop/shopUtils";

/**
 * Personalised preview for "Any N bracelets" collections: one slot per bracelet to pick,
 * filled in selection order with each bracelet's own product photo. Empty slots stay as clean placeholders.
 */
export default function BraceletPreview({ count, picked }) {
  const slots = Array.from({ length: count }, (_, i) => picked[i] || null);
  return (
    <div className={styles.stage}>
    <div className={styles.preview} data-count={count} role="group" aria-label={`Your selection: ${picked.length} of ${count} bracelets`}>
      {slots.map((p, i) => (
        <figure key={p ? p.slug : `empty-${i}`} className={`${styles.slot} ${p ? styles.filled : styles.empty}`}>
          {p ? (
            <>
              <img src={imgSrc(p.image)} alt={p.name} width={400} height={400} decoding="async" />
              <figcaption>{p.name.replace(" Bracelet", "")}</figcaption>
            </>
          ) : (
            <div className={styles.ph} aria-label={`Bracelet ${i + 1} not chosen yet`}>
              <span className={styles.plus} aria-hidden="true">+</span>
              <span>Bracelet {i + 1}</span>
            </div>
          )}
        </figure>
      ))}
    </div>
    </div>
  );
}
