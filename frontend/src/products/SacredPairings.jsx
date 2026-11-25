import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SacredPairings.module.css";
import ResponsiveImg from "../components/ResponsiveImg";
import ImageZoom from "./ImageZoom";
import BundleQuickView from "../shop/BundleQuickView";
import { ProductCard } from "../shop/Cards";
import { inr, imgSrc, bundleThumbImage, bundleItems, bundleShortDescription } from "../shop/shopUtils";

const THUMBS = 3; // product thumbnails shown on a card before "+N"

function PairingCard({ bundle, catalog }) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(null); // product thumbnail shown large
  const href = `/collection/${bundle.slug}`;
  const ctaRef = useRef(null);
  const items = bundleItems(catalog, bundle);
  const count = items.length;
  const desc = bundleShortDescription(bundle, catalog);
  const fromPrice = (bundle.needs?.bracelets || 0) > 0; // listing price assumes the lowest-priced bracelet

  const close = useCallback(() => setOpen(false), []); // the sheet hands focus back to this card's button itself

  return (
    <article className={styles.card} aria-label={bundle.name}>
      <Link to={href} className={styles.imgWrap} aria-label={`View ${bundle.name}`}>
        <ResponsiveImg
          src={bundleThumbImage(catalog, bundle)}
          alt=""
          width={640}
          height={480}
          className={styles.img}
          sizes="(max-width: 767px) 80vw, (max-width: 1279px) 33vw, 300px"
        />
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.count}>{count} {count === 1 ? "product" : "products"}</span>
        </div>
        <h3 className={styles.name}>
          <Link to={href} className={styles.nameBtn}>{bundle.name}</Link>
        </h3>
        <p className={styles.desc}>{desc}</p>

        <div className={styles.inside}>
          <ul className={styles.thumbs}>
            {items.slice(0, THUMBS).map((it, i) => (
              <li key={i} className={styles.thumb} title={it.name}>
                {it.slot || !it.image ? (
                  <span className={styles.thumbSlot} aria-label={it.name} role="img">◉</span>
                ) : (
                  <button type="button" className={styles.thumbBtn} onClick={() => setZoom(it)} aria-label={`Show ${it.name}`}>
                    <img src={imgSrc(it.image)} alt="" width={36} height={36} loading="lazy" decoding="async" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <Link to={href} className={styles.viewAll}>
            View all {count} {count === 1 ? "item" : "items"}
          </Link>
        </div>

        <div className={styles.foot}>
          <p className={styles.price}>
            {fromPrice && <small>From</small>}
            {inr(bundle.price)}
          </p>
          <button
            ref={ctaRef}
            type="button"
            className={styles.cta}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
          >
            Choose &amp; Add <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {zoom && <ImageZoom item={zoom} onClose={() => setZoom(null)} />}
      {open && <BundleQuickView bundle={bundle} catalog={catalog} onClose={close} returnFocusRef={ctaRef} />}
    </article>
  );
}

/**
 * "Sacred Pairings" on the collection page: related curated collections.
 * Phones: native swipe row (scroll-snap) with dots. Tablet / desktop: 2 → 4 column grid (nothing is ever hidden).
 */
export default function SacredPairings({ bundles, catalog, product = null }) {
  const total = bundles.length + (product ? 1 : 0);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  // Which card is in view (dots). Cheap: one rAF-throttled read per scroll.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kids = [...el.children];
        if (!kids.length) return;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) { setActive(kids.length - 1); return; } // end of row → last dot
        const pad = parseFloat(getComputedStyle(el).paddingLeft || "0");
        const left = el.getBoundingClientRect().left + pad;
        let best = 0;
        let bestD = Infinity;
        kids.forEach((k, i) => {
          const d = Math.abs(k.getBoundingClientRect().left - left);
          if (d < bestD) { bestD = d; best = i; }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [total]);

  const goTo = (i) => {
    const el = trackRef.current;
    const card = el?.children[i];
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"), behavior: reduce ? "auto" : "smooth" });
  };

  if (!total) return null;

  return (
    <section className={styles.section} aria-labelledby="sacred-pairings-title">
      <header className={styles.header}>
        <span className={styles.eyebrow}>Sacred Pairings</span>
        <h2 id="sacred-pairings-title" className={styles.title}>You May Also Like</h2>
        <p className={styles.sub}>Thoughtfully curated bundles for your sacred moments.</p>
      </header>

      <div ref={trackRef} className={styles.track}>
        {bundles.map((b) => (
          <PairingCard key={b.slug} bundle={b} catalog={catalog} />
        ))}
        {product && (
          <div className={styles.productSlot}>
            <ProductCard product={product} catalog={catalog} />
          </div>
        )}
      </div>

      {total > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Choose a card">
          {[...bundles.map((b) => ({ key: b.slug, name: b.name })), ...(product ? [{ key: product.slug, name: product.name }] : [])].map((b, i) => (
            <button
              key={b.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${b.name}`}
              className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
