import React, { useEffect, useState } from "react";
import s from "./AdminCatalog.module.css";
import { imgUrl, downloadImage } from "./adminApi";

export function Notice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div className={`${s.notice} ${notice.type === "ok" ? s.nOk : s.nErr}`} role={notice.type === "ok" ? "status" : "alert"}>
      <span>{notice.type === "ok" ? "✓ " : "⚠ "}{notice.text}</span>
      <button className={s.nClose} onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  );
}

export function Modal({ title, onClose, children, footer, small }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className={s.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${s.modal} ${small ? s.modalSm : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className={s.modalHead}><h3>{title}</h3><button className={s.x} onClick={onClose} aria-label="Close">✕</button></div>
        <div className={s.modalBody}>{children}</div>
        {footer && <div className={s.modalFoot}>{footer}</div>}
      </div>
    </div>
  );
}

/** Replaces window.confirm for destructive actions. */
export function Confirm({ title, message, confirmLabel = "Confirm", danger, busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} small
      footer={<>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={onCancel} disabled={busy}>Cancel</button>
        <button className={`${s.btn} ${danger ? "" : ""}`} style={danger ? { background: "#a2331f" } : undefined} onClick={onConfirm} disabled={busy}>{busy ? "Working…" : confirmLabel}</button>
      </>}>
      <p style={{ margin: 0, lineHeight: 1.6, fontSize: 14 }}>{message}</p>
    </Modal>
  );
}

export function ErrorList({ error }) {
  if (!error) return null;
  const list = (error.errors || []).filter((e) => e.message !== error.message);
  return (
    <div className={s.errBox} role="alert">
      <strong>{error.message}</strong>
      {list.length > 0 && <ul>{list.map((e, i) => <li key={i}>{e.message}</li>)}</ul>}
    </div>
  );
}

export const StatusBadge = ({ status }) => (
  <span className={`${s.badge} ${status === "active" ? s.bOk : status === "inactive" ? s.bWarn : s.bOff}`}>{status}</span>
);

/** Full-size image preview with download. images: [{ url, name }] */
export function ImageLightbox({ images, start = 0, onClose }) {
  const [i, setI] = useState(start);
  const [busy, setBusy] = useState(false);
  const cur = images[i];
  const many = images.length > 1;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (many && e.key === "ArrowRight") setI((x) => (x + 1) % images.length);
      if (many && e.key === "ArrowLeft") setI((x) => (x - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, many, images.length]);
  if (!cur) return null;
  const download = async () => {
    setBusy(true);
    await downloadImage(cur.url, cur.name);
    setBusy(false);
  };
  return (
    <div className={s.lbBackdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.lbBox} role="dialog" aria-modal="true" aria-label="Image preview">
        <div className={s.lbBar}>
          <span className={s.lbName}>{cur.name}{many ? ` · ${i + 1}/${images.length}` : ""}</span>
          <div className={s.actions}>
            <button className={s.btn} onClick={download} disabled={busy}>{busy ? "Downloading…" : "⬇ Download"}</button>
            <a className={`${s.btn} ${s.btnGhost}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }} href={imgUrl(cur.url)} target="_blank" rel="noopener noreferrer">Open</a>
            <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} aria-label="Close preview">✕</button>
          </div>
        </div>
        <div className={s.lbStage}>
          {many && <button className={`${s.lbNav} ${s.lbPrev}`} onClick={() => setI((i - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>}
          <img className={s.lbImg} src={imgUrl(cur.url)} alt={cur.name} />
          {many && <button className={`${s.lbNav} ${s.lbNext}`} onClick={() => setI((i + 1) % images.length)} aria-label="Next image">›</button>}
        </div>
      </div>
    </div>
  );
}
