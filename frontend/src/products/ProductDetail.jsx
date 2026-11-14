import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import shop from "../shop/Shop.module.css";
import { useCart } from "../context/CartContext";
import useCatalog from "../hooks/useCatalog";
import { QuantityDecrease, QuantityValue, QuantityIncrease } from "../components/Quantity";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { ProductCard } from "../shop/Cards";
import { faqsFor, PENDING_USE_SAFETY, PENDING_RETURNS, FOOTNOTE_PRICE } from "../shop/content";
import { inr, imgSrc, shippingCopy, bundleContentLines, productMaxQty, getProduct, getBundle, variantInStock, productInStock, productLine } from "../shop/shopUtils";
import { RETURNS_POLICY_LIVE, DISPATCH_SLA } from "../shop/storeFlags";
import { viewItem, selectItem, addToCartEvent } from "../utils/analytics";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";
import ReviewsSection, { Stars } from "./ReviewsSection";
import ResponsiveImg from "../components/ResponsiveImg";

export default function ProductDetail() {
  const { id } = useParams();
  return <ProductDetailInner key={id} slug={id} />; // remount per product → selection/qty/tab reset
}

function ProductDetailInner({ slug }) {
  const navigate = useNavigate();
  const { addToCart, itemCount, cartItems } = useCart();
  const { catalog, loading, error, reload } = useCatalog();

  const product = getProduct(catalog, slug);
  const [picked, setPicked] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("about");
  const [toast, setToast] = useState(false);
  const [addedQty, setAddedQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [stickyBuy, setStickyBuy] = useState(false);
  const actionsRef = useRef(null);
  const onReviewSummary = useCallback((s) => setReviewSummary(s), []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Old standalone RQ / RH pages → one mixed-stone listing (SB-RQ-RH)
  useEffect(() => {
    if (loading || product) return;
    if (slug === "rose-quartz-bracelet" || slug === "rhodonite-bracelet") {
      navigate("/product/rose-quartz-rhodonite-bracelet", { replace: true });
    }
  }, [loading, product, slug, navigate]);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setStickyBuy(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "-64px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [product?.slug]);
  // Single-variant products are pre-selected; otherwise the shopper must choose explicitly
  const variantKey = product ? (product.variants.length === 1 ? product.variants[0].key : picked) : "";
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(false), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (product) viewItem(product, variantKey);
  }, [product, variantKey]);

  const variant = product?.variants.find((v) => v.key === variantKey);
  const lineId = product && variant ? `product:${product.slug}:${variant.key}` : "";
  const inCart = cartItems.find((i) => i.productId === lineId);
  const inStock = product ? (variant ? variantInStock(catalog, product.slug, variant.key) : productInStock(catalog, product)) : false;
  // Quantity can never exceed what is actually in stock (minus what this line already has in the cart)
  const maxQty = product && variant ? Math.max(0, productMaxQty(catalog, product.slug, variant.key) - (inCart?.quantity || 0)) : 20;
  const qtyEff = Math.max(1, Math.min(qty, maxQty || 1));
  const atStockLimit = !!variant && inStock && maxQty < 20 && qtyEff >= maxQty;
  const gallery = product ? [product.image, ...(product.gallery || [])].filter(Boolean) : [];
  const faqs = useMemo(() => (product && catalog ? faqsFor(product, catalog) : []), [product, catalog]);
  // Must stay above early returns — cold QR deep-links hit loading first, then remount hooks
  const alsoLike = useMemo(() => {
    if (!product || !catalog?.products) return [];
    const seen = new Set([product.slug]);
    const out = [];
    const push = (p) => {
      if (!p || seen.has(p.slug) || out.length >= 4) return;
      seen.add(p.slug);
      out.push(p);
    };
    (product.related?.crossSell || []).forEach((s) => push(getProduct(catalog, s)));
    catalog.products.filter((p) => p.category === product.category).forEach(push);
    catalog.products.forEach(push);
    return out;
  }, [catalog, product]);

  if (loading) return <div className={styles.page}><div className={shop.loadingBox}>Loading…</div></div>;
  if (error || !catalog) {
    return (
      <div className={styles.page}>
        <div className={shop.loadingBox}>
          <p>{error || "Catalogue unavailable."}</p>
          <button className={shop.btn} onClick={reload}>Try again</button>
        </div>
      </div>
    );
  }
  if (!product) {
    if (slug === "rose-quartz-bracelet" || slug === "rhodonite-bracelet") {
      return <div className={styles.page}><div className={shop.loadingBox}>Loading…</div></div>;
    }
    return (
      <div className={styles.page}>
        <div className={shop.loadingBox}>
          <h2 style={{ fontFamily: "'Canela', serif", color: "#4A0B1D" }}>We couldn’t find that product</h2>
          <button className={shop.btn} onClick={() => navigate("/products")}>← Back to the shop</button>
        </div>
      </div>
    );
  }

  const category = catalog.categories.find((c) => c.id === product.category);
  const needsChoice = product.variants.length > 1 && !variant;
  const choiceNoun = product.mode === "pair" ? "a fragrance pair" : "a fragrance";
  const qualifiesFree = product.price >= catalog.shipping.freeAbove;
  const rel = product.related || {};
  const upsells = [
    rel.upsell && { type: "product", slug: rel.upsell, kicker: "Make It More Sacred" },
    rel.upsellBundle && { type: "bundle", slug: rel.upsellBundle, kicker: "Make It More Sacred" },
    rel.upsellAlt && { type: "product", slug: rel.upsellAlt, kicker: "A Sacred Companion" }, // neutral — not described as an upgrade
  ].filter(Boolean);
  const bundle = rel.bundle ? getBundle(catalog, rel.bundle) : null;

  const add = (e) => {
    if (needsChoice || !inStock) return;
    const btn = e?.currentTarget;
    const line = productLine(product, variant.key, qtyEff);
    addToCart(line);
    addToCartEvent(line);
    if (btn) playAddToCartAnimation(btn, { image: product.image });
    setAddedQty(qtyEff);
    setToast(true);
  };
  const buyNow = () => {
    if (needsChoice || !inStock) return;
    const line = productLine(product, variant.key, qtyEff);
    addToCart(line);
    addToCartEvent(line);
    navigate("/cart");
  };

  // Fragrance details to show for the current selection
  const shownFragrances = variant ? variant.fragrances : product.mode === "all" ? product.variants[0].fragrances : [];

  const origin = siteOrigin();
  const seoDesc = clipDesc(product.seoDescription || product.description, product.tagline || product.pack);
  const seoTitle = product.seoTitle || `${product.name}${product.pack ? ` – ${product.pack}` : ""} | Bhava`;

  return (
    <div className={styles.page}>
      <Seo
        title={seoTitle}
        description={seoDesc}
        canonical={`${origin}/product/${product.slug}`}
        image={origin + imgSrc(product.image).replace(origin, "")}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: `${origin}${product.image || ""}`,
          description: seoDesc,
          sku: product.slug,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }}
      />
      {toast && (
        <div className={styles.toast} role="status">
          <span>✓ Added {addedQty} × “{product.name}”{variant?.label && product.mode !== "none" ? ` (${variant.label})` : ""}</span>
          <button className={styles.toastLink} onClick={() => navigate("/cart")}>View Cart ({itemCount}) →</button>
        </div>
      )}

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/products">Products</Link><span>/</span>
          <Link to={`/products?category=${product.category}`}>{category?.label}</Link><span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className={styles.productShowcase}>
          <div className={styles.galleryCol}>
            <div
              className={styles.mainImageWrapper}
              onClick={() => setZoomed((z) => !z)}
              onTouchStart={(e) => { e.currentTarget.dataset.x = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const start = Number(e.currentTarget.dataset.x || 0);
                const dx = e.changedTouches[0].clientX - start;
                if (dx > 40) setActiveImg((i) => Math.max(0, i - 1));
                if (dx < -40) setActiveImg((i) => Math.min(gallery.length - 1, i + 1));
              }}
              style={zoomed ? { cursor: "zoom-out" } : { cursor: "zoom-in" }}
              role="img"
              aria-label={`${product.name} product image`}
            >
              <ResponsiveImg
                src={gallery[Math.min(activeImg, gallery.length - 1)]}
                alt={`${product.name}${product.pack ? ` – ${product.pack}` : ""}`}
                className={styles.mainImage}
                width={720}
                height={720}
                loading="eager"
                sizes="(max-width: 600px) 55vw, (max-width: 900px) 80vw, 480px"
                style={zoomed ? { transform: "scale(1.45)" } : undefined}
              />
            </div>
            {gallery.length > 1 && (
              <div className={styles.thumbnailRow}>
                {gallery.map((g, i) => (
                  <button key={g + i} type="button" className={`${styles.thumbnailBtn} ${i === activeImg ? styles.thumbnailActive : ""}`} onClick={() => setActiveImg(i)} aria-label={`Show image ${i + 1}`}>
                    <img src={imgSrc(g)} alt={`${product.name} view ${i + 1}`} className={styles.thumbnailImg} loading="lazy" width={96} height={96} />
                  </button>
                ))}
              </div>
            )}
            {gallery.length > 1 && (
              <div className={styles.galleryDots} role="tablist" aria-label="Product images">
                {gallery.map((g, i) => (
                  <button
                    key={`dot-${g}-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={i === activeImg}
                    className={`${styles.galleryDot} ${i === activeImg ? styles.galleryDotOn : ""}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Image ${i + 1} of ${gallery.length}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailsCol}>
            <span className={styles.categoryTag}>{category?.label}</span>
            <h1 className={styles.title}>{product.name}</h1>
            {product.tagline && <p className={styles.tagline}>{product.tagline}</p>}

            <button
              type="button"
              className={styles.ratingRow}
              onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <Stars value={reviewSummary?.count ? Math.round(reviewSummary.average) : 0} size={15} />
              <strong>{reviewSummary?.count ? reviewSummary.average.toFixed(2) : "—"}</strong>
              <span>
                {reviewSummary?.count
                  ? `${reviewSummary.count} review${reviewSummary.count !== 1 ? "s" : ""}`
                  : "Be the first to review"}
              </span>
            </button>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>{inr(product.price)}</span>
              <span className={styles.taxNote}>{FOOTNOTE_PRICE}</span>
            </div>

            <div className={styles.stockStatus} aria-live="polite">
              <span className={styles.stockDot} style={inStock ? undefined : { background: "#a2331f" }}></span>
              <span className={inStock ? shop.stockOk : shop.stockOut}>
                {inStock
                  ? (DISPATCH_SLA ? "In stock · Ready to ship" : "In stock")
                  : variant ? "This option is out of stock" : "Out of stock"}
              </span>
            </div>

            {product.intention && (
              <div className={styles.intentionBox}>
                <span className={styles.intentionLabel}>Intention</span>
                <p className={styles.intentionText}>{product.intention}</p>
              </div>
            )}

            {/* ── Variant selector (only valid combinations from the master matrix) ── */}
            {product.mode === "all" && (
              <div className={shop.selBlock}>
                <div className={shop.selLabel}>Fragrances</div>
                <div className={shop.chips}>
                  {product.variants[0].fragrances.map((f) => <span key={f} className={shop.fixedNote}>{catalog.fragrances[f].label}</span>)}
                </div>
                <p className={shop.note} style={{ marginTop: 8 }}>45 sticks in total across all three fragrances.</p>
              </div>
            )}
            {product.mode === "fixed" && (
              <div className={shop.selBlock}>
                <div className={shop.selLabel}>Fragrance</div>
                <span className={shop.fixedNote}>Guggal only</span>
              </div>
            )}
            {(product.mode === "single" || product.mode === "pair" || product.mode === "camphor") && (
              <div className={shop.selBlock} role="radiogroup" aria-label={product.mode === "pair" ? "Fragrance pair" : "Fragrance"}>
                <div className={shop.selLabel}>
                  <span>{product.mode === "pair" ? "Choose your pair" : "Choose your fragrance"}</span>
                  {product.mode === "camphor" && <small>Both tablets share the same fragrance</small>}
                </div>
                <div className={shop.chips}>
                  {product.variants.map((v) => {
                    const ok = variantInStock(catalog, product.slug, v.key);
                    return (
                      <button
                        key={v.key}
                        role="radio"
                        aria-checked={variantKey === v.key}
                        disabled={!ok}
                        title={ok ? "" : "Out of stock"}
                        className={`${shop.chip} ${variantKey === v.key ? shop.chipOn : ""}`}
                        onClick={() => { setPicked(v.key); selectItem(product, v.key); }}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {shownFragrances.length > 0 && (
              <div className={shop.fragDesc}>
                {shownFragrances.map((f) => (
                  <p key={f} style={{ margin: "0 0 6px" }}>
                    <b>{catalog.fragrances[f].label}</b> — {catalog.fragrances[f].short}
                  </p>
                ))}
              </div>
            )}

            {/* ── Quantity + actions ── */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Quantity</span>
              <div className={styles.qtyWrapper}>
                <QuantityDecrease value={qtyEff} onClick={() => setQty(Math.max(1, qtyEff - 1))} />
                <QuantityValue>{qtyEff}</QuantityValue>
                <QuantityIncrease value={qtyEff} max={Math.max(1, maxQty)} onClick={() => setQty(Math.min(Math.max(1, maxQty), qtyEff + 1))} />
              </div>
            </div>
            {atStockLimit && (
              <p className={shop.note} role="status" style={{ margin: "-4px 0 12px", textAlign: "right" }}>
                {inCart ? "You already have the maximum available quantity in your cart." : "Maximum available quantity selected."}
              </p>
            )}

            <div className={styles.actionsRow} ref={actionsRef}>
              <div className={styles.addWrap}>
                <button
                  className={`${styles.addToCartBtn} ${inCart ? styles.addedBtn : ""}`}
                  disabled={!inStock || needsChoice}
                  onClick={(e) => (inCart ? navigate("/cart") : add(e))}
                >
                  <span data-label style={{ display: "inline-block" }}>
                    {!inStock && variant
                      ? "Out of stock"
                      : needsChoice
                        ? `Select ${choiceNoun}`
                        : inCart
                          ? `✓ In Cart (${inCart.quantity}) · View Cart →`
                          : "Add to Cart +"}
                  </span>
                </button>
              </div>
              <button className={styles.buyNowBtn} onClick={buyNow} disabled={!inStock || needsChoice}>Buy Now →</button>
            </div>

            <div className={styles.perks}>
              <span>🚚 {shippingCopy(catalog.shipping)}</span>
              {qualifiesFree && <span>✓ Free shipping on this item</span>}
            </div>

            <div className={styles.trustGrid} aria-label="Product assurances">
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

            {/* ── Upsell ── */}
            {upsells.map((u) => {
              if (u.type === "bundle") {
                const b = getBundle(catalog, u.slug);
                return b ? (
                  <Link key={u.slug} to={`/collection/${b.slug}`} className={shop.promo}>
                    <div>
                      <div className={shop.promoK}>{u.kicker}</div>
                      <div className={shop.promoT}>{b.name} — {inr(b.price)}</div>
                      <div className={shop.promoS}>{b.description}</div>
                    </div>
                    <span className={shop.promoGo}>View →</span>
                  </Link>
                ) : null;
              }
              const up = getProduct(catalog, u.slug);
              return up ? (
                <Link key={u.slug} to={`/product/${up.slug}`} className={shop.promo}>
                  <div>
                    <div className={shop.promoK}>{u.kicker}</div>
                    <div className={shop.promoT}>{up.name} — {inr(up.price)}</div>
                    <div className={shop.promoS}>{up.pack}</div>
                  </div>
                  <span className={shop.promoGo}>View →</span>
                </Link>
              ) : null;
            })}

            {/* ── One highly relevant curated collection ── */}
            {bundle && (
              <Link to={`/collection/${bundle.slug}`} className={shop.promo} style={{ borderStyle: "dashed" }}>
                <div>
                  <div className={shop.promoK}>Curated collection</div>
                  <div className={shop.promoT}>{bundle.name} — {inr(bundle.price)}</div>
                  <div className={shop.promoS}>{bundleContentLines(catalog, bundle).join(" · ")}</div>
                </div>
                <span className={shop.promoGo}>Choose &amp; add →</span>
              </Link>
            )}
          </div>
        </div>

        {/* ── Information ── */}
        <section className={styles.infoSection}>
          <div className={styles.tabsHeader} role="tablist">
            {[["about", "About"], ["contents", "Pack Contents"], ["use", "Use & Safety"], ["ship", "Shipping & Returns"]].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={`${styles.tabBtn} ${tab === k ? styles.tabBtnActive : ""}`} onClick={() => setTab(k)}>
                {l}
              </button>
            ))}
          </div>
          <div className={styles.tabBody}>
            {tab === "about" && (
              <div>
                {product.description ? <p>{product.description}</p> : null}
                {product.intention && (
                  <p style={{ marginTop: 14 }}><strong>Intention:</strong> <em>{product.intention}</em></p>
                )}
                {product.fitNote && <p style={{ marginTop: 14 }}>{product.fitNote}</p>}
                {product.mode !== "none" && product.mode !== "fixed" && (
                  <div style={{ marginTop: 18 }}>
                    <strong>The fragrances</strong>
                    {Object.values(catalog.fragrances)
                      .filter((fr) => product.variants.some((v) => v.fragrances.includes(fr.id)))
                      .map((fr) => (
                        <p key={fr.id} style={{ marginTop: 10 }}>
                          <b>{fr.label}</b> <span style={{ color: "#7a6a6e" }}>· {fr.short}</span><br />
                          {fr.description}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}
            {tab === "contents" && (
              <table className={shop.contents}>
                <tbody>
                  {product.contents.map(([k, v]) => (
                    <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === "use" && (
              <div>
                {[["How to use", product.usage], ["Safety", product.safety], ["Storage", product.storage], ["Materials / ingredients", product.materials]]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 14 }}><strong>{k}</strong><p style={{ margin: "4px 0 0", whiteSpace: "pre-line" }}>{v}</p></div>
                  ))}
                {!product.usage && !product.safety && <p className={shop.pending}>{PENDING_USE_SAFETY}</p>}
              </div>
            )}
            {tab === "ship" && (
              <div className={styles.shipTab}>
                <p className={styles.shipLead}>{shippingCopy(catalog.shipping)}.</p>
                <div className={styles.policyLinks}>
                  <Link to="/shipping-policy" className={styles.policyLink}>Shipping policy</Link>
                  <span className={styles.policyDot} aria-hidden="true">·</span>
                  <Link to="/returns-refund-policy" className={styles.policyLink}>Returns &amp; refund policy</Link>
                </div>
                {!RETURNS_POLICY_LIVE && <p className={`${shop.pending} ${styles.shipPending}`}>{PENDING_RETURNS}</p>}
              </div>
            )}
          </div>
        </section>

        {/* ── You May Also Like ── */}
        {alsoLike.length > 0 && (
          <section className={styles.similarSection} aria-labelledby="also-like-title">
            <div className={styles.similarHeader}>
              <span className={styles.similarKicker}>Sacred Pairings</span>
              <h2 id="also-like-title" className={styles.similarTitle}>You May Also Like</h2>
              <p className={styles.similarSub}>
                Soft companions for this offering — chosen to deepen devotion, not distract from it.
              </p>
            </div>
            <div className={styles.similarGrid}>
              {alsoLike.map((p) => <ProductCard key={p.slug} product={p} catalog={catalog} />)}
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section className={styles.infoSection}>
          <h2 className={styles.sectionHeading}>Questions</h2>
          <div className={shop.faq}>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Customer Reviews (Phool-style) ── */}
        <ReviewsSection productId={product.slug} productTitle={product.name} onSummary={onReviewSummary} />

        {/* ── Devotion & ritual imagery ── */}
        <section className={styles.ritualSection} aria-labelledby="ritual-visuals-title">
          <div className={styles.ritualIntro}>
            <p className={styles.ritualKicker}>Devotion &amp; ritual</p>
            <h2 id="ritual-visuals-title" className={styles.sectionHeading}>Made for quiet practice</h2>
            <p className={styles.ritualLead}>
              Soft light, steady breath, and a fragrance that stays with you — small moments that turn a room into a sanctuary.
            </p>
          </div>
          <div className={styles.ritualGrid}>
            {[
              {
                src: "/Daily%20Practices/Daily%20Puja.png",
                alt: "Daily puja ritual with soft lamp light",
                caption: "Morning offering",
                note: "A calm start to the day",
              },
              {
                src: "/incense.jpeg",
                alt: "Incense rising during a quiet ritual",
                caption: "Fragrance & presence",
                note: "Let the smoke settle the mind",
              },
              {
                src: "/Daily%20Practices/Aarti.png",
                alt: "Aarti flame during devotion",
                caption: "Evening aarti",
                note: "Warm light for evening prayer",
              },
            ].map((item) => (
              <figure key={item.caption} className={styles.ritualFigure}>
                <div className={styles.ritualImgWrap}>
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </div>
                <figcaption>
                  <strong>{item.caption}</strong>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>

      {stickyBuy && (
        <div className={styles.stickyBuyBar} role="region" aria-label="Quick add to cart">
          <div className={styles.stickyBuyPrice}>
            <strong>{inr(product.price)}</strong>
            <span>{FOOTNOTE_PRICE}</span>
          </div>
          <button
            type="button"
            className={styles.stickyBuyBtn}
            disabled={!needsChoice && !inStock}
            onClick={(e) => {
              if (needsChoice) {
                document.querySelector(`.${shop.selBlock}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
              }
              if (!inStock) return;
              if (inCart) navigate("/cart");
              else add(e);
            }}
          >
            {!inStock && variant
              ? "Out of stock"
              : needsChoice
                ? "Select fragrance"
                : inCart
                  ? "View Cart →"
                  : "Add to Cart +"}
          </button>
        </div>
      )}
    </div>
  );
}
