import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useCartValidation from "../hooks/useCartValidation";
import useCatalog from "../hooks/useCatalog";
import {
  MAX_LINE_QTY, imgSrc, inr, suggestAddOn, getProduct, productLine, shippingCopy,
  productInStock,
} from "../shop/shopUtils";
import { playAddToCartAnimation } from "../utils/cartAnimation";
import { viewCart } from "../utils/analytics";
import styles from "./CartPage.module.css";
import x from "./CartLayout.module.css";

// Celebration particles: fixed, deterministic spread (no randomness needed)
const BURST_COLORS = ["#FFD9B3", "#E07B39", "#F3C56B", "#ffffff", "#f0a86f"];
const BURST = Array.from({ length: 26 }, (_, i) => {
  const angle = ((i * 360) / 26 + (i % 2 ? 7 : -5)) * (Math.PI / 180);
  const dist = 46 + ((i * 37) % 52);
  return {
    x: Math.round(Math.cos(angle) * dist * 1.5),
    y: Math.round(Math.sin(angle) * dist),
    c: BURST_COLORS[i % BURST_COLORS.length],
    s: 5 + (i % 3) * 2,
    d: (i % 5) * 30,
  };
});

// Incense first, Sacred Beads last (chips + product order)
const LIKE_CAT_ORDER = [
  "incense-sticks",
  "incense-cones",
  "bamboo-less-incense",
  "sambrani-camphor",
  "sacred-beads",
];
const catRank = (id) => {
  const i = LIKE_CAT_ORDER.indexOf(id);
  return i === -1 ? 50 : i;
};

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, addToCart, itemCount } = useCart();
  const { catalog } = useCatalog();
  const { loading, error, data } = useCartValidation(cartItems);

  // Free-shipping celebration: fires only when the cart goes from "below threshold" to "unlocked"
  const unlocked = !!data && data.allOk && data.shipping === 0;
  const [wasUnlocked, setWasUnlocked] = useState(null);
  const [burst, setBurst] = useState(0);
  const [likeCat, setLikeCat] = useState("all");
  if (data && wasUnlocked !== unlocked) {
    setWasUnlocked(unlocked);
    if (wasUnlocked === false && unlocked) setBurst((b) => b + 1);
  }

  const alsoLike = useMemo(() => {
    if (!catalog?.products?.length) return [];
    const inBag = new Set(cartItems.filter((i) => i.kind === "product").map((i) => i.slug));
    const ranked = [];
    const push = (p) => {
      if (!p || inBag.has(p.slug) || ranked.some((r) => r.slug === p.slug)) return;
      ranked.push(p);
    };
    cartItems.forEach((item) => {
      const p = item.kind === "product" ? getProduct(catalog, item.slug) : null;
      (p?.related?.crossSell || []).forEach((slug) => push(getProduct(catalog, slug)));
      if (p?.related?.upsell) push(getProduct(catalog, p.related.upsell));
      if (p?.related?.upsellAlt) push(getProduct(catalog, p.related.upsellAlt));
    });
    catalog.products.forEach(push);
    ranked.sort((a, b) => {
      const byCat = catRank(a.category) - catRank(b.category);
      if (byCat) return byCat;
      return Number(productInStock(catalog, b)) - Number(productInStock(catalog, a));
    });
    const incense = ranked.filter((p) => p.category !== "sacred-beads");
    const beads = ranked.filter((p) => p.category === "sacred-beads");
    return [...incense.slice(0, 8), ...beads.slice(0, 4)];
  }, [catalog, cartItems]);

  useEffect(() => {
    if (cartItems.length && data) viewCart(cartItems, data.total);
  }, [cartItems, data]);

  const likeCategories = useMemo(() => {
    const ids = [...new Set(alsoLike.map((p) => p.category))];
    ids.sort((a, b) => catRank(a) - catRank(b));
    return [
      { id: "all", label: "All" },
      ...ids.map((id) => ({
        id,
        label: catalog?.categories?.find((c) => c.id === id)?.label || id,
      })),
    ];
  }, [alsoLike, catalog]);

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <div className={styles.emptyBox}>
          <svg className={styles.emptyIcon} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#c9b99a" strokeWidth="2" />
            <path d="M20 22h24l-3 18H23L20 22Z" stroke="#c9b99a" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="27" cy="46" r="2" fill="#c9b99a" />
            <circle cx="37" cy="46" r="2" fill="#c9b99a" />
            <path d="M16 18h4l2 4" stroke="#c9b99a" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Explore our sacred beads, incense, Sambrani and camphor.</p>
          <button className={styles.continuBtn} onClick={() => navigate("/products")}>Browse the Shop</button>
        </div>
      </div>
    );
  }

  const shipRule = data?.shippingRule || catalog?.shipping || { fee: 50, freeAbove: 501 };
  const subtotal = data?.subtotal ?? 0;
  const shipping = typeof data?.shipping === "number" ? data.shipping : 0;
  const total = data?.total ?? 0;
  const allOk = !!data?.allOk;
  const remaining = shipRule.freeAbove - subtotal;
  // Count only items that are actually included in the total (unavailable lines are excluded)
  const payableCount = data ? data.lines.reduce((n, l) => n + (l.ok ? l.quantity : 0), 0) : itemCount;
  const addOn = catalog ? suggestAddOn(catalog, cartItems) : null;
  const addOnProduct = addOn && getProduct(catalog, addOn.slug);
  const likeShown = likeCat === "all" ? alsoLike : alsoLike.filter((p) => p.category === likeCat);

  const quickAddLike = (e, p) => {
    e.preventDefault();
    if (!productInStock(catalog, p)) return;
    if (p.variants.length === 1 && p.mode !== "single" && p.mode !== "camphor" && p.mode !== "pair") {
      const btn = e.currentTarget;
      addToCart(productLine(p, p.variants[0].key, 1));
      playAddToCartAnimation(btn, { image: p.image });
      return;
    }
    // Needs a fragrance / pair choice — send to product page
    navigate(`/product/${p.slug}`);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("bhava_token");
    navigate(token ? "/checkout" : "/auth", token ? undefined : { state: { from: "/checkout" } });
  };

  return (
    <div className={x.page}>
      {/* Step indicator: BAG → ADDRESS → PAYMENT */}
      <nav className={x.stepsBar} aria-label="Checkout steps">
        <ol className={x.steps}>
          <li className={x.stepOn} aria-current="step">Bag</li>
          <li className={x.dash} aria-hidden="true" />
          <li>Address</li>
          <li className={x.dash} aria-hidden="true" />
          <li>Payment</li>
        </ol>
      </nav>

      <div className={x.wrap}>
        <div className={x.layout}>
          {/* ── Left: items ── */}
          <section className={x.left} aria-label="Items in your bag">
            <div className={x.selectedBar}>
              <strong>{cartItems.length} {cartItems.length === 1 ? "ITEM" : "ITEMS"} IN YOUR BAG</strong>
              <button className={x.linkBtn} onClick={clearCart}>REMOVE ALL</button>
            </div>

            {cartItems.map((item, idx) => {
              const sv = data?.lines?.[idx];
              const blocked = sv && !sv.ok;
              // quantity options stop at real stock (server-computed), never above the per-line cap
              const lineMax = !sv ? MAX_LINE_QTY : sv.ok ? Math.min(MAX_LINE_QTY, sv.maxQty ?? MAX_LINE_QTY) : sv.available ?? 0;
              const unit = sv?.unitPrice ?? item.priceNum;
              const opts = Array.from({ length: Math.max(item.quantity, Math.min(lineMax, MAX_LINE_QTY)) }, (_, i) => i + 1);
              return (
                <article key={item.productId} className={`${x.item} ${blocked ? x.itemBad : ""}`}>
                  <Link to={item.kind === "bundle" ? `/collection/${item.slug}` : `/product/${item.slug}`} className={x.thumb}>
                    <img src={imgSrc(item.image)} alt={item.title} />
                  </Link>

                  <div className={x.info}>
                    <p className={x.cat}>{item.kind === "bundle" ? "Curated Collection" : sv?.category || ""}</p>
                    <h3 className={x.title}>
                      <Link to={item.kind === "bundle" ? `/collection/${item.slug}` : `/product/${item.slug}`}>{item.title}</Link>
                    </h3>
                    {item.variantLabel && <p className={x.variant}>{item.variantLabel}</p>}

                    {item.kind === "bundle" && sv?.components && (
                      <ul className={x.comps}>
                        {sv.components.map((c, i) => (
                          <li key={i}>{c.quantity} × {c.name}{c.variantLabel ? ` — ${c.variantLabel}` : ""}</li>
                        ))}
                      </ul>
                    )}

                    <div className={x.chips}>
                      <label className={x.qtyChip}>
                        Qty:&nbsp;
                        <select value={item.quantity} onChange={(e) => updateQuantity(item.productId, Number(e.target.value))} aria-label={`Quantity for ${item.title}`}>
                          {opts.map((n) => <option key={n} value={n} disabled={n > lineMax && n !== item.quantity}>{n}</option>)}
                        </select>
                      </label>
                    </div>

                    <p className={x.priceRow}>
                      {blocked ? <span className={x.muted}>—</span> : <strong>{inr(unit * item.quantity)}</strong>}
                      {!blocked && item.quantity > 1 && <span className={x.muted}> ({inr(unit)} each)</span>}
                    </p>

                    {blocked && (
                      <p role="alert" className={x.warn}>
                        {sv.message} Not included in your total.{" "}
                        {sv.available > 0 && (
                          <button className={x.inlineBtn} onClick={() => updateQuantity(item.productId, sv.available)}>Update to {sv.available}</button>
                        )}
                      </p>
                    )}
                    {sv?.ok && item.quantity >= lineMax && lineMax < MAX_LINE_QTY && <p className={x.note}>Maximum available quantity.</p>}
                  </div>

                  <button className={x.remove} onClick={() => removeFromCart(item.productId)} aria-label={`Remove ${item.title}`}>✕</button>
                </article>
              );
            })}

            {/* Section 8.3 — one relevant add-on, never forced */}
            {addOnProduct && (
              <div className={x.addon}>
                <img src={imgSrc(addOnProduct.image)} alt={addOnProduct.name || "Suggested add-on"} loading="lazy" width={96} height={96} />
                <div className={x.addonText}>
                  <span className={x.addonK}>Completes your ritual</span>
                  <strong>{addOnProduct.name}{addOn.variant ? ` — ${catalog.fragrances[addOn.variant]?.label}` : ""} · {inr(addOnProduct.price)}</strong>
                  <span className={x.muted}>{addOn.reason}</span>
                </div>
                {addOn.variant ? (
                  <button className={x.addBtn} onClick={() => addToCart(productLine(addOnProduct, addOn.variant, 1))}>ADD</button>
                ) : (
                  <Link to={`/product/${addOnProduct.slug}`} className={x.addBtn}>CHOOSE</Link>
                )}
              </div>
            )}

            <Link to="/products" className={x.continue}>← Continue Shopping</Link>
          </section>

          {/* ── Right: price details ── */}
          <aside className={x.right} aria-label="Price details">
            <h2 className={x.sectionH}>PRICE DETAILS ({payableCount} {payableCount === 1 ? "Item" : "Items"})</h2>
            <div className={x.row}><span>Total MRP</span><span>{loading && !data ? "…" : inr(subtotal)}</span></div>
            <div className={x.row}>
              <span>Shipping</span>
              <span className={shipping === 0 && data ? x.free : undefined}>{!data ? "…" : shipping === 0 ? "FREE" : inr(shipping)}</span>
            </div>
            <div className={`${x.row} ${x.total}`}><span>Total Amount</span><span>{loading && !data ? "…" : inr(total)}</span></div>
            <p className={x.gst}>Inclusive of applicable GST.</p>

            {data && allOk && (
              <div
                key={burst > 0 && shipping === 0 ? `u${burst}` : "badge"}
                className={`${x.ship} ${styles.savingsBadge} ${burst > 0 && shipping === 0 ? styles.unlockedPop : ""}`}
              >
                {shipping === 0 ? "Free shipping unlocked" : `Add ${inr(remaining)} more to unlock free shipping.`}
                {burst > 0 && shipping === 0 && (
                  <span className={styles.burst} aria-hidden="true">
                    {BURST.map((p, i) => (
                      <i key={i} className={styles.particle}
                        style={{ "--x": `${p.x}px`, "--y": `${p.y}px`, background: p.c, width: p.s, height: p.s, animationDelay: `${p.d}ms` }} />
                    ))}
                  </span>
                )}
              </div>
            )}

            {error && <p role="alert" className={x.alert}>{error}</p>}
            {data && !allOk && <p role="alert" className={x.alert}>Some items are unavailable. Reduce the quantity or remove them to continue — they are not included in the total above.</p>}

            <p className={x.terms}>
              By placing the order, you agree to Bhava: <Link to="/terms" className={x.termsLink}>Terms of Use</Link> and{" "}
              <Link to="/privacy-policy" className={x.termsLink}>Privacy Policy</Link>
            </p>
            <button className={x.cta} onClick={handleCheckout} disabled={!allOk || loading}>
              {loading ? "CHECKING AVAILABILITY…" : "PROCEED TO CHECKOUT"}
            </button>
            <p className={x.secure}>🔒 Secure checkout · {catalog ? shippingCopy(catalog.shipping) : ""}</p>
          </aside>
        </div>
      </div>

      {/* Myntra-style You may also like */}
      {likeShown.length > 0 && (
        <section className={x.likeSection} aria-labelledby="cart-also-like">
          <div className={x.likeWrap}>
            <h2 id="cart-also-like" className={x.likeTitle}>You may also like:</h2>

            {likeCategories.length > 2 && (
              <div className={x.likeChips} role="tablist" aria-label="Filter recommendations">
                {likeCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={likeCat === c.id}
                    className={`${x.likeChip} ${likeCat === c.id ? x.likeChipOn : ""}`}
                    onClick={() => setLikeCat(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            <div className={x.likeGrid}>
              {likeShown.map((p) => {
                const inStock = productInStock(catalog, p);
                const catLabel = catalog.categories.find((c) => c.id === p.category)?.label || "";
                const needsChoice = p.variants.length > 1 || p.mode === "single" || p.mode === "camphor" || p.mode === "pair";
                return (
                  <article key={p.slug} className={`${x.likeCard} ${inStock ? "" : x.likeCardDim}`}>
                    <Link to={`/product/${p.slug}`} className={x.likeImg} tabIndex={-1} aria-hidden="true">
                      <img src={imgSrc(p.image)} alt={p.name} loading="lazy" width={160} height={160} />
                      {!inStock && <span className={x.likeOos}>Out of stock</span>}
                    </Link>
                    <div className={x.likeBody}>
                      <Link to={`/product/${p.slug}`} className={x.likeLink}>
                        <span className={x.likeBrand}>{catLabel}</span>
                        <p className={x.likeName}>{p.name}</p>
                        {p.tagline && <p className={x.likeDesc}>{p.tagline}</p>}
                        <p className={x.likePrice}>{inr(p.price)}</p>
                      </Link>
                    </div>
                    {inStock ? (
                      <button type="button" className={x.likeAdd} onClick={(e) => quickAddLike(e, p)}>
                        {needsChoice ? "CHOOSE" : "ADD TO BAG"}
                      </button>
                    ) : (
                      <button type="button" className={`${x.likeAdd} ${x.likeAddOff}`} disabled>OUT OF STOCK</button>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
