import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import MrpTag from "../components/MrpTag";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useCartValidation from "../hooks/useCartValidation";
import useCatalog from "../hooks/useCatalog";
import {
  MAX_LINE_QTY, imgSrc, inr, suggestAddOn, suggestBraceletAddOns, getProduct, productLine, shippingCopy,
  productInStock,
} from "../shop/shopUtils";
import { playAddToCartAnimation, tweenSavingReveal, tweenTextIn, tweenTextSwap } from "../utils/cartAnimation";
import { viewCart } from "../utils/analytics";
import { loadAddressBook, syncAddressesFromServer } from "../account/addressBook";
import Seo, { siteOrigin } from "../components/Seo";
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
  "sambrani",
  "camphor",
  "sacred-beads",
];
const catRank = (id) => {
  const i = LIKE_CAT_ORDER.indexOf(id);
  return i === -1 ? 50 : i;
};

import OffersBox, { PriceRows } from "./OffersBox";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, addToCart, itemCount } = useCart();
  const { catalog } = useCatalog();
  const { loading, error, data } = useCartValidation(cartItems);

  // Free-shipping celebration: fires when cart crosses into free shipping
  const unlocked = !!data && data.allOk && data.shipping === 0;
  const [wasUnlocked, setWasUnlocked] = useState(null);
  const [burst, setBurst] = useState(0);
  const [likeCat, setLikeCat] = useState("all");
  // Delivery address strip (mobile): the logged-in user's default / selected saved address
  const [book, setBook] = useState(() => loadAddressBook());
  const deliverTo = book.list.find((a) => a.id === book.selectedId) || book.list[0] || null;

  // Sticky/desk ship copy — GSAP swaps text in place (no strip slide)
  const stickyShipTextRef = useRef(null);
  const deskShipTextRef = useRef(null);
  const savingRef = useRef(null);
  const shipSwapBusy = useRef(false);
  const shipFadeIn = useRef(false);
  const shipPending = useRef(null);
  const shipUiRef = useRef(null);
  const [shipUi, setShipUi] = useState(null); // { unlocked, remaining }
  shipUiRef.current = shipUi;

  useEffect(() => {
    if (!data) return;
    if (wasUnlocked === null) {
      setWasUnlocked(unlocked);
      return;
    }
    if (wasUnlocked !== unlocked) {
      setWasUnlocked(unlocked);
      if (!wasUnlocked && unlocked) setBurst((b) => b + 1);
    }
  }, [data, unlocked, wasUnlocked]);

  const alsoLike = useMemo(() => {
    if (!catalog?.products?.length) return [];
    const inBag = new Set(cartItems.filter((i) => i.kind === "product").map((i) => i.slug));
    const ranked = [];
    const push = (p) => {
      if (!p || inBag.has(p.slug) || ranked.some((r) => r.slug === p.slug)) return;
      ranked.push(p);
    };
    // PDF §12: SKU-level cross-sell / upsell matrix only — no generic catalog fill
    cartItems.forEach((item) => {
      const p = item.kind === "product" ? getProduct(catalog, item.slug) : null;
      (p?.related?.crossSell || []).forEach((slug) => push(getProduct(catalog, slug)));
      if (p?.related?.upsell) push(getProduct(catalog, p.related.upsell));
      if (p?.related?.upsellAlt) push(getProduct(catalog, p.related.upsellAlt));
    });
    const related = new Set(ranked.map((r) => r.slug));
    // Cross-sell matrix picks come first; then the rest of the catalogue so the row is never sparse.
    catalog.products.filter((p) => p.status !== "archived" && p.price > 0).forEach(push);
    ranked.sort((a, b) => {
      if (related.has(a.slug) !== related.has(b.slug)) return related.has(a.slug) ? -1 : 1;
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

  useEffect(() => {
    if (!localStorage.getItem("bhava_token")) return undefined;
    let cancelled = false;
    syncAddressesFromServer().then((b) => { if (!cancelled) setBook(b); });
    return () => { cancelled = true; };
  }, []);

  // Tells global CSS the mobile sticky checkout bar is on screen (lifts the chat button, pads the page end)
  const hasBag = cartItems.length > 0;
  useEffect(() => {
    if (!hasBag) return undefined;
    document.body.dataset.cartBar = "1";
    return () => { delete document.body.dataset.cartBar; };
  }, [hasBag]);

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

  // GSAP: swap free-shipping copy in place (fade/slide), keep the tab fixed
  useEffect(() => {
    if (!data?.allOk) return undefined;
    const freeAbove = Number(data?.shippingRule?.freeAbove || catalog?.shipping?.freeAbove) || 501;
    const next = {
      unlocked: data.shipping === 0,
      remaining: freeAbove - (data.subtotal ?? 0),
    };
    const cur = shipUiRef.current;
    if (!cur) {
      setShipUi(next);
      return undefined;
    }
    // Unlocked copy is static — only re-tween when lock state flips or remaining amount changes
    const same =
      cur.unlocked === next.unlocked &&
      (next.unlocked || cur.remaining === next.remaining);
    if (same) return undefined;
    if (shipSwapBusy.current) {
      shipPending.current = next;
      return undefined;
    }

    let cancelled = false;
    shipSwapBusy.current = true;
    shipPending.current = null;
    tweenTextSwap(
      [stickyShipTextRef.current, deskShipTextRef.current],
      () => {
        if (cancelled) {
          shipSwapBusy.current = false;
          return;
        }
        shipFadeIn.current = true;
        setShipUi(next);
      }
    ).catch(() => {
      if (!cancelled) {
        setShipUi(next);
        shipSwapBusy.current = false;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [data, catalog]);

  useLayoutEffect(() => {
    if (!shipFadeIn.current || !shipUi) return;
    shipFadeIn.current = false;
    tweenTextIn([stickyShipTextRef.current, deskShipTextRef.current]).finally(() => {
      shipSwapBusy.current = false;
      const pending = shipPending.current;
      if (!pending) return;
      shipPending.current = null;
      const cur = shipUiRef.current;
      if (
        cur &&
        cur.unlocked === pending.unlocked &&
        (pending.unlocked || cur.remaining === pending.remaining)
      ) return;
      shipSwapBusy.current = true;
      tweenTextSwap(
        [stickyShipTextRef.current, deskShipTextRef.current],
        () => {
          shipFadeIn.current = true;
          setShipUi(pending);
        }
      ).catch(() => {
        setShipUi(pending);
        shipSwapBusy.current = false;
      });
    });
  }, [shipUi]);

  // "You're saving ₹X…" — GSAP text pop when free shipping is on
  useLayoutEffect(() => {
    if (!unlocked || !savingRef.current) return;
    tweenSavingReveal(savingRef.current);
  }, [unlocked, burst]);

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
          <div className={styles.emptyActions}>
            <button type="button" className={styles.continuBtn} onClick={() => navigate("/products")}>
              Browse the Shop
            </button>
            <button
              type="button"
              className={styles.emptyBackBtn}
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate("/");
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shipRule = data?.shippingRule || catalog?.shipping || { fee: 50, freeAbove: 501 };
  const subtotal = data?.subtotal ?? 0;
  const shipping = typeof data?.shipping === "number" ? data.shipping : 0;
  const total = data?.total ?? 0;
  const allOk = !!data?.allOk;
  const freeAbove = Number(shipRule.freeAbove) || 501;
  const remaining = freeAbove - subtotal;
  const shipProgress = Math.min(100, Math.max(0, (subtotal / freeAbove) * 100));
  // Count only items that are actually included in the total (unavailable lines are excluded)
  const payableCount = data ? data.lines.reduce((n, l) => n + (l.ok ? l.quantity : 0), 0) : itemCount;
  const braceletAddOns = catalog ? suggestBraceletAddOns(catalog, cartItems) : [];
  const addOn = catalog && !braceletAddOns.length ? suggestAddOn(catalog, cartItems) : null;
  const addOnProduct = addOn && getProduct(catalog, addOn.slug);
  const fragLabel = (key) => (key && catalog?.fragrances?.[key]?.label) || "";
  const renderAddOn = (rec) => {
    const p = getProduct(catalog, rec.slug);
    if (!p) return null;
    const label = fragLabel(rec.variant);
    return (
      <div key={rec.slug} className={x.addon}>
        <img src={imgSrc(p.image)} alt={p.name || "Suggested add-on"} loading="lazy" width={96} height={96} />
        <div className={x.addonText}>
          <span className={x.addonK}>Completes your ritual</span>
          <strong>
            {p.name}
            {label ? ` — ${label}` : ""}
            {" · "}
            {inr(p.price)}
          </strong>
          <span className={x.muted}>{rec.reason}</span>
        </div>
        {rec.variant ? (
          <button type="button" className={x.addBtn} onClick={() => addToCart(productLine(p, rec.variant, 1))}>ADD</button>
        ) : (
          <Link to={`/product/${p.slug}`} className={x.addBtn}>CHOOSE</Link>
        )}
      </div>
    );
  };
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

  const deliverBlock = (mode) => {
    if (!deliverTo?.line1) return null;
    return (
      <div className={`${x.deliverBar} ${mode === "mob" ? x.deliverMob : x.deliverDesk}`}>
        <div className={x.deliverText}>
          <p className={x.deliverTop}>
            Deliver to: <strong>{[deliverTo.fullName, deliverTo.pincode].filter(Boolean).join(", ")}</strong>
          </p>
          <p className={x.deliverAddr}>
            {[deliverTo.line1, deliverTo.line2, deliverTo.city, deliverTo.state].filter(Boolean).join(", ")}
          </p>
        </div>
        <button type="button" className={x.deliverChange} onClick={() => navigate("/checkout")}>
          <span className={x.deliverChangeDesk}>CHANGE ADDRESS</span>
          <span className={x.deliverChangeMob}>Change</span>
        </button>
      </div>
    );
  };

  return (
    <div className={x.page}>
      <Seo
        title="Your Sacred Cart | Bhava:"
        description="Review your selected sacred incense, beads, and ritual items before checkout."
        canonical={`${siteOrigin()}/cart`}
      />
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

      {/* Mobile: flush white strip under steps (no cream gap) */}
      {deliverBlock("mob")}

      <div className={x.wrap}>
        <div className={x.layout}>
          {/* ── Left: items ── */}
          <section className={x.left} aria-label="Items in your bag">
            {/* Desktop: Myntra card in the bag column */}
            {deliverBlock("desk")}

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
              return (
                <article key={item.productId} className={`${x.item} ${blocked ? x.itemBad : ""}`}>
                  <Link to={item.kind === "bundle" ? `/collection/${item.slug}` : `/product/${item.slug}`} className={x.thumb}>
                    <img loading="lazy" decoding="async" src={imgSrc(item.image)} alt={item.title} />
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
                      <div className={x.qtyStepper} role="group" aria-label={`Quantity for ${item.title}`}>
                        <button
                          type="button"
                          className={x.qtyBtn}
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={x.qtyValue} aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          className={x.qtyBtn}
                          disabled={item.quantity >= lineMax}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className={x.priceRow}>
                      {blocked ? <span className={x.muted}>—</span> : <strong>{inr(unit * item.quantity)}</strong>}
                      {!blocked && <MrpTag mrp={(sv?.unitMrp ?? 0) * item.quantity} price={unit * item.quantity} />}
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
                    {sv?.ok && item.quantity >= lineMax && lineMax < MAX_LINE_QTY && <p className={x.note}>Only {lineMax} in stock.</p>}
                  </div>

                  <button className={x.remove} onClick={() => removeFromCart(item.productId)} aria-label={`Remove ${item.title}`}>✕</button>
                </article>
              );
            })}

            {/* Section 8.3 — bracelet cart: trade-up + cross-category + ritual; else one add-on */}
            {braceletAddOns.length > 0 ? (
              <div className={x.addonStack} aria-label="Basket-building recommendations">
                {braceletAddOns.map(renderAddOn)}
              </div>
            ) : (
              addOnProduct && renderAddOn(addOn)
            )}

            <Link to="/products" className={x.continue}>← Continue Shopping</Link>
          </section>

          {/* ── Right: price details ── */}
          <aside className={x.right} id="cart-price-details" aria-label="Price details">
            <OffersBox priced={data} donation={catalog?.donation} />
            <h2 className={x.sectionH}>PRICE DETAILS ({payableCount} {payableCount === 1 ? "Item" : "Items"})</h2>
            <PriceRows priced={data} loading={loading} shipping={shipping} />
            <p className={x.gst}>Inclusive of applicable GST.</p>

            {data && allOk && shipUi && (
              <div className={`${x.ship} ${x.shipDesk}`}>
                <span className={x.shipText} ref={deskShipTextRef}>
                  {shipUi.unlocked ? (
                    <>🎉 <strong className={x.shipAmt}>Free shipping unlocked</strong></>
                  ) : (
                    <>Add <strong className={x.shipAmt}>{inr(shipUi.remaining)}</strong> more to unlock <strong>free shipping</strong></>
                  )}
                </span>
                <div className={x.shipBar}>
                  <div
                    className={x.shipTrack}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(shipProgress)}
                    aria-label="Free shipping progress"
                  >
                    <span className={x.shipFill} style={{ width: `${shipProgress}%` }} />
                  </div>
                  <span
                    className={x.shipMarker}
                    style={{ left: `${shipProgress}%`, transform: `translateX(-${shipProgress}%)` }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      {shipping === 0 ? (
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      ) : (
                        <>
                          <path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8z" />
                          <circle cx="7" cy="18" r="1.8" />
                          <circle cx="17" cy="18" r="1.8" />
                        </>
                      )}
                    </svg>
                  </span>
                </div>
                {burst > 0 && shipping === 0 && (
                  <span key={`desk-burst-${burst}`} className={styles.burst} aria-hidden="true">
                    {BURST.map((p, i) => (
                      <i
                        key={i}
                        className={styles.particle}
                        style={{
                          "--x": `${p.x}px`,
                          "--y": `${p.y}px`,
                          background: p.c,
                          width: p.s,
                          height: p.s,
                          animationDelay: `${p.d}ms`,
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
            )}

            {data && allOk && shipping === 0 && shipRule.fee > 0 && (
              <p className={x.saving} ref={savingRef}>
                You&apos;re saving <strong>{inr(shipRule.fee)}</strong> on delivery on this order
              </p>
            )}

            {error && <p role="alert" className={x.alert}>{error}</p>}
            {data && !allOk && <p role="alert" className={x.alert}>Some items are unavailable. Reduce the quantity or remove them to continue — they are not included in the total above.</p>}

            <p className={x.terms}>
              By placing the order, you agree to Bhava: <Link to="/terms" className={x.termsLink}>Terms and Conditions</Link> and{" "}
              <Link to="/privacy-policy" className={x.termsLink}>Privacy Policy</Link>
            </p>
            <button className={`${x.cta} ${x.ctaDesk}`} onClick={handleCheckout} disabled={!allOk || loading}>
              {loading ? "CHECKING AVAILABILITY…" : "PROCEED TO CHECKOUT"}
            </button>
            <p className={x.secure}>🔒 Secure checkout · {catalog ? shippingCopy(catalog.shipping) : ""}</p>
          </aside>
        </div>
      </div>

      {/* Mobile sticky checkout bar: free-shipping line, then total + checkout button */}
      <div className={x.stickyBar} role="region" aria-label="Checkout">
        {data && allOk && shipUi && (
          <div className={x.stickyShip}>
            <span className={x.shipText} ref={stickyShipTextRef}>
              {shipUi.unlocked ? (
                <>🎉 <strong className={x.shipAmt}>Free shipping unlocked</strong></>
              ) : (
                <>Add <strong className={x.shipAmt}>{inr(shipUi.remaining)}</strong> more to unlock <strong>free shipping</strong></>
              )}
            </span>
            <div className={x.shipBar}>
              <div
                className={x.shipTrack}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(shipProgress)}
                aria-label="Free shipping progress"
              >
                <span className={x.shipFill} style={{ width: `${shipProgress}%` }} />
              </div>
              <span className={x.shipMarker} style={{ left: `${shipProgress}%`, transform: `translateX(-${shipProgress}%)` }} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  {shipping === 0 ? (
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  ) : (
                    <>
                      <path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8z" />
                      <circle cx="7" cy="18" r="1.8" />
                      <circle cx="17" cy="18" r="1.8" />
                    </>
                  )}
                </svg>
              </span>
            </div>
            {burst > 0 && shipping === 0 && (
              <span key={`burst-${burst}`} className={styles.burst} aria-hidden="true">
                {BURST.map((p, i) => (
                  <i
                    key={i}
                    className={styles.particle}
                    style={{
                      "--x": `${p.x}px`,
                      "--y": `${p.y}px`,
                      background: p.c,
                      width: p.s,
                      height: p.s,
                      animationDelay: `${p.d}ms`,
                    }}
                  />
                ))}
              </span>
            )}
          </div>
        )}
        <div className={x.stickyRow}>
          <a
            href="#cart-price-details"
            className={x.stickyTotal}
            onClick={(e) => { e.preventDefault(); document.getElementById("cart-price-details")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
          >
            <strong>{loading && !data ? "…" : inr(total)}</strong>
            <span>View price details</span>
          </a>
          <button type="button" className={x.stickyCta} onClick={handleCheckout} disabled={!allOk || loading}>
            {loading ? "Checking…" : "Proceed to checkout"}
          </button>
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
