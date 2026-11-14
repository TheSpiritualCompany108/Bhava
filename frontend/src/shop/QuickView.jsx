import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import s from "./Shop.module.css";
import { useCart } from "../context/CartContext";
import { QuantityDecrease, QuantityValue, QuantityIncrease } from "../components/Quantity";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { FOOTNOTE_PRICE } from "./content";
import { inr, imgSrc, variantInStock, productInStock, productMaxQty, productLine } from "./shopUtils";
import { addToCartEvent } from "../utils/analytics";

/** Quick View: pick fragrance / pair + qty, add to cart without leaving the listing. */
export default function QuickView({ product: p, catalog, onClose, onAdded }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [picked, setPicked] = useState("");
  const [qty, setQty] = useState(1);
  const [closing, setClosing] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  const [chipPulse, setChipPulse] = useState("");
  const cardRef = useRef(null);
  const addBtnRef = useRef(null);

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
  const choiceNoun = p.mode === "pair" ? "a pair" : "a fragrance";

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && requestClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus first interactive chip / close for keyboard users
    window.setTimeout(() => {
      const first = cardRef.current?.querySelector?.(`.${s.chip}:not(:disabled), .${s.qvClose}`);
      first?.focus?.();
    }, 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close handler uses latest closing flag
  }, []);

  const pickVariant = (key) => {
    setPicked(key);
    setChipPulse(key);
    window.setTimeout(() => setChipPulse((cur) => (cur === key ? "" : cur)), 320);
  };

  const goCart = () => {
    requestClose();
    navigate("/cart");
  };

  const add = (e) => {
    if (addedFlash || (variant && inStock && maxQty <= 0)) {
      goCart();
      return;
    }
    if (!canAdd) return;
    const btn = e.currentTarget;
    const line = productLine(p, variant.key, qtyEff);
    addToCart(line);
    addToCartEvent(line);
    setAddedFlash(true);
    onAdded?.(p.name);
    // Let React paint cart badge, then animate above the modal
    requestAnimationFrame(() => {
      playAddToCartAnimation(btn, { image: p.image });
    });
  };

  return createPortal(
    <div
      className={`${s.qvBackdrop} ${closing ? s.qvBackdropOut : ""}`}
      onClick={requestClose}
    >
      <div
        ref={cardRef}
        className={`${s.qvCard} ${closing ? s.qvCardOut : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Choose fragrance: ${p.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={s.qvClose} onClick={requestClose} aria-label="Close">✕</button>

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
          {!inStock && (
            <span className={`${s.stockBadge} ${s.stockBadgeOut}`} role="status">
              <span className={s.stockBadgeDot} aria-hidden="true" />
              {variant ? "This option is out of stock" : "Out of stock"}
            </span>
          )}

          {(p.mode === "single" || p.mode === "pair" || p.mode === "camphor") && (
            <div className={s.selBlock} role="radiogroup" aria-label={p.mode === "pair" ? "Fragrance pair" : "Fragrance"}>
              <div className={s.selLabel}>
                <span>{p.mode === "pair" ? "Choose your pair" : "Choose your fragrance"}</span>
              </div>
              <div className={s.chips}>
                {p.variants.map((v) => {
                  const ok = variantInStock(catalog, p.slug, v.key);
                  const on = variantKey === v.key;
                  return (
                    <button
                      key={v.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      disabled={!ok}
                      className={`${s.chip} ${on ? s.chipOn : ""} ${chipPulse === v.key ? s.chipPulse : ""}`}
                      onClick={() => pickVariant(v.key)}
                    >
                      {v.label}
                      {on ? <span className={s.chipCheck} aria-hidden="true">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {p.mode === "fixed" && <div className={s.selBlock}><span className={s.fixedNote}>Guggal only</span></div>}
          {p.mode === "all" && <div className={s.selBlock}><span className={s.fixedNote}>Guggal + Oud + Sandalwood</span></div>}

          {shownFrags.length > 0 && (
            <div key={variantKey} className={`${s.fragDesc} ${s.qvFragIn}`} style={{ margin: "0 0 14px" }}>
              {shownFrags.map((f) => (
                <p key={f} style={{ margin: "0 0 4px" }}>
                  <b>{catalog.fragrances[f].label}</b> — {catalog.fragrances[f].short}
                </p>
              ))}
            </div>
          )}

          <div className={s.qvActions}>
            <div className={s.qvQty}>
              <QuantityDecrease value={qtyEff} onClick={() => setQty(Math.max(1, qtyEff - 1))} />
              <QuantityValue>{qtyEff}</QuantityValue>
              <QuantityIncrease value={qtyEff} max={Math.max(1, maxQty)} onClick={() => setQty(Math.min(Math.max(1, maxQty), qtyEff + 1))} />
            </div>
            <button
              ref={addBtnRef}
              type="button"
              className={`${s.btn} ${s.btnLg} ${canAdd || addedFlash || (variant && inStock && maxQty <= 0) ? "" : s.btnDisabled} ${addedFlash ? s.qvAdded : ""}`}
              disabled={!canAdd && !addedFlash && !(variant && inStock && maxQty <= 0)}
              onClick={add}
              style={{ flex: 1 }}
            >
              <span data-label>
                {addedFlash
                  ? "Go to Cart →"
                  : !inStock && variant
                    ? "Out of stock"
                    : needsChoice
                      ? `Select ${choiceNoun}`
                      : maxQty <= 0
                        ? "Go to Cart →"
                        : "Add to Cart +"}
              </span>
            </button>
          </div>
          {!!variant && inStock && maxQty > 0 && maxQty < 20 && qtyEff >= maxQty && !addedFlash && (
            <p className={s.note} role="status" style={{ margin: "8px 0 0" }}>
              Only {maxQty} left available to add.
            </p>
          )}
          {!!variant && inStock && maxQty <= 0 && !addedFlash && (
            <p className={s.note} role="status" style={{ margin: "8px 0 0" }}>
              You already have the maximum available quantity in your cart.
            </p>
          )}

          <Link to={`/product/${p.slug}`} className={s.qvMore} onClick={requestClose}>View full details →</Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
