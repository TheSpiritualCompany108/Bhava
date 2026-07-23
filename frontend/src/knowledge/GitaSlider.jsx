import { useState } from "react";
import styles from "./GitaSlider.module.css";
import { getTodaysQuote } from "./gitaQuotes";

const quote = getTodaysQuote();
const krishnaImage = "/krishna02.png";

/** Wrap text to fit within maxWidth on a canvas context */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Load an image from a URL and return an HTMLImageElement */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Build a shareable PNG blob that matches the card design */
async function buildShareImage(quoteText, refText) {
  const W = 640, H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Outer dark background
  ctx.fillStyle = "#1C1714";
  ctx.fillRect(0, 0, W, H);

  // Card geometry
  const pad = 36;
  const cx = pad, cy = pad, cw = W - pad * 2, ch = H - pad * 2;
  const r = 24;

  // Card shadow
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;

  // Card fill
  ctx.beginPath();
  ctx.moveTo(cx + r, cy);
  ctx.lineTo(cx + cw - r, cy);
  ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + r);
  ctx.lineTo(cx + cw, cy + ch - r);
  ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - r, cy + ch);
  ctx.lineTo(cx + r, cy + ch);
  ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - r);
  ctx.lineTo(cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.closePath();
  ctx.fillStyle = "#F2EDE3";
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // Card border
  ctx.strokeStyle = "rgba(160,60,40,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Quote text
  const textPad = 80;
  const textW = cw - textPad * 2;
  ctx.fillStyle = "#5C1E1E";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const fontSize = 22;
  ctx.font = `400 ${fontSize}px Georgia, "Times New Roman", serif`;
  const lines = wrapText(ctx, quoteText, textW);
  const lineH = fontSize * 1.6;
  const totalTextH = lines.length * lineH;

  // Vertically center the text block (leaving room for ref + logo at bottom)
  const refH = 40, logoH = 48, dividerH = 28;
  const contentH = totalTextH + dividerH + refH + logoH;
  const startY = cy + (ch - contentH) / 2;

  lines.forEach((ln, i) => {
    ctx.fillText(ln, W / 2, startY + i * lineH);
  });

  // Divider
  const divY = startY + totalTextH + 18;
  ctx.strokeStyle = "rgba(160,60,40,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 36, divY);
  ctx.lineTo(W / 2 + 36, divY);
  ctx.stroke();

  // Reference text
  const refY = divY + 14;
  ctx.fillStyle = "#9B3A2A";
  ctx.font = `700 11px "Arial", sans-serif`;
  ctx.letterSpacing = "2px";
  ctx.fillText(refText.toUpperCase(), W / 2, refY);

  // BHAVA logo area
  const logoY = refY + refH;
  const logoImg = await loadImage("/logo(3).png");
  const logoSize = 36;
  // measure text widths to center the whole row
  ctx.font = `800 22px "Arial Black", "Arial", sans-serif`;
  const bhavaW = ctx.measureText("BHAVA").width;
  ctx.font = `800 22px "Arial Black", "Arial", sans-serif`;
  const colonW = ctx.measureText(":").width;
  const gap = 10; // space between logo and "BHAVA"
  const colonGap = 4;
  const rowW = logoSize + gap + bhavaW + colonGap + colonW;
  const rowX = W / 2 - rowW / 2;

  // Draw logo image
  ctx.drawImage(logoImg, rowX, logoY - 4, logoSize, logoSize);

  // "BHAVA" in dark green
  ctx.fillStyle = "#1A4A2E";
  ctx.font = `800 22px "Arial Black", "Arial", sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("BHAVA", rowX + logoSize + gap, logoY + 10);

  // Orange ":"
  ctx.fillStyle = "#E07820";
  ctx.fillText(":", rowX + logoSize + gap + bhavaW + colonGap, logoY + 10);

  // reset alignment
  ctx.textAlign = "center";

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function GitaSlider() {
  const [shareOpen, setShareOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const shareText = `"${quote.text}" — ${quote.ref}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const openShare = async () => {
    const blob = await buildShareImage(quote.text, quote.ref);
    setPreviewUrl(URL.createObjectURL(blob));
    setShareOpen(true);
  };

  const closeShare = () => {
    setShareOpen(false);
    setCopied(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  const handleEmail = () => {
    const subject = "Daily Wisdom — BHAVA";
    const body = `${shareText}\n\n${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className={styles.gitaSection}>
      <div className={styles.gitaBg} />

      <div className={styles.sliderWrapper}>
        <div className={styles.dailyReflectionGrid}>
          <div className={styles.quoteCard}>
            <div className={styles.quoteLeft}>
              <div className={styles.quoteSectionLabel}>TODAY'S REFLECTION</div>
              <p className={styles.quoteText}>
                <span className={styles.quoteMark}>&ldquo;</span>
                {quote.text}
                <span className={styles.quoteMark}>&rdquo;</span>
              </p>
              <div className={styles.quoteDivider} />
              <span className={styles.quoteRef}>{quote.ref}</span>

              <button
                className={styles.shareBtn}
                onClick={openShare}
                aria-label="Share quote"
                title="Share"
              >
                <i className="fa-solid fa-share-nodes" style={{ fontSize: 18 }} />
              </button>
            </div>

            <div className={styles.quoteRight}>
              <img className={styles.quoteImage} src={krishnaImage} alt="Lord Krishna" />
            </div>
          </div>
        </div>
      </div>

      {shareOpen && (
        <div className={styles.shareOverlay} onClick={closeShare}>
          <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.shareModalHeader}>
              <span>Share</span>
              <button className={styles.shareModalClose} onClick={closeShare} aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {previewUrl && (
              <img src={previewUrl} alt="Quote preview" className={styles.sharePreviewImage} />
            )}

            <div className={styles.shareOptions}>
              <button className={styles.shareOptionBtn} onClick={handleFacebook}>
                <span className={`${styles.shareIconCircle} ${styles.shareIconFacebook}`}>
                  <i className="fa-brands fa-facebook-f" />
                </span>
                <span className={styles.shareOptionLabel}>Facebook</span>
              </button>

              <button className={styles.shareOptionBtn} onClick={handleWhatsApp}>
                <span className={`${styles.shareIconCircle} ${styles.shareIconWhatsapp}`}>
                  <i className="fa-brands fa-whatsapp" />
                </span>
                <span className={styles.shareOptionLabel}>WhatsApp</span>
              </button>

              <button className={styles.shareOptionBtn} onClick={handleCopyLink}>
                <span className={`${styles.shareIconCircle} ${styles.shareIconCopy}`}>
                  {copied ? (
                    <i className="fa-solid fa-check" />
                  ) : (
                    <i className="fa-solid fa-link" />
                  )}
                </span>
                <span className={styles.shareOptionLabel}>{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              <button className={styles.shareOptionBtn} onClick={handleEmail}>
                <span className={`${styles.shareIconCircle} ${styles.shareIconEmail}`}>
                  <i className="fa-solid fa-envelope" />
                </span>
                <span className={styles.shareOptionLabel}>Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default GitaSlider;
