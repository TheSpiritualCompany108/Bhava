import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useCartValidation from "../hooks/useCartValidation";
import { imgSrc } from "../shop/shopUtils";
import { beginCheckout, purchaseOnce } from "../utils/analytics";
import {
  blankAddress,
  COUNTRY_CODES,
  loadAddressBook,
  persistBook,
  pushAddressesToServer,
  syncAddressesFromServer,
} from "../account/addressBook";
import styles from "./CheckoutPage.module.css";
import x from "./CartLayout.module.css";

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

  const initialBook = loadAddressBook();
  const [addresses, setAddresses] = useState(initialBook.list);
  const [selectedId, setSelectedId] = useState(initialBook.selectedId);
  const [addrView, setAddrView] = useState(initialBook.list.length ? "saved" : "form"); // saved | list | form
  const [editingId, setEditingId] = useState(null); // null = new
  const [form, setForm] = useState(() => {
    const sel = initialBook.list.find((a) => a.id === initialBook.selectedId);
    return { ...(sel || blankAddress(user?.name || "")), notes: "" };
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [step, setStep] = useState("address"); // address → payment
  const [ccOpen, setCcOpen] = useState(false);
  const ccRef = useRef(null);

  useEffect(() => {
    if (!ccOpen) return undefined;
    const onDoc = (e) => {
      if (ccRef.current && !ccRef.current.contains(e.target)) setCcOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setCcOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [ccOpen]);

  const selected = addresses.find((a) => a.id === selectedId) || addresses[0] || null;

  useEffect(() => {
    if (!token) navigate("/auth", { state: { from: "/checkout" }, replace: true });
  }, [token, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const book = await syncAddressesFromServer();
      if (cancelled) return;
      // Only this account's addresses — empty book means show the add form
      setAddresses(book.list);
      setSelectedId(book.selectedId || "");
      if (!book.list.length) {
        setAddrView("form");
        setForm((f) => ({ ...blankAddress(user?.name || ""), notes: f.notes || "" }));
        return;
      }
      setAddrView("saved");
      const sel = book.list.find((a) => a.id === book.selectedId) || book.list[0];
      if (sel) setForm((f) => ({ ...sel, notes: f.notes || "" }));
    })();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (priced?.allOk) beginCheckout(cartItems, priced.total);
  }, [priced?.allOk, priced?.total, cartItems]);

  const subtotal = priced?.subtotal ?? 0;
  const shipping = typeof priced?.shipping === "number" ? priced.shipping : 0;
  const total = priced?.total ?? 0;
  const cartOk = !!priced?.allOk;
  const payableCount = priced ? priced.lines.reduce((n, l) => n + (l.ok ? l.quantity : 0), 0) : itemCount;

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((er) => ({ ...er, [name]: "" }));
    setSubmitError("");
  };

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = "Enter your full name";
    {
      const digits = form.phone.replace(/\D/g, "");
      const cc = form.countryCode || "+91";
      if (cc === "+91") {
        if (!/^[6-9]\d{9}$/.test(digits.slice(-10)) || digits.length < 10) {
          e.phone = "Enter a valid 10-digit Indian mobile number";
        }
      } else if (digits.length < 7 || digits.length > 15) {
        e.phone = "Enter a valid mobile number";
      }
    }
    if (form.line1.trim().length < 5) e.line1 = "Enter your house / street address";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!form.state) e.state = "Select your state";
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAddAddress = () => {
    setEditingId(null);
    setForm({ ...blankAddress(user?.name || ""), makeDefault: addresses.length === 0, notes: form.notes || "" });
    setErrors({});
    setAddrView("form");
  };

  const openChangeAddress = () => {
    if (addresses.length > 1) {
      setAddrView("list");
      return;
    }
    if (selected) {
      setEditingId(selected.id);
      setForm({ ...selected, notes: form.notes || "" });
      setErrors({});
      setAddrView("form");
    } else {
      openAddAddress();
    }
  };

  const openEditAddress = (addr) => {
    setEditingId(addr.id);
    setForm({ ...addr, notes: form.notes || "" });
    setErrors({});
    setAddrView("form");
  };

  const pickAddress = (id) => {
    setSelectedId(id);
    persistBook(addresses, id);
    setAddrView("saved");
  };

  const commitAddress = () => {
    if (!validate()) {
      const first = document.querySelector("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }
    const id = editingId || `addr_${Date.now()}`;
    const digits = form.phone.replace(/\D/g, "");
    const countryCode = form.countryCode || "+91";
    const entry = {
      id,
      fullName: form.fullName.trim(),
      countryCode,
      phone: countryCode === "+91" ? digits.slice(-10) : digits,
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      addressType: form.addressType,
      makeDefault: !!form.makeDefault,
    };
    let next = editingId
      ? addresses.map((a) => (a.id === editingId ? entry : a))
      : [...addresses, entry];
    if (entry.makeDefault) {
      next = next.map((a) => ({ ...a, makeDefault: a.id === id }));
    }
    setAddresses(next);
    setSelectedId(id);
    persistBook(next, id);
    pushAddressesToServer(next);
    setAddrView("saved");
    return entry;
  };

  const saveAddress = (ev) => {
    ev.preventDefault();
    if (commitAddress()) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => {
    if (addresses.length) {
      setAddrView("saved");
      setErrors({});
      return;
    }
    navigate("/cart");
  };

  const goToPayment = (ev) => {
    ev.preventDefault();
    if (!cartOk) {
      setSubmitError("Please review your cart — some items need your attention before you can order.");
      return;
    }
    if (addrView === "form") {
      if (!commitAddress()) return;
    } else if (!selected) {
      setSubmitError("Please add a delivery address to continue.");
      setAddrView("form");
      return;
    }
    setSubmitError("");
    setStep("payment");
    setAddrView("saved");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deliveryAddress = selected || {
    fullName: form.fullName,
    countryCode: form.countryCode || "+91",
    phone: form.phone,
    line1: form.line1,
    line2: form.line2,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    addressType: form.addressType,
  };

  const formatPhone = (addr) => {
    const cc = addr?.countryCode || "+91";
    const num = String(addr?.phone || "").replace(/\D/g, "");
    return num ? `${cc} ${num}` : cc;
  };

  const placeOrder = async (ev) => {
    ev.preventDefault();
    if (step !== "payment") {
      goToPayment(ev);
      return;
    }
    if (!cartOk) {
      setSubmitError("Please review your cart — some items need your attention before you can order.");
      return;
    }
    if (!deliveryAddress?.line1) {
      setStep("address");
      setAddrView(addresses.length ? "saved" : "form");
      setSubmitError("Please add a delivery address to continue.");
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
            fullName: deliveryAddress.fullName,
            countryCode: deliveryAddress.countryCode || "+91",
            phone: deliveryAddress.phone,
            line1: deliveryAddress.line1,
            line2: deliveryAddress.line2,
            city: deliveryAddress.city,
            state: deliveryAddress.state,
            pincode: deliveryAddress.pincode,
            addressType: deliveryAddress.addressType,
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
        setPlaced({
          orderId: json.orderId,
          total: json.total,
          phone: formatPhone(deliveryAddress),
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          pincode: deliveryAddress.pincode,
        });
        pushAddressesToServer(addresses);
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

  if (placed) {
    const orderCode = String(placed.orderId).slice(-8).toUpperCase();
    const copyOrderId = async () => {
      try {
        await navigator.clipboard.writeText(orderCode);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 1800);
      } catch {
        /* ignore */
      }
    };
    const CONFETTI = [
      { x: -48, y: -56, c: "#E07B39", d: 0, s: 8 },
      { x: 42, y: -62, c: "#F3C56B", d: 40, s: 6 },
      { x: -62, y: -18, c: "#4A0B1D", d: 80, s: 7 },
      { x: 58, y: -22, c: "#E07B39", d: 60, s: 5 },
      { x: -28, y: 48, c: "#FFD9B3", d: 100, s: 8 },
      { x: 34, y: 52, c: "#C0671E", d: 120, s: 6 },
      { x: 0, y: -70, c: "#E07B39", d: 20, s: 5 },
      { x: -70, y: 20, c: "#F3C56B", d: 90, s: 7 },
      { x: 68, y: 16, c: "#FFD9B3", d: 110, s: 6 },
      { x: 12, y: 64, c: "#4A0B1D", d: 140, s: 5 },
    ];
    return (
      <div className={styles.successPage}>
        <nav className={x.stepsBar} aria-label="Checkout steps">
          <ol className={x.steps}>
            <li className={x.stepOn}>Bag</li>
            <li className={x.dash} aria-hidden="true" />
            <li className={x.stepOn}>Address</li>
            <li className={x.dash} aria-hidden="true" />
            <li className={x.stepOn} aria-current="step">Payment</li>
          </ol>
        </nav>

        <div className={styles.successWrap}>
          <div className={styles.success} role="status" aria-live="polite">
            <div className={styles.successHero}>
              <div className={styles.successIconWrap}>
                <div className={styles.successIcon} aria-hidden="true">
                  <svg viewBox="0 0 52 52" width="36" height="36">
                    <circle className={styles.checkRing} cx="26" cy="26" r="24" fill="none" strokeWidth="2.5" />
                    <path className={styles.checkMarkPath} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" />
                  </svg>
                </div>
                <span className={styles.successBurst} aria-hidden="true">
                  {CONFETTI.map((p, i) => (
                    <i
                      key={i}
                      className={styles.successParticle}
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
              </div>
              <p className={styles.successKicker}>Order confirmed</p>
              <h1 className={styles.successTitle}>Thank you — your order is placed</h1>
              <p className={styles.successText}>
                Your sacred offerings are being prepared with care. We&apos;ll call{" "}
                <strong>{placed.phone}</strong> to confirm delivery.
              </p>
            </div>

            <div className={styles.successCard}>
              <div className={styles.successRow}>
                <span>Order ID</span>
                <strong className={styles.orderIdValue}>
                  #{orderCode}
                  <button type="button" className={styles.copyBtn} onClick={copyOrderId}>
                    {copiedId ? "Copied" : "Copy"}
                  </button>
                </strong>
              </div>
              <div className={styles.successRow}>
                <span>Amount to pay</span>
                <strong className={styles.payAmount}>{inr(placed.total)}</strong>
              </div>
              <div className={styles.successRow}>
                <span>Payment</span>
                <strong>Cash on Delivery</strong>
              </div>
              <div className={styles.successRow}>
                <span>Delivering to</span>
                <strong>{placed.city}, {placed.state} – {placed.pincode}</strong>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <p className={styles.nextTitle}>What happens next</p>
              <ol className={styles.nextList}>
                <li className={styles.nextDone}><span>1</span> Order received</li>
                <li><span>2</span> We confirm on your phone</li>
                <li><span>3</span> Packed &amp; shipped with care</li>
              </ol>
            </div>

            <div className={styles.successActions}>
              <button type="button" className={styles.primaryBtn} onClick={() => navigate("/account/orders")}>
                View My Orders
              </button>
              <button type="button" className={styles.ghostBtn} onClick={() => navigate("/products")}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={x.page}>
        <div className={styles.success}>
          <h1 className={styles.successTitle}>Your cart is empty</h1>
          <p className={styles.successText}>Add a few sacred offerings to your cart to checkout.</p>
          <div className={styles.successActions}>
            <button type="button" className={styles.primaryBtn} onClick={() => navigate("/products")}>Browse the Shop</button>
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
    <div className={x.page}>
      <nav className={x.stepsBar} aria-label="Checkout steps">
        <ol className={x.steps}>
          <li>
            <Link to="/cart" className={styles.stepLink}>Bag</Link>
          </li>
          <li className={x.dash} aria-hidden="true" />
          <li className={step === "address" ? x.stepOn : undefined} aria-current={step === "address" ? "step" : undefined}>
            {step === "payment" ? (
              <button type="button" className={styles.stepBtn} onClick={() => setStep("address")}>Address</button>
            ) : (
              "Address"
            )}
          </li>
          <li className={x.dash} aria-hidden="true" />
          <li className={step === "payment" ? x.stepOn : undefined} aria-current={step === "payment" ? "step" : undefined}>
            Payment
          </li>
        </ol>
      </nav>

      <div className={x.wrap}>
        <form className={x.layout} onSubmit={placeOrder} noValidate>
          <div className={x.left}>
            {step === "address" ? (
              <>
                <div className={styles.sectionBar}>
                  <strong>DELIVERY DETAILS</strong>
                  <p className={styles.signedIn}>Signed in as {user?.email || user?.name}</p>
                </div>

                {addrView === "saved" && selected && (
                  <>
                    <section className={styles.deliverCard} aria-label="Selected delivery address">
                      <div className={styles.deliverTop}>
                        <div>
                          <p className={styles.deliverTo}>
                            Deliver to: <strong>{selected.fullName}, {selected.pincode}</strong>
                          </p>
                          <p className={styles.deliverLine}>
                            {[selected.line1, selected.line2, selected.city, selected.state].filter(Boolean).join(", ")}
                          </p>
                          <p className={styles.deliverMeta}>
                            {formatPhone(selected)} · {selected.addressType}
                            {selected.makeDefault ? " · Default" : ""}
                          </p>
                        </div>
                        <button type="button" className={styles.changeAddrBtn} onClick={openChangeAddress}>
                          CHANGE ADDRESS
                        </button>
                      </div>
                    </section>
                    <button type="button" className={styles.addAddrBtn} onClick={openAddAddress}>
                      + Add Address
                    </button>
                  </>
                )}

                {addrView === "list" && (
                  <section className={styles.card}>
                    <div className={styles.listHead}>
                      <h2 className={styles.cardTitle}>Select Address</h2>
                      <button type="button" className={styles.addAddrBtnInline} onClick={openAddAddress}>
                        + Add Address
                      </button>
                    </div>
                    <ul className={styles.addrList}>
                      {addresses.map((a) => (
                        <li key={a.id}>
                          <label className={`${styles.addrPick} ${a.id === selectedId ? styles.addrPickOn : ""}`}>
                            <input
                              type="radio"
                              name="pickAddress"
                              checked={a.id === selectedId}
                              onChange={() => pickAddress(a.id)}
                            />
                            <span>
                              <strong>{a.fullName}</strong>
                              {a.makeDefault && <em className={styles.defaultTag}>Default</em>}
                              <small>{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ")}</small>
                              <small>{formatPhone(a)} · {a.addressType}</small>
                            </span>
                          </label>
                          <button type="button" className={styles.editMini} onClick={() => openEditAddress(a)}>
                            Edit
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className={styles.cancelBtn} onClick={() => setAddrView("saved")}>
                      Done
                    </button>
                  </section>
                )}

                {addrView === "form" && (
                  <section className={styles.card}>
                    <h2 className={styles.cardTitle}>{editingId ? "Edit Address" : "Add Address"}</h2>

                    <div className={styles.grid2}>
                      <div className={styles.group}>
                        <label htmlFor="fullName">Full Name</label>
                        <input id="fullName" {...field("fullName")} autoComplete="name" placeholder="As on delivery" />
                        {errors.fullName && <em>{errors.fullName}</em>}
                      </div>
                      <div className={styles.group}>
                        <label htmlFor="phone">Mobile Number</label>
                        <div className={styles.phoneWrap}>
                          <div className={styles.ccPicker} ref={ccRef}>
                            <button
                              type="button"
                              id="countryCode"
                              className={styles.countryCode}
                              aria-label="Country code"
                              aria-haspopup="listbox"
                              aria-expanded={ccOpen}
                              onClick={() => setCcOpen((o) => !o)}
                            >
                              <span>{form.countryCode || "+91"}</span>
                            </button>
                            {ccOpen && (
                              <ul className={styles.ccMenu} role="listbox" aria-label="Country codes">
                                {COUNTRY_CODES.map((c) => (
                                  <li key={c.code} role="option" aria-selected={(form.countryCode || "+91") === c.code}>
                                    <button
                                      type="button"
                                      className={`${styles.ccOption} ${(form.countryCode || "+91") === c.code ? styles.ccOptionOn : ""}`}
                                      title={c.label}
                                      onClick={() => {
                                        setForm((f) => ({ ...f, countryCode: c.code }));
                                        setErrors((er) => ({ ...er, phone: "" }));
                                        setCcOpen(false);
                                      }}
                                    >
                                      {c.code}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <input
                            id="phone"
                            {...field("phone")}
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={form.countryCode === "+91" || !form.countryCode ? 10 : 15}
                            placeholder={form.countryCode === "+91" || !form.countryCode ? "10-digit number" : "Mobile number"}
                          />
                        </div>
                        {errors.phone && <em>{errors.phone}</em>}
                      </div>
                    </div>

                    <div className={styles.group}>
                      <label htmlFor="line1">Address</label>
                      <input id="line1" {...field("line1")} autoComplete="address-line1" placeholder="House no., building, street" />
                      {errors.line1 && <em>{errors.line1}</em>}
                    </div>
                    <div className={styles.group}>
                      <label htmlFor="line2">Landmark / Area <span>(optional)</span></label>
                      <input id="line2" {...field("line2")} autoComplete="address-line2" placeholder="Near temple, colony, locality" />
                    </div>

                    <div className={styles.grid3}>
                      <div className={styles.group}>
                        <label htmlFor="city">City</label>
                        <input id="city" {...field("city")} autoComplete="address-level2" />
                        {errors.city && <em>{errors.city}</em>}
                      </div>
                      <div className={styles.group}>
                        <label htmlFor="state">State</label>
                        <select id="state" {...field("state")} autoComplete="address-level1">
                          <option value="">Select state</option>
                          {STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.state && <em>{errors.state}</em>}
                      </div>
                      <div className={styles.group}>
                        <label htmlFor="pincode">Pincode</label>
                        <input id="pincode" {...field("pincode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="6 digits" />
                        {errors.pincode && <em>{errors.pincode}</em>}
                      </div>
                    </div>

                    <fieldset className={styles.addressType}>
                      <legend>Address Type</legend>
                      <div className={styles.addressTypeOpts} role="radiogroup" aria-label="Address type">
                        {["Home", "Office"].map((type) => (
                          <label key={type} className={styles.addressTypeOpt}>
                            <input
                              type="radio"
                              name="addressType"
                              value={type}
                              checked={form.addressType === type}
                              onChange={set}
                            />
                            <span className={styles.radioMark} aria-hidden="true" />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className={styles.defaultCheck}>
                      <input
                        type="checkbox"
                        name="makeDefault"
                        checked={form.makeDefault}
                        onChange={set}
                      />
                      <span className={styles.checkMark} aria-hidden="true" />
                      <span>Make this as my default address</span>
                    </label>

                    <div className={styles.addrActions}>
                      <button type="button" className={styles.cancelBtn} onClick={cancelForm}>
                        Cancel
                      </button>
                      <button type="button" className={styles.saveBtn} onClick={saveAddress}>
                        Save
                      </button>
                    </div>
                  </section>
                )}

                <Link to="/cart" className={x.continue}>← Back to Bag</Link>
              </>
            ) : (
              <>
                <div className={styles.sectionBar}>
                  <strong>PAYMENT</strong>
                  <button type="button" className={styles.editAddress} onClick={() => { setStep("address"); setAddrView("saved"); }}>
                    Edit address
                  </button>
                </div>

                <section className={styles.deliverCard}>
                  <div className={styles.deliverTop}>
                    <div>
                      <p className={styles.deliverTo}>
                        Deliver to: <strong>{deliveryAddress.fullName}, {deliveryAddress.pincode}</strong>
                      </p>
                      <p className={styles.deliverLine}>
                        {[deliveryAddress.line1, deliveryAddress.line2, deliveryAddress.city, deliveryAddress.state].filter(Boolean).join(", ")}
                      </p>
                      <p className={styles.deliverMeta}>
                        {formatPhone(deliveryAddress)} · {deliveryAddress.addressType}
                      </p>
                    </div>
                    <button type="button" className={styles.changeAddrBtn} onClick={() => { setStep("address"); openChangeAddress(); }}>
                      CHANGE ADDRESS
                    </button>
                  </div>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Payment Method</h2>
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
                  <h2 className={styles.cardTitle}>Order Notes <small>(optional)</small></h2>
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

                <button type="button" className={x.continue} onClick={() => setStep("address")}>
                  ← Back to Address
                </button>
              </>
            )}
          </div>

          <aside className={x.right} aria-label="Order summary">
            <h2 className={x.sectionH}>PRICE DETAILS ({payableCount} {payableCount === 1 ? "Item" : "Items"})</h2>

            <ul className={styles.items}>
              {cartItems.map((i, idx) => {
                const sv = priced?.lines?.[idx];
                const unit = sv?.unitPrice ?? i.priceNum ?? 0;
                return (
                  <li key={i.productId}>
                    <div className={styles.thumb}>
                      <img src={imgSrc(i.image)} alt={i.name || "Order item"} width={72} height={72} loading="lazy" />
                      <b>{i.quantity}</b>
                    </div>
                    <div className={styles.itemMeta}>
                      <span>{i.title}</span>
                      <small>{[i.variantLabel, `${inr(unit)} each`].filter(Boolean).join(" · ")}</small>
                      {sv && !sv.ok && <small className={styles.itemWarn}>{sv.message}</small>}
                    </div>
                    <strong>{sv && !sv.ok ? "—" : inr(unit * i.quantity)}</strong>
                  </li>
                );
              })}
            </ul>

            <div className={x.row}><span>Total MRP</span><span>{priced ? inr(subtotal) : "…"}</span></div>
            <div className={x.row}>
              <span>Shipping</span>
              <span className={shipping === 0 && priced ? x.free : undefined}>
                {!priced ? "…" : shipping === 0 ? "FREE" : inr(shipping)}
              </span>
            </div>
            <div className={`${x.row} ${x.total}`}><span>Total Amount</span><span>{priced ? inr(total) : "…"}</span></div>
            <p className={x.gst}>Inclusive of applicable GST · Pay on delivery</p>

            {priced && shipping === 0 && (
              <div className={x.ship}>Free shipping unlocked</div>
            )}

            {(submitError || priceError) && <p role="alert" className={x.alert}>{submitError || priceError}</p>}
            {priced && !cartOk && (
              <p role="alert" className={x.alert}>
                Some items are unavailable. <Link to="/cart" className={x.termsLink}>Review your cart</Link>
              </p>
            )}

            <p className={x.terms}>
              By placing the order, you agree to Bhava: <Link to="/terms" className={x.termsLink}>Terms of Use</Link> and{" "}
              <Link to="/privacy-policy" className={x.termsLink}>Privacy Policy</Link>
            </p>

            <button
              type={step === "payment" ? "submit" : "button"}
              className={x.cta}
              disabled={placing || pricing || !cartOk}
              onClick={step === "address" ? goToPayment : undefined}
            >
              {step === "address"
                ? (pricing ? "CHECKING…" : "CONTINUE TO PAYMENT")
                : (placing ? "PLACING ORDER…" : pricing ? "CHECKING…" : "PLACE ORDER")}
            </button>
            <p className={x.secure}>🔒 Secure checkout · Your details are safe</p>
          </aside>
        </form>
      </div>
    </div>
  );
}
