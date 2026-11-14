import React, { useState } from "react";
import QuickView from "./QuickView";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Shop.module.css";
import { useCart } from "../context/CartContext";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { inr, productInStock, bundleInStock, variantInStock, productLine, bundleContentLines, bundleThumbImage } from "./shopUtils";
import { addToCartEvent } from "../utils/analytics";
import ResponsiveImg from "../components/ResponsiveImg";

const FRAG_ORDER = ["guggal", "oud", "sandalwood"];

export function ProductCard({ product: p, catalog, onAdded, dense = false }) {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [quickOpen, setQuickOpen] = useState(false);
  const inStock = productInStock(catalog, p);
  const single = p.variants.length === 1;
  const multiFrag = p.mode === "single" || p.mode === "camphor";
  const offered = FRAG_ORDER.filter((f) => p.variants.some((v) => v.fragrances.includes(f)));
  const showFrags = !dense && p.mode !== "none";

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
    <article className={`${styles.card} ${dense ? styles.cardDense : ""} ${inStock ? "" : styles.cardDim}`}>
      <div className={styles.cardImg}>
        <Link to={`/product/${p.slug}`} tabIndex={-1} aria-hidden="true" className={styles.imgLink}>
          <ResponsiveImg
            src={p.image}
            alt={p.name}
            loading="lazy"
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
          <button type="button" className={styles.btn} onClick={quickAdd}>
            <span data-label>
              {inCartLine ? "Go to Cart →" : "Add to Cart +"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.btn}
            onClick={() => setQuickOpen(true)}
            aria-haspopup="dialog"
          >
            {anyVariantInCart
              ? (p.mode === "pair" ? "Add another pair" : "Add another")
              : (p.mode === "pair" ? "Choose pair" : "Choose fragrance")}
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
  return (
    <Link to={`/collection/${b.slug}`} className={`${styles.bundleCard} ${inStock ? "" : styles.cardDim}`}>
      <div className={styles.bundleImg}>
        <ResponsiveImg
          src={thumb}
          alt={b.name}
          loading="lazy"
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
        <span className={`${styles.btn} ${inStock ? styles.btnGhost : styles.btnDisabled}`}>{inStock ? "Choose & add →" : "Unavailable"}</span>
      </div>
    </Link>
  );
}
