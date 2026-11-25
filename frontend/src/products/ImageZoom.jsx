import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ImageZoom.module.css";
import { imgSrc } from "../shop/shopUtils";

/** Product photo shown large in a light overlay. Click outside, ✕ or Escape closes it. */
export default function ImageZoom({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className={styles.back} onClick={onClose} role="dialog" aria-modal="true" aria-label={item.name}>
      <figure className={styles.fig} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close" autoFocus>✕</button>
        <img src={imgSrc(item.image)} alt={item.name} />
        <figcaption>{item.name}</figcaption>
      </figure>
    </div>,
    document.body
  );
}
