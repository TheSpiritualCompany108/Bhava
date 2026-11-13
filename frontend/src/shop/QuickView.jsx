import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import s from "./Shop.module.css";
import { useCart } from "../context/CartContext";
import { QuantityDecrease, QuantityValue, QuantityIncrease } from "../components/Quantity";
import { FOOTNOTE_PRICE } from "./content";
import { inr, imgSrc, variantInStock, productInStock, productMaxQty, productLine } from "./shopUtils";
import { addToCartEvent } from "../utils/analytics";

// Quick View popup for a product card: choose the (valid) variant, pick a stock-limited quantity
// and add to cart without leaving the page. Same rules as the product page.
export default function QuickView({ product: p, catalog, onClose, onAdded }) {
  const { addToCart, cartItems } = useCart();
  const [picked, setPicked] = useState("");
  const [qty, setQty] = useState(1);

  const variantKey = p.variants.length === 1 ? p.variants[0].key : picked;
  const variant = p.variants.find((v) => v.key === variantKey);
  const inCart = variant ? cartItems.find((i) => i.productId === `product:${p.slug}:${variant.key}`) : null;
  const inStock = variant ? variantInStock(catalog, p.slug, variant.key) : productInStock(catalog, p);
  const maxQty = variant ? Math.max(0, productMaxQty(catalog, p.slug, variant.key) - (inCart?.quantity || 0)) : 20;
  const qtyEff = Math.max(1, Math.min(qty, maxQty || 1));
  const needsChoice = p.variants.length > 1 && !variant;
  const canAdd = inStock && !needsChoice && maxQty > 0;
  const category = catalog.categories.find((c) => c.id === p.category)?.label;
  const shownFrags = variant ? variant.fragrances : p.mode === "all" ? p.variants[0].fragrances : [];

  // Esc to close + lock background scroll while open
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

  const add = () => {
    if (!canAdd) return;
    const line = productLine(p, variant.key, qtyEff);
    addToCart(line);
    addToCartEvent(line);
    onAdded?.(p.name);
    onClose();
  };

  return createPortal(
    <div className={s.qvBackdrop} onClick={onClose}>
      <div className={s.qvCard} role="dialog" aria-modal="true" aria-label={`Quick view: ${p.name}`} onClick={(e) => e.stopPropagation()}>
        <button className={s.qvClose} onClick={onClose} aria-label="Close quick view">✕</button>

        <div className={s.qvImg}>
          <img src={imgSrc(p.image)} alt={p.name} />
        </div>

        <div className={s.qvBody}>
          <span className={s.cardType}>{category}</span>
          <h2 className={s.qvTitle}>{p.name}</h2>
          {p.tagline && <p className={s.cardTagline}>{p.tagline}</p>}
          <div className={s.qvPrice}>
            {inr(p.price)} <small>{FOOTNOTE_PRICE}</small>
          </div>
          <p className={s.note} style={{ margin: "0 0 4px" }}>{p.pack}</p>
          <p className={inStock ? s.stockOk : s.stockOut} style={{ fontSize: 13, fontWeight: 700, margin: "6px 0 0" }}>
            {inStock ? "In stock" : variant ? "This option is out of stock" : "Out of stock"}
          </p>

          {(p.mode === "single" || p.mode === "pair" || p.mode === "camphor") && (
            <div className={s.selBlock} role="radiogroup" aria-label={p.mode === "pair" ? "Fragrance pair" : "Fragrance"}>
              <div className={s.selLabel}><span>{p.mode === "pair" ? "Choose your pair" : "Choose your fragrance"}</span></div>
              <div className={s.chips}>
                {p.variants.map((v) => {
                  const ok = variantInStock(catalog, p.slug, v.key);
                  return (
                    <button key={v.key} role="radio" aria-checked={variantKey === v.key} disabled={!ok}
                      className={`${s.chip} ${variantKey === v.key ? s.chipOn : ""}`} onClick={() => setPicked(v.key)}>
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {p.mode === "fixed" && <div className={s.selBlock}><span className={s.fixedNote}>Guggal only</span></div>}
          {p.mode === "all" && <div className={s.selBlock}><span className={s.fixedNote}>Guggal + Oud + Sandalwood</span></div>}

          {shownFrags.length > 0 && (
            <div className={s.fragDesc} style={{ margin: "0 0 14px" }}>
              {shownFrags.map((f) => (
                <p key={f} style={{ margin: "0 0 4px" }}><b>{catalog.fragrances[f].label}</b> — {catalog.fragrances[f].short}</p>
              ))}
            </div>
          )}

          <div className={s.qvActions}>
            <div className={s.qvQty}>
              <QuantityDecrease value={qtyEff} onClick={() => setQty(Math.max(1, qtyEff - 1))} />
              <QuantityValue>{qtyEff}</QuantityValue>
              <QuantityIncrease value={qtyEff} max={Math.max(1, maxQty)} onClick={() => setQty(Math.min(Math.max(1, maxQty), qtyEff + 1))} />
            </div>
            <button className={`${s.btn} ${s.btnLg} ${canAdd ? "" : s.btnDisabled}`} disabled={!canAdd} onClick={add} style={{ flex: 1 }}>
              {!inStock && variant ? "Out of stock" : needsChoice ? `Select ${p.mode === "pair" ? "a pair" : "a fragrance"}` : "Add to Cart +"}
            </button>
          </div>
          {!!variant && inStock && maxQty < 20 && qtyEff >= maxQty && (
            <p className={s.note} role="status" style={{ margin: "8px 0 0" }}>
              {inCart ? "You already have the maximum available quantity in your cart." : "Maximum available quantity selected."}
            </p>
          )}

          <Link to={`/product/${p.slug}`} className={s.qvMore} onClick={onClose}>View full details →</Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
