import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import shop from "../shop/Shop.module.css";
import { useCart } from "../context/CartContext";
import useCatalog from "../hooks/useCatalog";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { FOOTNOTE_PRICE, PENDING_RETURNS } from "../shop/content";
import { inr, imgSrc, shippingCopy, getProduct, getBundle, bundleLine, liveBundlePrice, bundleThumbImage, formatPackFacts, includeMetaLine } from "../shop/shopUtils";
import { RETURNS_POLICY_LIVE } from "../shop/storeFlags";
import { addToCartEvent, bundleView } from "../utils/analytics";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";
import ResponsiveImg from "../components/ResponsiveImg";
import { InlineBack } from "../components/PageBack";

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
  const [zoomed, setZoomed] = useState(false);
  const [tab, setTab] = useState("about");

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
  const hero = bundleThumbImage(catalog, bundle);
  const origin = siteOrigin();

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
  const qualifiesFree = livePrice >= catalog.shipping.freeAbove;

  let bi = 0;
  const contents = bundle.components.map((c) => {
    if (c.bracelet) {
      const sl = bracelets[bi++];
      const p = sl && getProduct(catalog, sl);
      return { qty: 1, name: p ? p.name : "Bracelet — your choice", meta: p ? formatPackFacts(p.pack) : "Select your bracelet" };
    }
    const p = getProduct(catalog, c.product);
    const f = c.via === "pair" ? pair : c.via === "fixed" ? c.variant : c.via === "camphor" ? camphor : fragrance;
    let fragranceLabel = "";
    if (f) {
      if (c.via === "pair") fragranceLabel = f.split("-").map((x) => catalog.fragrances[x].label).join(" + ");
      else if (!(c.via === "fixed" && p.mode === "none")) fragranceLabel = catalog.fragrances[f]?.label || "";
    }
    return {
      qty: 1,
      name: p.name,
      meta: includeMetaLine({ pack: p.pack, via: c.via, fragranceLabel }),
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

  const buyNow = () => {
    if (!ready) return;
    addToCart(line);
    addToCartEvent(line);
    navigate("/cart");
  };

  return (
    <div className={styles.page}>
      <Seo
        title={`${bundle.name} – Curated collection | Bhava:`}
        description={clipDesc(bundle.description, bundle.tagline)}
        canonical={`${origin}/collection/${bundle.slug}`}
        image={origin + imgSrc(hero).replace(origin, "")}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: bundle.name,
          image: `${origin}${imgSrc(hero).replace(origin, "")}`,
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

        <div className={styles.productShowcase}>
          {/* ── Left: gallery (same as PDP) ── */}
          <div className={styles.galleryCol}>
            <div
              className={styles.mainImageWrapper}
              onClick={() => setZoomed((z) => !z)}
              style={zoomed ? { cursor: "zoom-out" } : { cursor: "zoom-in" }}
              role="img"
              aria-label={`${bundle.name} collection image`}
            >
              <ResponsiveImg
                src={hero}
                alt={bundle.name}
                className={styles.mainImage}
                width={720}
                height={720}
                loading="eager"
                sizes="(max-width: 600px) 55vw, (max-width: 900px) 80vw, 480px"
                style={zoomed ? { transform: "scale(1.45)" } : undefined}
              />
              <span className={styles.badgeOverlay}>Collection</span>
            </div>
          </div>

          {/* ── Right: buy box (same as PDP) ── */}
          <div className={styles.detailsCol}>
            <InlineBack fallback="/products?category=curated-collections" />
            <span className={styles.categoryTag}>{bundle.group || "Curated collection"}</span>
            <h1 className={styles.title}>{bundle.name}</h1>

            <div className={shop.includesBlock} aria-label="What's included">
              <div className={shop.selLabel}>
                <span>What's included</span>
              </div>
              <ul className={shop.compList}>
                {contents.map((c, i) => (
                  <li key={i}>
                    <span className={shop.compQty}>{c.qty}×</span>
                    <span>{c.name}{c.meta && <span className={shop.compMeta}>{c.meta}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>{inr(livePrice)}</span>
              <span className={styles.taxNote}>{FOOTNOTE_PRICE}</span>
            </div>

            {!avail?.available && (
              <div className={shop.errBox}>This collection is currently unavailable because a required item is out of stock.</div>
            )}

            {bundle.needs.fragrance && (
              <div className={shop.selBlock} role="radiogroup" aria-label="Fragrance">
                <div className={shop.selLabel}>
                  <span>Choose your fragrance</span>
                  <small>{bundle.components.filter((c) => c.via === "fragrance").length > 1 ? "Applied to every incense format" : ""}</small>
                </div>
                <div className={shop.chips}>
                  {CORE.map((f) => (
                    <button
                      key={f}
                      role="radio"
                      aria-checked={fragrance === f}
                      disabled={!avail?.fragrance?.[f]}
                      className={`${shop.chip} ${fragrance === f ? shop.chipOn : ""}`}
                      onClick={() => setFragrance(f)}
                    >
                      {catalog.fragrances[f].label}
                    </button>
                  ))}
                </div>
                {fragrance && (
                  <p className={shop.fragDesc}>
                    <b>{catalog.fragrances[fragrance].label}</b> — {catalog.fragrances[fragrance].short}
                  </p>
                )}
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
                    <button
                      key={f}
                      role="radio"
                      aria-checked={camphor === f}
                      disabled={!avail?.camphor?.[f]}
                      className={`${shop.chip} ${camphor === f ? shop.chipOn : ""}`}
                      onClick={() => setCamphor(f)}
                    >
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
                    <button
                      key={k}
                      role="radio"
                      aria-checked={pair === k}
                      disabled={!avail?.pair?.[k]}
                      className={`${shop.chip} ${pair === k ? shop.chipOn : ""}`}
                      onClick={() => setPair(k)}
                    >
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
                      <button
                        key={p.slug}
                        type="button"
                        aria-pressed={on}
                        disabled={!stocked || full}
                        className={`${shop.braceletOpt} ${on ? shop.braceletOn : ""}`}
                        onClick={() => toggleBracelet(p.slug)}
                      >
                        {on && <span className={shop.tick}>✓</span>}
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

            <div className={styles.actionsRow}>
              <div className={styles.addWrap}>
                <button
                  className={`${styles.addToCartBtn} ${inCart ? styles.addedBtn : ""}`}
                  disabled={!ready}
                  onClick={(e) => (inCart ? navigate("/cart") : add(e))}
                >
                  <span data-label style={{ display: "inline-block" }}>
                    {!avail?.available
                      ? "Unavailable"
                      : missing.length
                        ? `Select ${missing[0]}`
                        : inCart
                          ? "✓ In Cart · View Cart →"
                          : "Add to Cart +"}
                  </span>
                </button>
              </div>
              <button className={styles.buyNowBtn} onClick={buyNow} disabled={!ready}>
                Buy Now →
              </button>
            </div>

            <div className={styles.perks}>
              <span>🚚 {shippingCopy(catalog.shipping)}</span>
              {qualifiesFree && <span>✓ Free shipping on this collection</span>}
            </div>

            <div className={styles.trustGrid} aria-label="Collection assurances">
              <div className={styles.trustTrack}>
                {[
                  { icon: "✦", label: "Thoughtfully curated" },
                  { icon: "◈", label: "Secure checkout" },
                  { icon: "◎", label: RETURNS_POLICY_LIVE ? "Easy returns guidance" : "Inclusive of GST" },
                  { icon: "◉", label: "Packed with care" },
                ].map((t) => (
                  <div key={t.label} className={styles.trustItem}>
                    <span className={styles.trustIcon}>{t.icon}</span> {t.label}
                  </div>
                ))}
                <div className={styles.trustDup} aria-hidden="true">
                  {[
                    { icon: "✦", label: "Thoughtfully curated" },
                    { icon: "◈", label: "Secure checkout" },
                    { icon: "◎", label: RETURNS_POLICY_LIVE ? "Easy returns guidance" : "Inclusive of GST" },
                    { icon: "◉", label: "Packed with care" },
                  ].map((t) => (
                    <div key={`dup-${t.label}`} className={styles.trustItem}>
                      <span className={styles.trustIcon}>{t.icon}</span> {t.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info tabs (PDP-style) ── */}
        <section className={styles.infoSection}>
          <div className={styles.tabsHeader} role="tablist">
            {[
              ["about", "About"],
              ["ship", "Shipping & Returns"],
            ].map(([k, l]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                className={`${styles.tabBtn} ${tab === k ? styles.tabBtnActive : ""}`}
                onClick={() => setTab(k)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className={styles.tabBody}>
            {tab === "about" && (
              <div>
                {bundle.description ? <p>{bundle.description}</p> : null}
                {bundle.tagline ? <p style={{ marginTop: 14 }}><em>{bundle.tagline}</em></p> : null}
                <p style={{ marginTop: 14 }}>
                  The collection price is the sum of its products’ individual prices — nothing hidden, nothing crossed out. Components are packed together for dispatch.
                </p>
              </div>
            )}
            {tab === "ship" && (
              <div>
                <p>{shippingCopy(catalog.shipping)}</p>
                <p style={{ marginTop: 14 }}>{RETURNS_POLICY_LIVE ? "Returns guidance is available at checkout and in Help & Support." : PENDING_RETURNS}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
