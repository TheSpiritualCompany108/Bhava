import { useState } from "react";
import styles from "./GitaSlider.module.css";
import { getTodaysQuote } from "./gitaQuotes";

const quote = getTodaysQuote();
const krishnaImage = "/krishna.imgae.png";

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
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const blob = await buildShareImage(quote.text, quote.ref);
    const file = new File([blob], "bhava-quote.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Daily Wisdom — BHAVA",
        });
        return;
      } catch {
        // user cancelled or share failed — fall through
      }
    }

    // Fallback: download the image
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bhava-quote.png";
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.gitaSection}>
      <div className={styles.gitaBg} />

      <div className={styles.sliderWrapper}>
        <div className={styles.dailyReflectionGrid}>
          <div className={styles.quoteCard}>
            <div className={styles.quoteCardTop}>
              <div className={styles.quoteBrand}>BHAVA</div>
              <img className={styles.quoteImage} src={krishnaImage} alt="Lord Krishna" />
            </div>

            <div className={styles.quoteCardBody}>
              <div className={styles.quoteSectionLabel}>TODAY'S REFLECTION</div>
              <p className={styles.quoteText}>
                <span className={styles.quoteMark}>&ldquo;</span>
                {quote.text}
                <span className={styles.quoteMark}>&rdquo;</span>
              </p>
              <div className={styles.quoteDivider} />
              <span className={styles.quoteRef}>{quote.ref}</span>
            </div>

            <button
              className={styles.shareBtn}
              onClick={handleShare}
              aria-label="Share quote"
              title={copied ? "Copied!" : "Share"}
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              )}
            </button>
          </div>

          <div className={styles.reflectionNotes}>
            <h3 className={styles.reflectionTitle}>Daily Reflections</h3>
            <p className={styles.reflectionSubtitle}>Bringing Ancient Wisdom to Daily Life</p>

            <div className={styles.reflectionItem}>
              <span className={styles.reflectionIndex}>01</span>
              <div>
                <h4>Today's Reflection &amp; Meaning</h4>
                <p>Every day offers a carefully translated Gita verse paired with a contemporary, practical explanation to cultivate quiet focus and mental clarity.</p>
              </div>
            </div>

            <div className={styles.reflectionItem}>
              <span className={styles.reflectionIndex}>02</span>
              <div>
                <h4>How to Live It Today</h4>
                <p>Translate theory into action with immediate, simple daily practices designed to integrate spiritual teachings smoothly into modern routines.</p>
              </div>
            </div>

            <div className={styles.reflectionItem}>
              <span className={styles.reflectionIndex}>03</span>
              <div>
                <h4>Save &amp; Share Reflections</h4>
                <p>Build your personal archive of wisdom by saving meaningful insights, or easily share daily lessons with friends and family to grow together.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GitaSlider;
