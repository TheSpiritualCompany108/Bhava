import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useCartValidation from "../hooks/useCartValidation";
import { imgSrc } from "../shop/shopUtils";
import { beginCheckout, purchaseOnce } from "../utils/analytics";
import styles from "./CheckoutPage.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart, itemCount } = useCart();
  const { loading: pricing, data: priced, error: priceError } = useCartValidation(cartItems);

  const token = localStorage.getItem("bhava_token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("bhava_user") || "null");
  } catch {
    user = null;
  }

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null); // { orderId, total }

  // Must be signed in to check out
  useEffect(() => {
    if (!token) navigate("/auth", { state: { from: "/checkout" }, replace: true });
  }, [token, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    if (priced?.allOk) beginCheckout(cartItems, priced.total);
  }, [priced?.allOk, priced?.total, cartItems]);

  // Server-priced totals only (no client-side discounts or shipping maths)
  const subtotal = priced?.subtotal ?? 0;
  const shipping = typeof priced?.shipping === "number" ? priced.shipping : 0;
  const total = priced?.total ?? 0;
  const cartOk = !!priced?.allOk;
  const payableCount = priced ? priced.lines.reduce((n, l) => n + (l.ok ? l.quantity : 0), 0) : itemCount;

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
    setSubmitError("");
  };

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10)) || form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Enter a valid 10-digit mobile number";
    if (form.line1.trim().length < 5) e.line1 = "Enter your house / street address";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!form.state) e.state = "Select your state";
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async (ev) => {
    ev.preventDefault();
    if (!cartOk) {
      setSubmitError("Please review your cart — some items need your attention before you can order.");
      return;
    }
    if (!validate()) {
      const first = document.querySelector("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPlacing(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_BASE}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ kind: i.kind, slug: i.slug, variant: i.variant, selection: i.selection, quantity: i.quantity })),
          address: {
            fullName: form.fullName,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          notes: form.notes,
          paymentMethod: "cod",
        }),
      });
      const json = await res.json();
      if (res.status === 401) {
        localStorage.removeItem("bhava_token");
        navigate("/auth", { state: { from: "/checkout" } });
        return;
      }
      if (!res.ok || !json.success) {
        setSubmitError(json.message || "Could not place your order. Please try again.");
        if (res.status === 409) setErrors({});
      } else {
        purchaseOnce(json.orderId, { value: json.total, shipping: json.shipping, items: json.items || [] });
        setPlaced({ orderId: json.orderId, total: json.total });
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setSubmitError("Unable to connect. Please check your internet and try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (!token) return null;

  // ── Success ──
  if (placed) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Thank you, your order is placed!</h1>
          <p className={styles.successText}>
            Your sacred offerings are being prepared with care. We will contact you on <strong>{form.phone}</strong> to confirm
            delivery.
          </p>
          <div className={styles.successCard}>
            <div><span>Order ID</span><strong>#{String(placed.orderId).slice(-8).toUpperCase()}</strong></div>
            <div><span>Amount to pay</span><strong>{inr(placed.total)}</strong></div>
            <div><span>Payment</span><strong>Cash on Delivery</strong></div>
            <div><span>Delivering to</span><strong>{form.city}, {form.state} – {form.pincode}</strong></div>
          </div>
          <div className={styles.successActions}>
            <button className={styles.primaryBtn} onClick={() => navigate("/account/orders")}>View My Orders</button>
            <button className={styles.ghostBtn} onClick={() => navigate("/products")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ──
  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <h1 className={styles.successTitle}>Your cart is empty</h1>
          <p className={styles.successText}>Add a few sacred offerings to your cart to checkout.</p>
          <div className={styles.successActions}>
            <button className={styles.primaryBtn} onClick={() => navigate("/products")}>Browse the Shop</button>
          </div>
        </div>
      </div>
    );
  }

  const field = (name) => ({
    name,
    value: form[name],
    onChange: set,
    className: `${styles.input} ${errors[name] ? styles.inputError : ""}`,
    "data-error": errors[name] ? "true" : undefined,
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/cart" className={styles.back}>← Back to Cart</Link>
          <h1 className={styles.title}>Checkout</h1>
          <div className={styles.steps}>
            <span className={styles.stepDone}>1 · Cart</span>
            <span className={styles.stepLine} />
            <span className={styles.stepActive}>2 · Details</span>
            <span className={styles.stepLine} />
            <span className={styles.step}>3 · Confirmation</span>
          </div>
        </div>

        <form className={styles.layout} onSubmit={placeOrder} noValidate>
          {/* ── Left: details ── */}
          <div className={styles.left}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><span>1</span> Contact &amp; Delivery</h2>
              <p className={styles.signedIn}>Signed in as <strong>{user?.email || user?.name}</strong></p>

              <div className={styles.grid2}>
                <div className={styles.group}>
                  <label>Full Name</label>
                  <input {...field("fullName")} autoComplete="name" placeholder="As on delivery" />
                  {errors.fullName && <em>{errors.fullName}</em>}
                </div>
                <div className={styles.group}>
                  <label>Mobile Number</label>
                  <div className={styles.phoneWrap}>
                    <span>+91</span>
                    <input {...field("phone")} inputMode="numeric" autoComplete="tel" maxLength={14} placeholder="10-digit number" />
                  </div>
                  {errors.phone && <em>{errors.phone}</em>}
                </div>
              </div>

              <div className={styles.group}>
                <label>Address</label>
                <input {...field("line1")} autoComplete="address-line1" placeholder="House no., building, street" />
                {errors.line1 && <em>{errors.line1}</em>}
              </div>
              <div className={styles.group}>
                <label>Landmark / Area <span>(optional)</span></label>
                <input {...field("line2")} autoComplete="address-line2" placeholder="Near temple, colony, locality" />
              </div>

              <div className={styles.grid3}>
                <div className={styles.group}>
                  <label>City</label>
                  <input {...field("city")} autoComplete="address-level2" />
                  {errors.city && <em>{errors.city}</em>}
                </div>
                <div className={styles.group}>
                  <label>State</label>
                  <select {...field("state")} autoComplete="address-level1">
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <em>{errors.state}</em>}
                </div>
                <div className={styles.group}>
                  <label>Pincode</label>
                  <input {...field("pincode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="6 digits" />
                  {errors.pincode && <em>{errors.pincode}</em>}
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}><span>2</span> Payment Method</h2>
              <label className={`${styles.payOption} ${styles.payActive}`}>
                <input type="radio" checked readOnly />
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay in cash when your order arrives at your doorstep.</p>
                </div>
              </label>
              <label className={`${styles.payOption} ${styles.payDisabled}`}>
                <input type="radio" disabled />
                <div>
                  <strong>UPI / Cards / Net Banking <em className={styles.soon}>Coming soon</em></strong>
                  <p>Secure online payments will be available shortly.</p>
                </div>
              </label>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}><span>3</span> Order Notes <small>(optional)</small></h2>
              <textarea
                name="notes"
                value={form.notes}
                onChange={set}
                maxLength={500}
                rows={3}
                className={styles.input}
                placeholder="Any special instructions for delivery or packaging…"
              />
            </section>
          </div>

          {/* ── Right: summary ── */}
          <aside className={styles.summary}>
            <span className={styles.summaryKicker}>Your Offering</span>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <ul className={styles.items}>
              {cartItems.map((i, idx) => {
                const sv = priced?.lines?.[idx];
                const unit = sv?.unitPrice ?? i.priceNum ?? 0;
                return (
                  <li key={i.productId}>
                    <div className={styles.thumb}>
                      <img src={imgSrc(i.image)} alt={i.title} />
                      <b>{i.quantity}</b>
                    </div>
                    <div className={styles.itemMeta}>
                      <span>{i.title}</span>
                      <small>{[i.variantLabel, `${inr(unit)} each`].filter(Boolean).join(" · ")}</small>
                      {sv && !sv.ok && <small style={{ color: "#a2331f" }}>{sv.message}</small>}
                    </div>
                    <strong>{sv && !sv.ok ? "—" : inr(unit * i.quantity)}</strong>
                  </li>
                );
              })}
            </ul>

            <div className={styles.row}><span>Items ({payableCount})</span><span>{priced ? inr(subtotal) : "…"}</span></div>
            <div className={styles.row}><span>Shipping</span>{priced ? (shipping === 0 ? <span className={styles.free}>FREE</span> : <span>{inr(shipping)}</span>) : <span>…</span>}</div>
            <div className={styles.divider} />
            <div className={`${styles.row} ${styles.totalRow}`}><span>Total</span><span>{priced ? inr(total) : "…"}</span></div>
            <p className={styles.codNote}>Pay {priced ? inr(total) : "…"} on delivery · inclusive of applicable GST</p>

            {(submitError || priceError) && <p className={styles.submitError}>{submitError || priceError}</p>}
            {priced && !cartOk && (
              <p className={styles.submitError}>Some items are unavailable. <Link to="/cart">Review your cart</Link></p>
            )}

            <button type="submit" className={styles.placeBtn} disabled={placing || pricing || !cartOk}>
              {placing ? "Placing your order…" : pricing ? "Checking availability…" : "Place Order"}
            </button>
            <p className={styles.secure}>🔒 Your details are safe</p>
          </aside>
        </form>
      </div>
    </div>
  );
}
