import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import s from "./AdminCatalog.module.css";
import { Modal } from "./common";

const SITE = (import.meta.env.VITE_SITE_URL || "https://www.bhavaglobal.com").replace(/\/$/, "");

const CARD = {
  width: 720,
  height: 960,
  scale: 3,
  bg: "#FFF8F0",
  border: "#E07B39",
  brand: "#D57F45",
  ink: "#4A0B1D",
  radius: 48,
  borderWidth: 5,
};

export function productPageUrl(slug) {
  if (!slug) return "";
  // Match storefront route `/products/:id` + print footer style
  return `${SITE}/products/${slug}`;
}

export function productQrDisplayPath(slug) {
  if (!slug) return "bhavaglobal.com/products";
  return `bhavaglobal.com/products/${slug}`;
}

async function waitForFonts() {
  if (!document.fonts?.ready) return;
  try {
    await document.fonts.load('500 72px "Canela"');
    await document.fonts.load('500 28px "Neue Haas Grotesk"');
    await document.fonts.ready;
  } catch {
    /* fallback fonts below */
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Knock out near-black pixels so gold mark sits clean on cream badge. */
function logoOnClear(img) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0);
  const frame = x.getImageData(0, 0, c.width, c.height);
  const d = frame.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] < 42 && d[i + 1] < 42 && d[i + 2] < 42) d[i + 3] = 0;
  }
  x.putImageData(frame, 0, 0);
  return c;
}

/** Compose branded Bhava: QR card (matches store print template). */
async function buildBrandedQrCard(targetUrl, displayPath) {
  await waitForFonts();

  const qrSize = 420;
  // H = high redundancy so a center logo still scans
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: qrSize * CARD.scale,
    margin: 1,
    errorCorrectionLevel: "H",
    color: { dark: CARD.ink, light: CARD.bg },
  });

  const [qrImg, logoImg] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage("/bhava-icon.png"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CARD.width * CARD.scale;
  canvas.height = CARD.height * CARD.scale;
  const ctx = canvas.getContext("2d");
  // Draw in logical card units while exporting a sharp 2160 × 2880 PNG.
  ctx.scale(CARD.scale, CARD.scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Card background
  ctx.fillStyle = CARD.bg;
  roundRect(ctx, 0, 0, CARD.width, CARD.height, CARD.radius);
  ctx.fill();

  // Orange rounded frame
  ctx.strokeStyle = CARD.border;
  ctx.lineWidth = CARD.borderWidth;
  roundRect(
    ctx,
    CARD.borderWidth / 2 + 10,
    CARD.borderWidth / 2 + 10,
    CARD.width - CARD.borderWidth - 20,
    CARD.height - CARD.borderWidth - 20,
    CARD.radius - 8,
  );
  ctx.stroke();

  // BHAVA:
  ctx.fillStyle = CARD.brand;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '500 72px "Canela", "Cormorant Garamond", Georgia, serif';
  ctx.fillText("BHAVA:", CARD.width / 2, 130);

  // Sacred Collections
  ctx.fillStyle = CARD.ink;
  ctx.font = '500 26px "Neue Haas Grotesk", Inter, Arial, sans-serif';
  ctx.fillText("Sacred Collections", CARD.width / 2, 190);

  // QR
  const qrX = (CARD.width - qrSize) / 2;
  const qrY = 250;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Bhava logo in QR center — cream badge (#FFF8F0) + clear black PNG bg
  // bhava-icon.png is 400×573 (taller than wide) — never force a square draw box
  const badgeR = 56;
  const maxLogo = badgeR * 1.55;
  const clearLogo = logoOnClear(logoImg);
  const natW = clearLogo.width;
  const natH = clearLogo.height;
  const scale = Math.min(maxLogo / natW, maxLogo / natH);
  const logoW = natW * scale;
  const logoH = natH * scale;
  const cx = qrX + qrSize / 2;
  const cy = qrY + qrSize / 2;

  ctx.save();
  // Soft cream halo so QR modules don't crash into the badge
  ctx.beginPath();
  ctx.arc(cx, cy, badgeR + 8, 0, Math.PI * 2);
  ctx.fillStyle = CARD.bg; // #FFF8F0
  ctx.fill();

  // Cream disc (requested logo bg)
  ctx.beginPath();
  ctx.arc(cx, cy, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = "#FFF8F0";
  ctx.fill();

  // Clip logo to the disc
  ctx.beginPath();
  ctx.arc(cx, cy, badgeR - 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(clearLogo, cx - logoW / 2, cy - logoH / 2, logoW, logoH);
  ctx.restore();

  // Thin orange ring
  ctx.beginPath();
  ctx.arc(cx, cy, badgeR + 1.5, 0, Math.PI * 2);
  ctx.strokeStyle = CARD.border;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Footer copy
  ctx.fillStyle = CARD.ink;
  ctx.font = '500 22px "Neue Haas Grotesk", Inter, Arial, sans-serif';
  ctx.fillText("Scan to explore our products", CARD.width / 2, 740);

  ctx.fillStyle = CARD.brand;
  ctx.font = '600 20px "Neue Haas Grotesk", Inter, Arial, sans-serif';
  const footer = displayPath || "bhavaglobal.com/products";
  // Shrink slightly if slug makes the line long
  if (footer.length > 36) {
    ctx.font = '600 16px "Neue Haas Grotesk", Inter, Arial, sans-serif';
  }
  ctx.fillText(footer, CARD.width / 2, 780);

  return canvas.toDataURL("image/png");
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export default function QrDialog({ product, onClose }) {
  const url = productPageUrl(product?.slug);
  const displayPath = productQrDisplayPath(product?.slug);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setDataUrl("");
    if (!url) {
      setError("This product has no slug, so a QR link cannot be generated.");
      return undefined;
    }
    buildBrandedQrCard(url, displayPath)
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch(() => {
        if (!cancelled) setError("Could not generate QR code. Try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [url, displayPath]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal
      title={`Product QR — ${product.name}`}
      onClose={onClose}
      small
      footer={
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={onClose}>
            Close
          </button>
          <a
            className={`${s.btn} ${!dataUrl ? s.btnDisabled : ""}`}
            href={dataUrl || undefined}
            download={`${product.slug}-qr.png`}
            aria-disabled={!dataUrl}
            onClick={(e) => {
              if (!dataUrl) e.preventDefault();
            }}
          >
            Download PNG
          </a>
        </>
      }
    >
      <div className={s.qrBox}>
        <p className={s.qrName}>{product.name}</p>
        {error && (
          <p className={s.nErr} style={{ margin: "8px 0", padding: "8px 10px", borderRadius: 8 }}>
            {error}
          </p>
        )}
        {!error && !dataUrl && <p className={s.loading}>Generating QR…</p>}
        {dataUrl && (
          <img
            className={s.qrCardImg}
            src={dataUrl}
            alt={`Branded QR card for ${product.name}`}
            width={280}
            height={373}
          />
        )}
        <a className={s.qrUrl} href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
        <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={copyLink}>
          {copied ? "Copied!" : "Copy link"}
        </button>
        <p className={s.hint} style={{ marginBottom: 0 }}>
          Download the branded card — scan opens this product on the storefront.
        </p>
      </div>
    </Modal>
  );
}
