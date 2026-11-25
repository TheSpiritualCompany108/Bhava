import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import s from "./Shop.module.css";
import { useCart } from "../context/CartContext";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { FOOTNOTE_PRICE } from "./content";
import { inr, imgSrc, getProduct, bundleLine, liveBundlePrice, bundleThumbImage, bundleItems, bundleShortDescription } from "./shopUtils";
import { addToCartEvent } from "../utils/analytics";

const CORE = ["guggal", "oud", "sandalwood"];
const CAMPHOR = ["guggal", "sandalwood"];
const PAIRS = ["guggal-oud", "guggal-sandalwood", "oud-sandalwood"];
const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

/**
 * Bundle preview: what's inside, the required choices (fragrance / pair / bracelets) and add-to-bag —
 * without leaving the page. Phones get a bottom sheet, larger screens a centred modal (same component).
 */
export default function BundleQuickView({ bundle, catalog, onClose, returnFocusRef }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [fragrance, setFragrance] = useState("");
  const [camphor, setCamphor] = useState("");
  const [pair, setPair] = useState("");
  const [bracelets, setBracelets] = useState([]);
  const [closing, setClosing] = useState(false);
  const [justAdded, setJustAdded] = useState("");
  const addingRef = useRef("");
  const [addError, setAddError] = useState("");
  const cardRef = useRef(null);
  const closingRef = useRef(false);

  const avail = catalog.availability.bundles[bundle.slug];
  const needN = bundle.needs.bracelets || 0;
  const braceletProducts = catalog.products.filter((p) => p.category === "sacred-beads");
  const selection = { fragrance: fragrance || null, camphor: camphor || null, pair: pair || null, bracelets };
  const livePrice = liveBundlePrice(catalog, bundle, selection);
  const items = bundleItems(catalog, bundle, selection);
  const desc = bundleShortDescription(bundle);

  const missing = [];
  if (bundle.needs.fragrance && !fragrance) missing.push("a fragrance");
  if (bundle.needs.camphor && !camphor) missing.push("a camphor fragrance");
  if (bundle.needs.pair && !pair) missing.push("a fragrance pair");
  if (needN && bracelets.length !== needN) missing.push(needN === 1 ? "a bracelet" : `${needN} different bracelets`);
  const ready = missing.length === 0 && avail?.available;
  const line = ready ? bundleLine(bundle, selection, 1, livePrice) : null;
  const inCart = !!(line && cartItems.find((i) => i.productId === line.productId));
  const added = inCart && justAdded === line.productId; // "Added" message only for the selection just added

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  useEffect(() => {
    const opener = returnFocusRef?.current || document.activeElement; // focus goes back here when the sheet closes (Safari does not focus buttons on tap)
    const onKey = (e) => {
      if (e.key === "Escape") { requestClose(); return; }
      if (e.key !== "Tab" || !cardRef.current) return;
      // keep keyboard focus inside the dialog
      const nodes = [...cardRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => cardRef.current?.querySelector?.(`.${s.chip}:not(:disabled), .${s.qvClose}`)?.focus?.(), 50);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      if (opener && typeof opener.focus === "function" && document.contains(opener)) opener.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only; close handler reads a ref
  }, []);

  const toggleBracelet = (slug) =>
    setBracelets((cur) => (cur.includes(slug) ? cur.filter((x) => x !== slug) : cur.length < needN ? [...cur, slug] : needN === 1 ? [slug] : cur));

  const goCart = () => { requestClose(); navigate("/cart"); };
  const add = (e) => {
    if (inCart) { goCart(); return; }
    if (!ready || addingRef.current === line.productId) return; // a fast double tap must not add twice
    addingRef.current = line.productId;
    const btn = e.currentTarget;
    setAddError("");
    try {
      addToCart(line);
      addToCartEvent(line);
      setJustAdded(line.productId);
      requestAnimationFrame(() => playAddToCartAnimation(btn, { image: bundleThumbImage(catalog, bundle) }));
    } catch {
      addingRef.current = "";
      setAddError("Couldn't add this bundle — please try again.");
    }
  };

  const chip = (key, label, on, ok, onClick) => (
    <button key={key} type="button" role="radio" aria-checked={on} disabled={!ok} className={`${s.chip} ${on ? s.chipOn : ""}`} onClick={onClick}>
      {label}
      {on ? <span className={s.chipCheck} aria-hidden="true">✓</span> : null}
    </button>
  );

  const ctaLabel = inCart
    ? "Go to Bag →"
    : !avail?.available
      ? "Unavailable"
      : missing.length
        ? `Select ${missing[0]}`
        : "Add Bundle to Bag";

  return createPortal(
    <div className={`${s.qvBackdrop} ${closing ? s.qvBackdropOut : ""}`} onClick={requestClose}>
      <div
        ref={cardRef}
        className={`${s.qvCard} ${s.bqvCard} ${closing ? s.qvCardOut : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`bqv-title-${bundle.slug}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={s.bqvHandle} aria-hidden="true" />
        <button type="button" className={s.qvClose} onClick={requestClose} aria-label="Close">✕</button>

        <div className={s.qvImg}>
          <img loading="lazy" decoding="async" src={imgSrc(bundleThumbImage(catalog, bundle))} alt={bundle.name} />
        </div>

        <div className={`${s.qvBody} ${s.bqvBody}`}>
          <span className={s.cardType}>
            {items.length} {items.length === 1 ? "product" : "products"} included · {bundle.group || "Curated collection"}
          </span>
          <h2 id={`bqv-title-${bundle.slug}`} className={s.qvTitle}>{bundle.name}</h2>
          {desc && <p className={s.bqvDesc}>{desc}</p>}

          <div className={s.bqvInsideLabel}>What&apos;s inside</div>
          <ul className={s.bqvItems} aria-label="What is included">
            {items.map((it, i) => (
              <li key={i} className={s.bqvItem}>
                <span className={s.bqvThumb}>
                  {it.slot || !it.image
                    ? <span className={s.bqvThumbSlot} aria-hidden="true">◉</span>
                    : <img src={imgSrc(it.image)} alt="" width={48} height={48} loading="lazy" decoding="async" />}
                </span>
                <span className={s.bqvItemText}>
                  <strong>{it.name}</strong>
                  {it.meta && <small>{it.meta}</small>}
                </span>
                <span className={s.bqvQty} aria-label={`Quantity ${it.qty}`}>{it.qty}×</span>
              </li>
            ))}
          </ul>

          {!avail?.available && <div className={s.errBox}>Currently unavailable — a required item is out of stock.</div>}

          {bundle.needs.fragrance && (
            <div className={s.selBlock} role="radiogroup" aria-label="Fragrance">
              <div className={s.selLabel}><span>Choose your fragrance</span></div>
              <div className={s.chips}>
                {CORE.map((f) => chip(f, catalog.fragrances[f].label, fragrance === f, avail?.fragrance?.[f], () => setFragrance(f)))}
              </div>
              {fragrance && <p className={s.fragDesc}><b>{catalog.fragrances[fragrance].label}</b> — {catalog.fragrances[fragrance].short}</p>}
            </div>
          )}

          {bundle.needs.camphor && (
            <div className={s.selBlock} role="radiogroup" aria-label="Camphor fragrance">
              <div className={s.selLabel}><span>Choose your camphor fragrance</span><small>Both tablets share one fragrance</small></div>
              <div className={s.chips}>
                {CAMPHOR.map((f) => chip(f, catalog.fragrances[f].label, camphor === f, avail?.camphor?.[f], () => setCamphor(f)))}
              </div>
            </div>
          )}

          {bundle.needs.pair && (
            <div className={s.selBlock} role="radiogroup" aria-label="Fragrance pair">
              <div className={s.selLabel}><span>Choose your fragrance pair</span></div>
              <div className={s.chips}>
                {PAIRS.map((k) => chip(k, k.split("-").map((x) => catalog.fragrances[x].label).join(" + "), pair === k, avail?.pair?.[k], () => setPair(k)))}
              </div>
            </div>
          )}

          {bundle.components.some((c) => c.via === "fixed" && getProduct(catalog, c.product)?.mode === "fixed") && (
            <div className={s.selBlock}><div className={s.selLabel}>Sambrani</div><span className={s.fixedNote}>Guggal only</span></div>
          )}

          {needN > 0 && (
            <div className={s.selBlock}>
              <div className={s.selLabel}>
                <span>{needN === 1 ? "Choose your bracelet" : `Choose ${needN} different bracelets`}</span>
                <small>{bracelets.length}/{needN} selected</small>
              </div>
              <div className={s.braceletGrid}>
                {braceletProducts.map((p) => {
                  const on = bracelets.includes(p.slug);
                  const stocked = avail?.bracelets?.[p.slug];
                  const full = !on && bracelets.length >= needN && needN > 1;
                  return (
                    <button key={p.slug} type="button" aria-pressed={on} disabled={!stocked || full} className={`${s.braceletOpt} ${on ? s.braceletOn : ""}`} onClick={() => toggleBracelet(p.slug)}>
                      {on && <span className={s.tick}>✓</span>}
                      <img src={imgSrc(p.image)} alt={p.name} loading="lazy" width={120} height={120} />
                      {p.name.replace(" Bracelet", "")}
                      <div style={{ fontWeight: 400, fontSize: 11 }}>{inr(p.price)}</div>
                      {!stocked && <div style={{ fontWeight: 400, fontSize: 11 }}>Out of stock</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Link to={`/collection/${bundle.slug}`} className={s.qvMore} onClick={requestClose}>View full details →</Link>

          {/* Sticky footer: price + add (stays visible while the sheet scrolls) */}
          <div className={s.bqvFoot}>
            <div className={s.bqvTotal}>
              <span>Total bundle price</span>
              <strong>{inr(livePrice)}</strong>
              <small>{FOOTNOTE_PRICE}</small>
            </div>
            <button
              type="button"
              className={`${s.bqvAdd} ${added ? s.qvAdded : ""}`}
              disabled={!ready && !inCart}
              onClick={add}
            >
              {!inCart && ready && <BagIcon />}
              <span data-label>{ctaLabel}</span>
            </button>
            <p className={s.bqvStatus} role="status" aria-live="polite">
              {addError || (added ? "Added to your bag." : "")}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
