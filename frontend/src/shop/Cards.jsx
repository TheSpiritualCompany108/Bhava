import React, { useEffect, useRef, useState } from "react";
import QuickView from "./QuickView";
import BundleQuickView from "./BundleQuickView";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Shop.module.css";
import { useCart } from "../context/CartContext";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { inr, productInStock, bundleInStock, variantInStock, productLine, bundleContentLines, bundleThumbImage } from "./shopUtils";
import { addToCartEvent } from "../utils/analytics";
import ResponsiveImg from "../components/ResponsiveImg";

const FRAG_ORDER = ["guggal", "oud", "sandalwood"];

// ── Myntra-style hover slideshow for card images ──
// Mouse hover only: after a short pause the card slides through its gallery, leaving resets to the first image.
// Touch devices and reduced-motion users keep the static first image.
const SLIDE_FIRST_MS = 350;
const SLIDE_EVERY_MS = 1300;
const MAX_SLIDES = 6;

const cardImages = (main, gallery) => [...new Set([main, ...(gallery || [])].filter(Boolean))].slice(0, MAX_SLIDES);

function useHoverSlides(count) {
  const [idx, setIdx] = useState(0);
  const [armed, setArmed] = useState(false); // other slides are only mounted (and loaded) after the first hover
  const timers = useRef({ first: 0, loop: 0 });
  const stop = () => {
    clearTimeout(timers.current.first);
    clearInterval(timers.current.loop);
  };
  useEffect(() => stop, []);
  const start = (e) => {
    if (count < 2 || e.pointerType !== "mouse") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    setArmed(true);
    timers.current.first = setTimeout(() => {
      setIdx(1);
      // idx may reach `count`: that is a clone of the first image, so the loop keeps sliding forward (see SlideTrack)
      timers.current.loop = setInterval(() => setIdx((i) => (i >= count ? 1 : i + 1)), SLIDE_EVERY_MS);
    }, SLIDE_FIRST_MS);
  };
  const end = () => {
    stop();
    setIdx(0);
  };
  return { idx, setIdx, armed, bind: { onPointerEnter: start, onPointerLeave: end } };
}

function SlideTrack({ images, idx, setIdx, armed, alt, width, height, sizes }) {
  const [snap, setSnap] = useState(false); // true = jump without animation
  const shown = armed ? [...images, images[0]] : images.slice(0, 1); // trailing clone of the first image = seamless loop
  const onEnd = (e) => {
    if (e.target !== e.currentTarget || idx < images.length) return;
    setSnap(true);
    setIdx(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
  };
  return (
    <>
      <div
        className={styles.slideTrack}
        style={{ transform: `translateX(-${idx * 100}%)`, transition: snap ? "none" : undefined }}
        onTransitionEnd={onEnd}
      >
        {shown.map((src, i) => (
          <div className={styles.slide} key={i}>
            <ResponsiveImg src={src} alt={i === 0 ? alt : ""} loading={i === 0 ? "lazy" : "eager"} width={width} height={height} sizes={sizes} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className={styles.slideDots} aria-hidden="true">
          {images.map((src, i) => <span key={src} className={`${styles.slideDot} ${i === idx % images.length ? styles.slideDotOn : ""}`} />)}
        </div>
      )}
    </>
  );
}

export function ProductCard({ product: p, catalog, onAdded, dense = false }) {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [quickOpen, setQuickOpen] = useState(false);
  const inStock = productInStock(catalog, p);
  const single = p.variants.length === 1;
  const multiFrag = p.mode === "single" || p.mode === "camphor";
  const offered = FRAG_ORDER.filter((f) => p.variants.some((v) => v.fragrances.includes(f)));
  const showFrags = !dense && p.mode !== "none";
  const images = cardImages(p.image, p.gallery);
  const slides = useHoverSlides(images.length);

  const singleLineId = single ? `product:${p.slug}:${p.variants[0].key}` : null;
  const inCartLine = singleLineId ? cartItems.find((i) => i.productId === singleLineId) : null;
  const anyVariantInCart = cartItems.some((i) => i.kind === "product" && i.slug === p.slug);

  const quickAdd = (e) => {
    e.preventDefault();
    if (inCartLine) {
      navigate("/cart");
      return;
    }
    const btn = e.currentTarget;
    const line = productLine(p, p.variants[0].key, 1);
    addToCart(line);
    addToCartEvent(line);
    playAddToCartAnimation(btn, { image: p.image });
    onAdded?.(p.name);
  };

  return (
    <article className={`${styles.card} ${dense ? styles.cardDense : ""} ${inStock ? "" : styles.cardDim}`} {...slides.bind}>
      <div className={styles.cardImg}>
        <Link to={`/product/${p.slug}`} tabIndex={-1} aria-hidden="true" className={styles.imgLink}>
          <SlideTrack
            images={images}
            idx={slides.idx}
            setIdx={slides.setIdx}
            armed={slides.armed}
            alt={p.name}
            width={640}
            height={640}
            sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 280px"
          />
        </Link>
        {!inStock && <span className={`${styles.ribbon} ${styles.ribbonOff}`}>Out of stock</span>}
      </div>
      <Link to={`/product/${p.slug}`} className={styles.cardLink} aria-label={`${p.name} — ${inr(p.price)}`}>
        <div className={styles.cardBody}>
          <span className={styles.cardType}>{catalog.categories.find((c) => c.id === p.category)?.label}</span>
          <h3 className={styles.cardTitle}>{p.name}</h3>
          {p.tagline && <p className={styles.cardTagline}>{p.tagline}</p>}
          {showFrags && (
            <div className={styles.dots} aria-label="Fragrances">
              {p.mode === "pair" || p.mode === "all"
                ? offered.map((f) => <span key={f} className={styles.dot}>{catalog.fragrances[f].label}</span>)
                : offered.map((f) => {
                    const on = productInStock(catalog, p) && p.variants.some((v) => v.fragrances.includes(f) && variantInStock(catalog, p.slug, v.key));
                    return <span key={f} className={`${styles.dot} ${on ? "" : styles.dotOff}`}>{catalog.fragrances[f].label}</span>;
                  })}
            </div>
          )}
        </div>
      </Link>
      <div className={styles.cardFoot}>
        <span className={styles.price}>{inr(p.price)}</span>
        {!inStock ? (
          <button type="button" className={`${styles.btn} ${styles.btnDisabled}`} disabled>Out of stock</button>
        ) : single && !multiFrag ? (
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={quickAdd}>
            <span data-label>
              {inCartLine ? "Go to Cart →" : "Add to Cart +"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={() => setQuickOpen(true)}
            aria-haspopup="dialog"
          >
            {anyVariantInCart
              ? (p.mode === "pair" ? "Add another pair" : "Add another")
              : "Choose & add →"}
          </button>
        )}
      </div>
      {quickOpen && (
        <QuickView
          product={p}
          catalog={catalog}
          onClose={() => setQuickOpen(false)}
          onAdded={onAdded}
        />
      )}
    </article>
  );
}

export function BundleCard({ bundle: b, catalog }) {
  const inStock = bundleInStock(catalog, b.slug);
  const thumb = bundleThumbImage(catalog, b);
  const images = cardImages(thumb, b.gallery);
  const slides = useHoverSlides(images.length);
  const [quickOpen, setQuickOpen] = useState(false);
  // "Choose & add" opens the popup; the rest of the card still opens the collection page
  const onCardClick = (e) => {
    if (inStock && e.target.closest?.("[data-bundle-quick]")) {
      e.preventDefault();
      setQuickOpen(true);
    }
  };
  return (
    <>
    <Link to={`/collection/${b.slug}`} onClick={onCardClick} className={`${styles.bundleCard} ${inStock ? "" : styles.cardDim}`} {...slides.bind}>
      <div className={styles.bundleImg}>
        <SlideTrack
          images={images}
          idx={slides.idx}
          setIdx={slides.setIdx}
          armed={slides.armed}
          alt={b.name}
          width={640}
          height={480}
          sizes="(max-width: 600px) 90vw, 320px"
        />
      </div>
      <span className={styles.cardType}>{b.group}</span>
      <h3 className={styles.cardTitle}>{b.name}</h3>
      {b.tagline && <p className={styles.cardTagline}>{b.tagline}</p>}
      <ul className={styles.bundleList}>
        {bundleContentLines(catalog, b).map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      <div className={styles.bundleFoot}>
        <span className={styles.price}>{inr(b.price)}</span>
        <span data-bundle-quick className={`${styles.btn} ${inStock ? styles.btnGhost : styles.btnDisabled}`}>{inStock ? "Choose & add →" : "Unavailable"}</span>
      </div>
    </Link>
    {quickOpen && <BundleQuickView bundle={b} catalog={catalog} onClose={() => setQuickOpen(false)} />}
    </>
  );
}
