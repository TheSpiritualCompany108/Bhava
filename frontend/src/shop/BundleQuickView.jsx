import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import s from "./Shop.module.css";
import { useCart } from "../context/CartContext";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { FOOTNOTE_PRICE } from "./content";
import { inr, imgSrc, getProduct, bundleLine, liveBundlePrice, bundleThumbImage, bundleContentLines } from "./shopUtils";
import { addToCartEvent } from "../utils/analytics";

const CORE = ["guggal", "oud", "sandalwood"];
const CAMPHOR = ["guggal", "sandalwood"];
const PAIRS = ["guggal-oud", "guggal-sandalwood", "oud-sandalwood"];

/** Popup version of the collection page: choose fragrance / pair / bracelets and add to cart without leaving the page. */
export default function BundleQuickView({ bundle, catalog, onClose }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [fragrance, setFragrance] = useState("");
  const [camphor, setCamphor] = useState("");
  const [pair, setPair] = useState("");
  const [bracelets, setBracelets] = useState([]);
  const [closing, setClosing] = useState(false);
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);

  const avail = catalog.availability.bundles[bundle.slug];
  const needN = bundle.needs.bracelets || 0;
  const braceletProducts = catalog.products.filter((p) => p.category === "sacred-beads");
  const selection = { fragrance: fragrance || null, camphor: camphor || null, pair: pair || null, bracelets };
  const livePrice = liveBundlePrice(catalog, bundle, selection);

  const missing = [];
  if (bundle.needs.fragrance && !fragrance) missing.push("a fragrance");
  if (bundle.needs.camphor && !camphor) missing.push("a camphor fragrance");
  if (bundle.needs.pair && !pair) missing.push("a fragrance pair");
  if (needN && bracelets.length !== needN) missing.push(needN === 1 ? "a bracelet" : `${needN} different bracelets`);
  const ready = missing.length === 0 && avail?.available;
  const line = ready ? bundleLine(bundle, selection, 1, livePrice) : null;
  const inCart = !!(line && cartItems.find((i) => i.productId === line.productId));

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
    window.setTimeout(() => cardRef.current?.querySelector?.(`.${s.chip}:not(:disabled), .${s.qvClose}`)?.focus?.(), 50);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close handler uses latest closing flag
  }, []);

  const toggleBracelet = (slug) =>
    setBracelets((cur) => (cur.includes(slug) ? cur.filter((x) => x !== slug) : cur.length < needN ? [...cur, slug] : needN === 1 ? [slug] : cur));

  const goCart = () => { requestClose(); navigate("/cart"); };
  const add = (e) => {
    if (added || inCart) { goCart(); return; }
    if (!ready) return;
    const btn = e.currentTarget;
    addToCart(line);
    addToCartEvent(line);
    setAdded(true);
    requestAnimationFrame(() => playAddToCartAnimation(btn, { image: bundleThumbImage(catalog, bundle) }));
  };

  const chip = (key, label, on, ok, onClick) => (
    <button key={key} type="button" role="radio" aria-checked={on} disabled={!ok} className={`${s.chip} ${on ? s.chipOn : ""}`} onClick={onClick}>
      {label}
      {on ? <span className={s.chipCheck} aria-hidden="true">✓</span> : null}
    </button>
  );

  return createPortal(
    <div className={`${s.qvBackdrop} ${closing ? s.qvBackdropOut : ""}`} onClick={requestClose}>
      <div
        ref={cardRef}
        className={`${s.qvCard} ${closing ? s.qvCardOut : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Choose and add: ${bundle.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={s.qvClose} onClick={requestClose} aria-label="Close">✕</button>

        <div className={s.qvImg}>
          <img src={imgSrc(bundleThumbImage(catalog, bundle))} alt={bundle.name} />
        </div>

        <div className={s.qvBody}>
          <span className={s.cardType}>{bundle.group || "Curated collection"}</span>
          <h2 className={s.qvTitle}>{bundle.name}</h2>
          {bundle.tagline && <p className={s.cardTagline}>{bundle.tagline}</p>}
          <div className={s.qvPrice}>
            {inr(livePrice)} <small>{FOOTNOTE_PRICE}</small>
          </div>

          <ul className={s.compList} aria-label="What is included" style={{ margin: "0 0 12px" }}>
            {bundleContentLines(catalog, bundle).map((l, i) => <li key={i}>{l}</li>)}
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

          <div className={s.qvActions}>
            <button
              type="button"
              className={`${s.btn} ${s.btnLg} ${ready || added || inCart ? "" : s.btnDisabled} ${added ? s.qvAdded : ""}`}
              disabled={!ready && !added}
              onClick={add}
              style={{ flex: 1 }}
            >
              <span data-label>
                {added || inCart ? "Go to Cart →" : !avail?.available ? "Unavailable" : missing.length ? `Select ${missing[0]}` : "Add to Cart +"}
              </span>
            </button>
          </div>

          <Link to={`/collection/${bundle.slug}`} className={s.qvMore} onClick={requestClose}>View full details →</Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
