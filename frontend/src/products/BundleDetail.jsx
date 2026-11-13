import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import shop from "../shop/Shop.module.css";
import { useCart } from "../context/CartContext";
import useCatalog from "../hooks/useCatalog";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { FOOTNOTE_PRICE } from "../shop/content";
import { inr, imgSrc, shippingCopy, getProduct, getBundle, bundleLine, liveBundlePrice, braceletsSamePrice } from "../shop/shopUtils";
import { addToCartEvent, bundleView } from "../utils/analytics";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";

const CORE = ["guggal", "oud", "sandalwood"];
const CAMPHOR = ["guggal", "sandalwood"];
const PAIRS = ["guggal-oud", "guggal-sandalwood", "oud-sandalwood"];

export default function BundleDetail() {
  const { slug } = useParams();
  return <BundleDetailInner key={slug} slug={slug} />; // remount per collection → selections reset
}

function BundleDetailInner({ slug }) {
  const navigate = useNavigate();
  const { addToCart, cartItems, itemCount } = useCart();
  const { catalog, loading, error, reload } = useCatalog();
  const bundle = getBundle(catalog, slug);

  const [fragrance, setFragrance] = useState("");
  const [camphor, setCamphor] = useState("");
  const [pair, setPair] = useState("");
  const [bracelets, setBracelets] = useState([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(false), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (bundle) bundleView(bundle, bundle.price);
  }, [bundle]);

  if (loading) return <div className={styles.page}><div className={shop.loadingBox}>Loading…</div></div>;
  if (error || !catalog) {
    return (
      <div className={styles.page}>
        <div className={shop.loadingBox}><p>{error || "Catalogue unavailable."}</p><button className={shop.btn} onClick={reload}>Try again</button></div>
      </div>
    );
  }
  if (!bundle) {
    return (
      <div className={styles.page}>
        <div className={shop.loadingBox}>
          <h2 style={{ fontFamily: "'Canela', serif", color: "#4A0B1D" }}>We couldn’t find that collection</h2>
          <button className={shop.btn} onClick={() => navigate("/products?category=curated-collections")}>← Curated Collections</button>
        </div>
      </div>
    );
  }

  const avail = catalog.availability.bundles[bundle.slug];
  const needN = bundle.needs.bracelets || 0;
  const braceletProducts = catalog.products.filter((p) => p.category === "sacred-beads");

  const missing = [];
  if (bundle.needs.fragrance && !fragrance) missing.push("a fragrance");
  if (bundle.needs.camphor && !camphor) missing.push("a camphor fragrance");
  if (bundle.needs.pair && !pair) missing.push("a fragrance pair");
  if (needN && bracelets.length !== needN) missing.push(needN === 1 ? "a bracelet" : `${needN} different bracelets`);
  const ready = missing.length === 0 && avail?.available;

  const toggleBracelet = (s) =>
    setBracelets((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : cur.length < needN ? [...cur, s] : needN === 1 ? [s] : cur));

  const selection = { fragrance: fragrance || null, camphor: camphor || null, pair: pair || null, bracelets };
  const livePrice = liveBundlePrice(catalog, bundle, selection);
  const line = ready ? bundleLine(bundle, selection, 1, livePrice) : null;
  const inCart = line && cartItems.find((i) => i.productId === line.productId);
  const braceletSlots = bundle.needs.bracelets || 0;
  const showFrom = braceletSlots > 0 && bracelets.length < braceletSlots && !braceletsSamePrice(catalog);

  // Live contents (exact components + quantities)
  let bi = 0;
  const contents = bundle.components.map((c) => {
    if (c.bracelet) {
      const sl = bracelets[bi++];
      const p = sl && getProduct(catalog, sl);
      return { qty: 1, name: p ? p.name : "Bracelet — your choice", meta: p ? p.pack : "" };
    }
    const p = getProduct(catalog, c.product);
    const f = c.via === "pair" ? pair : c.via === "fixed" ? c.variant : c.via === "camphor" ? camphor : fragrance;
    return {
      qty: 1, name: p.name,
      meta: `${f ? (c.via === "pair" ? f.split("-").map((x) => catalog.fragrances[x].label).join(" + ") : c.via === "fixed" && p.mode === "none" ? "" : catalog.fragrances[f]?.label || "") : c.via === "camphor" ? "Choose camphor fragrance" : c.via === "pair" ? "Choose fragrance pair" : "Choose fragrance"}${c.via === "fixed" && p.mode !== "none" ? " (fixed)" : ""}${p.pack ? ` · ${p.pack}` : ""}`,
    };
  });

  const add = (e) => {
    if (!ready) return;
    const btn = e.currentTarget;
    addToCart(line);
    addToCartEvent(line);
    playAddToCartAnimation(btn, { image: line.image });
    setToast(true);
  };

  return (
    <div className={styles.page}>
      <Seo
        title={`${bundle.name} – Curated collection | Bhava`}
        description={clipDesc(bundle.description, bundle.tagline)}
        canonical={`${siteOrigin()}/collection/${bundle.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: bundle.name,
          description: bundle.description,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: livePrice,
            availability: avail?.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }}
      />
      {toast && (
        <div className={styles.toast} role="status">
          <span>✓ Added “{bundle.name}” to your cart</span>
          <button className={styles.toastLink} onClick={() => navigate("/cart")}>View Cart ({itemCount}) →</button>
        </div>
      )}
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/products">Shop</Link><span>/</span>
          <Link to="/products?category=curated-collections">Curated Collections</Link><span>/</span>
          <span className={styles.breadcrumbCurrent}>{bundle.name}</span>
        </nav>

        <div className={styles.productShowcase} style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
          {/* Contents */}
          <div className={styles.galleryCol}>
            <span className={styles.categoryTag}>{bundle.group}</span>
            <h1 className={styles.title}>{bundle.name}</h1>
            <p className={shop.note} style={{ fontSize: 16 }}>{bundle.description}</p>
            <h2 style={{ fontFamily: "'Canela', serif", fontSize: 22, color: "#4A0B1D", margin: "22px 0 12px" }}>What is included</h2>
            <ul className={shop.compList}>
              {contents.map((c, i) => (
                <li key={i}>
                  <span className={shop.compQty}>{c.qty}×</span>
                  <span>{c.name}{c.meta && <span className={shop.compMeta}>{c.meta}</span>}</span>
                </li>
              ))}
            </ul>
            <p className={shop.note} style={{ marginTop: 14 }}>
              The collection price is the sum of its products’ individual prices. Components are packed together for dispatch.
            </p>
          </div>

          {/* Selectors + purchase */}
          <div className={styles.detailsCol}>
            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>{showFrom ? `From ${inr(livePrice)}` : inr(livePrice)}</span>
              <span className={styles.taxNote}>{FOOTNOTE_PRICE}</span>
            </div>

            {!avail?.available && <div className={shop.errBox}>This collection is currently unavailable because a required item is out of stock.</div>}

            {bundle.needs.fragrance && (
              <div className={shop.selBlock} role="radiogroup" aria-label="Fragrance">
                <div className={shop.selLabel}>
                  <span>Choose your fragrance</span>
                  <small>{bundle.components.filter((c) => c.via === "fragrance").length > 1 ? "Applied to every incense format" : ""}</small>
                </div>
                <div className={shop.chips}>
                  {CORE.map((f) => (
                    <button key={f} role="radio" aria-checked={fragrance === f} disabled={!avail?.fragrance?.[f]}
                      className={`${shop.chip} ${fragrance === f ? shop.chipOn : ""}`} onClick={() => setFragrance(f)}>
                      {catalog.fragrances[f].label}
                    </button>
                  ))}
                </div>
                {fragrance && <p className={shop.fragDesc}><b>{catalog.fragrances[fragrance].label}</b> — {catalog.fragrances[fragrance].short}</p>}
              </div>
            )}

            {bundle.needs.camphor && (
              <div className={shop.selBlock} role="radiogroup" aria-label="Camphor fragrance">
                <div className={shop.selLabel}>
                  <span>Choose your camphor fragrance</span>
                  <small>Both tablets share one fragrance</small>
                </div>
                <div className={shop.chips}>
                  {CAMPHOR.map((f) => (
                    <button key={f} role="radio" aria-checked={camphor === f} disabled={!avail?.camphor?.[f]}
                      className={`${shop.chip} ${camphor === f ? shop.chipOn : ""}`} onClick={() => setCamphor(f)}>
                      {catalog.fragrances[f].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bundle.needs.pair && (
              <div className={shop.selBlock} role="radiogroup" aria-label="Fragrance pair">
                <div className={shop.selLabel}><span>Choose your fragrance pair</span></div>
                <div className={shop.chips}>
                  {PAIRS.map((k) => (
                    <button key={k} role="radio" aria-checked={pair === k} disabled={!avail?.pair?.[k]}
                      className={`${shop.chip} ${pair === k ? shop.chipOn : ""}`} onClick={() => setPair(k)}>
                      {k.split("-").map((x) => catalog.fragrances[x].label).join(" + ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bundle.components.some((c) => c.via === "fixed" && getProduct(catalog, c.product)?.mode === "fixed") && (
              <div className={shop.selBlock}>
                <div className={shop.selLabel}>Sambrani</div>
                <span className={shop.fixedNote}>Guggal only</span>
              </div>
            )}

            {needN > 0 && (
              <div className={shop.selBlock}>
                <div className={shop.selLabel}>
                  <span>{needN === 1 ? "Choose your bracelet" : `Choose ${needN} different bracelets`}</span>
                  <small>{bracelets.length}/{needN} selected</small>
                </div>
                <div className={shop.braceletGrid}>
                  {braceletProducts.map((p) => {
                    const on = bracelets.includes(p.slug);
                    const stocked = avail?.bracelets?.[p.slug];
                    const full = !on && bracelets.length >= needN && needN > 1;
                    return (
                      <button key={p.slug} type="button" aria-pressed={on} disabled={!stocked || full}
                        className={`${shop.braceletOpt} ${on ? shop.braceletOn : ""}`} onClick={() => toggleBracelet(p.slug)}>
                        {on && <span className={shop.tick}>✓</span>}
                        <img src={imgSrc(p.image)} alt="" loading="lazy" />
                        {p.name.replace(" Bracelet", "")}
                        <div style={{ fontWeight: 400, fontSize: 11 }}>{inr(p.price)}</div>
                        {!stocked && <div style={{ fontWeight: 400, fontSize: 11 }}>Out of stock</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.actionsRow}>
              <div className={styles.addWrap}>
                <button className={`${styles.addToCartBtn} ${inCart ? styles.addedBtn : ""}`} disabled={!ready}
                  onClick={(e) => (inCart ? navigate("/cart") : add(e))}>
                  <span data-label style={{ display: "inline-block" }}>
                    {!avail?.available ? "Unavailable" : missing.length ? `Select ${missing[0]}` : inCart ? "✓ In Cart · View Cart →" : `Add to Cart · ${inr(livePrice)}`}
                  </span>
                </button>
              </div>
            </div>
            <div className={styles.perks} style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
              <span>🚚 {shippingCopy(catalog.shipping)}</span>
              {livePrice >= catalog.shipping.freeAbove && <span>✓ This collection qualifies for free shipping.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
