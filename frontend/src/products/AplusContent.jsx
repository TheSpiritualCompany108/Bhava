import React from "react";
import styles from "./AplusContent.module.css";
import ResponsiveImg from "../components/ResponsiveImg";

/* ─── Individual module renderers ─────────────────────────────────────── */

function ImageBanner({ mod }) {
  const layout = mod.layout || "full-width";
  const cls = [styles.imageBanner, styles[`img_${layout.replace("-", "_")}`] || styles.img_full_width].join(" ");
  return (
    <div className={cls}>
      <img
        src={mod.image}
        alt={mod.headline || "A+ Content Banner"}
        className={styles.bannerImg}
        loading="lazy"
      />
    </div>
  );
}

function HeroBanner({ mod }) {
  const cls = [styles.heroBanner, styles[`hero_${mod.layout || "default"}`]].join(" ");
  return (
    <div className={cls}>
      {mod.image && (
        <div className={styles.heroBg}>
          <ResponsiveImg src={mod.image} alt={mod.headline || ""} width={1200} height={500} loading="lazy" />
        </div>
      )}
      <div className={styles.heroText}>
        {mod.headline    && <h2 className={styles.heroH}>{mod.headline}</h2>}
        {mod.subheadline && <p  className={styles.heroSub}>{mod.subheadline}</p>}
        {mod.body        && <p  className={styles.heroBody}>{mod.body}</p>}
      </div>
    </div>
  );
}

function TextImage({ mod }) {
  const layout = mod.layout || "image-left";
  const cls = [styles.textImage, styles[`ti_${layout.replace("-", "_")}`]].join(" ");
  return (
    <div className={cls}>
      {mod.image && (
        <div className={styles.tiImg}>
          <ResponsiveImg src={mod.image} alt={mod.headline || ""} width={600} height={500} loading="lazy" />
        </div>
      )}
      <div className={styles.tiText}>
        {mod.headline    && <h3 className={styles.modH}>{mod.headline}</h3>}
        {mod.subheadline && <p  className={styles.modSub}>{mod.subheadline}</p>}
        {mod.body        && <p  className={styles.modBody}>{mod.body}</p>}
      </div>
    </div>
  );
}

function FeatureGrid({ mod }) {
  const col = mod.layout === "4-col" ? 4 : mod.layout === "2-col" ? 2 : 3;
  return (
    <div className={styles.featureSection}>
      {mod.headline && <h3 className={styles.modH}>{mod.headline}</h3>}
      {mod.body     && <p  className={styles.modSub}>{mod.body}</p>}
      <div className={styles.featureGrid} style={{ "--fg-cols": col }}>
        {(mod.items || []).map((it, i) => (
          <div key={i} className={styles.featureCard}>
            {it.image && <img src={it.image} alt={it.title || ""} className={styles.featureImg} loading="lazy" />}
            {it.icon  && !it.image && <span className={styles.featureIcon}>{it.icon}</span>}
            {it.title && <strong className={styles.featureTitle}>{it.title}</strong>}
            {it.text  && <p className={styles.featureText}>{it.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightStrip({ mod }) {
  const vertical = mod.layout === "vertical";
  return (
    <div className={styles.highlightSection}>
      {mod.headline && <h3 className={styles.modH}>{mod.headline}</h3>}
      <div className={vertical ? styles.highlightV : styles.highlightH}>
        {(mod.items || []).map((it, i) => (
          <div key={i} className={styles.highlightItem}>
            {it.icon  && <span className={styles.hlIcon}>{it.icon}</span>}
            {it.title && <strong className={styles.hlTitle}>{it.title}</strong>}
            {it.text  && <span className={styles.hlText}>{it.text}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandStory({ mod }) {
  const centered = mod.layout === "centered";
  const cls = [styles.brandStory, centered ? styles.brandCentered : ""].join(" ");
  return (
    <div className={cls}>
      {mod.image && (
        <div className={styles.brandImg}>
          <ResponsiveImg src={mod.image} alt={mod.headline || "Brand"} width={700} height={500} loading="lazy" />
        </div>
      )}
      <div className={styles.brandText}>
        {mod.headline && <h3 className={styles.brandH}>{mod.headline}</h3>}
        {mod.body     && <p  className={styles.brandBody}>{mod.body}</p>}
      </div>
    </div>
  );
}

function ComparisonChart({ mod }) {
  const cols = mod.columns || [];
  const rows = mod.rows    || [];
  if (!cols.length && !rows.length) return null;
  return (
    <div className={styles.chartSection}>
      {mod.headline && <h3 className={styles.modH}>{mod.headline}</h3>}
      <div className={styles.chartScroll}>
        <table className={styles.compTable}>
          {cols.length > 0 && (
            <thead>
              <tr>
                <th></th>
                {cols.map((c, i) => <th key={i}>{c}</th>)}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <th scope="row">{r.label}</th>
                {(r.values || []).map((v, j) => <td key={j}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FaqBlock({ mod }) {
  const compact = mod.layout === "compact";
  return (
    <div className={styles.faqSection}>
      {mod.headline && <h3 className={styles.modH}>{mod.headline}</h3>}
      <div className={compact ? styles.faqCompact : styles.faqDefault}>
        {(mod.items || []).map((it, i) => (
          <details key={i} className={styles.faqItem}>
            <summary className={styles.faqQ}>{it.title}</summary>
            {it.text && <p className={styles.faqA}>{it.text}</p>}
          </details>
        ))}
      </div>
    </div>
  );
}

/* ─── Module dispatcher ───────────────────────────────────────────────── */

const MODULE_MAP = {
  image:            ImageBanner,
  image_banner:     ImageBanner,
  hero_banner:      HeroBanner,
  text_image:       TextImage,
  feature_grid:     FeatureGrid,
  highlight_strip:  HighlightStrip,
  brand_story:      BrandStory,
  comparison_chart: ComparisonChart,
  faq_block:        FaqBlock,
};

/* ─── Main export ─────────────────────────────────────────────────────── */

export default function AplusContent({ modules }) {
  if (!modules || modules.length === 0) return null;

  const sorted = [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const desktopModules = sorted.filter((m) => m.device !== "mobile");
  const mobileModules = sorted.filter((m) => m.device === "mobile" || m.device === "all");

  const renderModule = (mod, i) => {
    const Comp = MODULE_MAP[mod.type] || (mod.image ? ImageBanner : null);
    if (!Comp) return null;
    return (
      <div key={i} className={styles.modWrap}>
        <Comp mod={mod} />
      </div>
    );
  };

  return (
    <section className={styles.aplusRoot} aria-label="Product highlights">
      {/* 🖥️ Desktop Only Listing */}
      {desktopModules.length > 0 && (
        <div className={styles.desktopOnly}>
          {desktopModules.map(renderModule)}
        </div>
      )}

      {/* 📱 Mobile Only Listing */}
      {mobileModules.length > 0 && (
        <div className={styles.mobileOnly}>
          {mobileModules.map(renderModule)}
        </div>
      )}
    </section>
  );
}
