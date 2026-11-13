import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import s from "./AdminCatalog.module.css";
import { Modal } from "./common";

const SITE = (import.meta.env.VITE_SITE_URL || "https://www.bhavaglobal.com").replace(/\/$/, "");

const CARD = {
  width: 720,
  height: 960,
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
    await document.fonts.load('700 72px "Canela"');
    await document.fonts.load('500 28px "Neue Haas Grotesk"');
    await document.fonts.ready;
  } catch {
    /* fallback fonts below */
  }
}

/** Compose branded Bhava QR card (matches store print template). */
async function buildBrandedQrCard(targetUrl, displayPath) {
  await waitForFonts();

  const qrSize = 420;
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: CARD.ink, light: CARD.bg },
  });

  const qrImg = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = CARD.width;
  canvas.height = CARD.height;
  const ctx = canvas.getContext("2d");

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

  // BHAVA
  ctx.fillStyle = CARD.brand;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '700 72px "Canela", "Cormorant Garamond", Georgia, serif';
  ctx.fillText("BHAVA", CARD.width / 2, 130);

  // Sacred Collections
  ctx.fillStyle = CARD.ink;
  ctx.font = '500 26px "Neue Haas Grotesk", Inter, Arial, sans-serif';
  ctx.fillText("Sacred Collections", CARD.width / 2, 190);

  // QR
  const qrX = (CARD.width - qrSize) / 2;
  const qrY = 250;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

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
