import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountPage.module.css";
import { AccountSidebar } from "./ProfilePage";
import useCatalog from "../hooks/useCatalog";
import { imgSrc, inr } from "../shop/shopUtils";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_META = {
  pending:   { color: "#C0671E", label: "PENDING" },
  confirmed: { color: "#1F7A45", label: "CONFIRMED" },
  shipped:   { color: "#2F55C4", label: "SHIPPED" },
  delivered: { color: "#1F7A45", label: "DELIVERED" },
  cancelled: { color: "#B42318", label: "CANCELLED" },
};

const TRACK_STEPS = ["Ordered", "Processing", "Shipped", "Delivered"];

function trackIndex(status) {
  switch (status) {
    case "confirmed": return 1;
    case "shipped": return 2;
    case "delivered": return 3;
    case "cancelled": return -1;
    default: return 0; // pending
  }
}

function trackCaption(status) {
  if (status === "cancelled") return "Order cancelled";
  if (status === "pending") return "Processing · Pending confirmation";
  if (status === "confirmed") return "Processing · Confirmed";
  if (status === "shipped") return "On the way · Shipped";
  if (status === "delivered") return "Delivered";
  return "Processing";
}

function itemImage(item, catalog) {
  if (item?.image) return imgSrc(item.image);
  const slug = item?.slug || item?.components?.[0]?.productSlug;
  if (!slug || !catalog) return imgSrc("");
  const product = catalog.products?.find((p) => p.slug === slug);
  if (product?.image) return imgSrc(product.image);
  const bundle = catalog.bundles?.find((b) => b.slug === slug);
  if (bundle?.image) return imgSrc(bundle.image);
  return imgSrc("");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function logoDataUrl() {
  try {
    const res = await fetch(`${window.location.origin}/bhava-icon.png`);
    if (!res.ok) throw new Error("logo fetch failed");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return `${window.location.origin}/bhava-icon.png`;
  }
}

async function buildInvoiceHtml(order) {
  const code = String(order._id).slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const a = order.address || {};
  const shipTo = [a.fullName, a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ") || "—";
  const pay = order.paymentMethod === "cod" ? "Cash on Delivery" : (order.paymentMethod || "—");
  const subtotal = Number(order.pricing?.subtotal || 0);
  const shipping = Number(order.pricing?.shipping || 0);
  const total = Number(order.amount || order.pricing?.total || 0);
  const logoUrl = await logoDataUrl();

  const rows = (order.items || []).map((item) => {
    const unit = Number(item.priceNum) || parseInt(String(item.price).replace(/[₹,]/g, ""), 10) || 0;
    const qty = item.quantity || 1;
    const line = unit * qty;
    const name = `${item.title || "Item"}${item.variantLabel ? ` · ${item.variantLabel}` : ""}`;
    return `<tr>
      <td>
        <div class="item">${escapeHtml(name)}</div>
        ${item.category ? `<div class="sub">${escapeHtml(item.category)}</div>` : ""}
      </td>
      <td class="num">${qty}</td>
      <td class="num">₹${unit.toLocaleString("en-IN")}</td>
      <td class="num">₹${line.toLocaleString("en-IN")}</td>
    </tr>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Bhava Invoice #${code}</title>
  <style>
    *{box-sizing:border-box}
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    body{margin:0;background:#f4efe6;color:#3d2a30;font-family:'DM Sans',Segoe UI,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
    .sheet{max-width:760px;margin:24px auto;background:#fff;border:1px solid #e9e9eb;padding:32px 36px}
    .top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid #e9e9eb;padding-bottom:18px;margin-bottom:18px}
    .brandRow{display:flex;align-items:center;gap:12px}
    .brandLogo{width:42px;height:42px;object-fit:contain;display:block}
    .brand{font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;font-weight:700;letter-spacing:.02em;color:#4A0B1D;margin:0;line-height:1}
    .tag{margin:8px 0 0;font-size:11px;color:#94969f;letter-spacing:.08em;text-transform:uppercase;font-weight:500}
    .meta{text-align:right;font-size:13px;line-height:1.6;color:#6b6560;font-weight:400}
    .meta strong{color:#3d2a30;font-weight:600}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px}
    .box h3{margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#94969f;font-weight:600}
    .box p{margin:0;font-size:13.5px;line-height:1.55;color:#3d2a30;font-weight:400}
    table{width:100%;border-collapse:collapse;margin:8px 0 18px}
    th{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#94969f;text-align:left;padding:10px 8px;border-bottom:1px solid #e9e9eb;font-weight:600}
    td{padding:12px 8px;border-bottom:1px solid #f0f0f0;font-size:13.5px;vertical-align:top;font-weight:400}
    .item{font-weight:600;color:#3d2a30}
    .sub{margin-top:3px;font-size:12px;color:#94969f;font-weight:400}
    .num{text-align:right;white-space:nowrap}
    .totals{width:280px;margin-left:auto}
    .row{display:flex;justify-content:space-between;gap:16px;padding:6px 0;font-size:13.5px;color:#6b6560;font-weight:400}
    .row.grand{margin-top:8px;padding-top:10px;border-top:1px solid #e9e9eb;font-size:15px;font-weight:700;color:#3d2a30}
    .foot{margin-top:28px;padding-top:14px;border-top:1px dashed #e9e9eb;font-size:12px;color:#94969f;font-weight:400}
    @media print{body{background:#fff}.sheet{border:0;margin:0;max-width:none}}
  </style>
</head>
<body>
  <div class="sheet">
    <div class="top">
      <div>
        <div class="brandRow">
          <img class="brandLogo" src="${logoUrl}" alt="Bhava"/>
          <h1 class="brand">Bhava:</h1>
        </div>
        <p class="tag">Tax Invoice / Bill of Supply</p>
      </div>
      <div class="meta">
        <div><strong>Invoice #</strong> ${code}</div>
        <div><strong>Order date</strong> ${escapeHtml(date)}</div>
        <div><strong>Payment</strong> ${escapeHtml(pay)}</div>
        <div><strong>Status</strong> ${escapeHtml(String(order.status || "pending").toUpperCase())}</div>
      </div>
    </div>
    <div class="grid">
      <div class="box">
        <h3>Sold by</h3>
        <p>Bhava:<br/>Sacred everyday essentials<br/>India</p>
      </div>
      <div class="box">
        <h3>Shipping address</h3>
        <p>${escapeHtml(shipTo)}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="num">Qty</th>
          <th class="num">Price</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="4">No items</td></tr>`}</tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>₹${subtotal.toLocaleString("en-IN")}</span></div>
      <div class="row"><span>Shipping</span><span>₹${shipping.toLocaleString("en-IN")}</span></div>
      <div class="row grand"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>
    </div>
    <p class="foot">This is a computer-generated invoice for your Bhava order. Keep it for your records.</p>
  </div>
</body>
</html>`;
}

async function downloadInvoice(order) {
  const code = String(order._id).slice(-8).toUpperCase();
  const html = await buildInvoiceHtml(order);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Reliable file download (no popup blocker)
  const a = document.createElement("a");
  a.href = url;
  a.download = `Bhava-Invoice-${code}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Also open print preview in a new tab when allowed
  const preview = window.open(url, "_blank");
  if (preview) {
    const tryPrint = () => {
      try { preview.focus(); preview.print(); } catch { /* ignore */ }
    };
    preview.addEventListener?.("load", tryPrint);
    setTimeout(tryPrint, 500);
  }

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function Chevron({ open }) {
  return (
    <svg
      className={`${styles.orderChevron} ${open ? styles.orderChevronOpen : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7l1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

function TrackingBar({ status }) {
  const active = trackIndex(status);
  const cancelled = status === "cancelled";
  const [focusStep, setFocusStep] = useState(null);
  const progressPct = cancelled ? 0 : Math.max(0, Math.min(100, (active / (TRACK_STEPS.length - 1)) * 100));
  const caption = focusStep != null
    ? `${TRACK_STEPS[focusStep]}${focusStep <= active && !cancelled ? " · reached" : focusStep === active + 1 && !cancelled ? " · next up" : ""}`
    : trackCaption(status);

  return (
    <div className={styles.trackWrap}>
      <div
        className={`${styles.trackBar} ${cancelled ? styles.trackBarCancelled : ""}`}
        style={{ "--track-progress": `${progressPct}%` }}
        role="list"
        aria-label="Order progress"
      >
        {TRACK_STEPS.map((label, i) => {
          const done = !cancelled && i <= active;
          const current = !cancelled && i === active;
          return (
            <button
              key={label}
              type="button"
              className={`${styles.trackStep} ${styles.trackStepHot}`}
              role="listitem"
              aria-current={current ? "step" : undefined}
              aria-label={`${label}${done ? ", completed" : current ? ", current" : ""}`}
              onMouseEnter={() => setFocusStep(i)}
              onMouseLeave={() => setFocusStep(null)}
              onFocus={() => setFocusStep(i)}
              onBlur={() => setFocusStep(null)}
            >
              <span
                className={`${styles.trackDot} ${done ? styles.trackDotOn : ""} ${current ? styles.trackDotCurrent : ""} ${cancelled ? styles.trackDotCancelled : ""}`}
              />
              <span className={`${styles.trackLabel} ${done ? styles.trackLabelOn : ""}`}>{label}</span>
            </button>
          );
        })}
      </div>
      <p className={`${styles.trackCaption} ${cancelled ? styles.trackCaptionCancelled : ""}`}>
        {caption}
      </p>
    </div>
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const { catalog } = useCatalog();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [openId, setOpenId] = useState("");
  const [invoiceState, setInvoiceState] = useState({}); // id -> "busy" | "done"
  const [actionBusy, setActionBusy] = useState(""); // order id
  const [actionError, setActionError] = useState("");
  const [confirm, setConfirm] = useState(null); // { type: "cancel"|"delete", order }

  const authHeaders = () => {
    const token = localStorage.getItem("bhava_token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  const askCancel = (order) => setConfirm({ type: "cancel", order });
  const askDelete = (order) => setConfirm({ type: "delete", order });

  const runConfirmedAction = async () => {
    if (!confirm?.order) return;
    const order = confirm.order;
    const id = String(order._id);
    const type = confirm.type;
    setConfirm(null);
    setActionBusy(id);
    setActionError("");
    try {
      if (type === "cancel") {
        const res = await fetch(`${BASE}/api/orders/${id}/cancel`, {
          method: "POST",
          headers: authHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          setActionError(data.message || "Could not cancel order.");
          return;
        }
        setOrders((list) => list.map((o) => (String(o._id) === id ? { ...o, ...data.order, status: "cancelled" } : o)));
        setOpenId(id);
      } else {
        const res = await fetch(`${BASE}/api/orders/${id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          setActionError(data.message || "Could not remove order.");
          return;
        }
        setOrders((list) => list.filter((o) => String(o._id) !== id));
        if (openId === id) setOpenId("");
      }
    } catch {
      setActionError(type === "cancel" ? "Unable to cancel. Please try again." : "Unable to remove. Please try again.");
    } finally {
      setActionBusy("");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("bhava_token");
    if (!token) { navigate("/auth"); return; }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load orders.");
          setOrders([]);
          return;
        }
        const list = Array.isArray(data.orders) ? data.orders : [];
        setOrders(list);
        if (list[0]?._id) setOpenId(String(list[0]._id));
      } catch {
        if (!cancelled) {
          setError("Unable to connect. Please try again.");
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [navigate, reloadKey]);

  const toggle = (id) => {
    setOpenId((cur) => (cur === id ? "" : id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AccountSidebar active="orders" navigate={navigate} />

        <div className={styles.content}>
          <div className={styles.ordersHero}>
            <div>
              <h1 className={styles.pageTitle}>My Orders</h1>
              <p className={styles.pageSubtitle}>
                Track every order from checkout to delivery in one place.
              </p>
            </div>
            {!loading && !error && orders.length > 0 && (
              <button type="button" className={styles.ordersShopLink} onClick={() => navigate("/products")}>
                Continue shopping
              </button>
            )}
          </div>

          {loading && <p className={styles.loadingText}>Loading your orders...</p>}

          {!loading && error && (
            <div className={styles.errorPanel}>
              <h3 className={styles.errorPanelTitle}>Couldn&apos;t load orders</h3>
              <p className={styles.errorPanelText}>{error}</p>
              <button type="button" className={styles.shopBtn} onClick={() => setReloadKey((k) => k + 1)}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className={styles.emptyOrders}>
              <svg viewBox="0 0 64 64" fill="none" className={styles.emptyOrdersIcon}>
                <circle cx="32" cy="32" r="30" stroke="#c9b99a" strokeWidth="2"/>
                <path d="M22 20h20l-3 22H25L22 20Z" stroke="#c9b99a" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="28" cy="48" r="2" fill="#c9b99a"/>
                <circle cx="38" cy="48" r="2" fill="#c9b99a"/>
              </svg>
              <h3 className={styles.emptyOrdersTitle}>No orders yet</h3>
              <p className={styles.emptyOrdersText}>Your sacred collection awaits. Start shopping to see your orders here.</p>
              <button className={styles.shopBtn} onClick={() => navigate("/products")}>
                Browse Products
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className={styles.ordersList}>
              {actionError ? <p className={styles.orderActionError}>{actionError}</p> : null}
              {orders.map((order) => {
                const id = String(order._id);
                const open = openId === id;
                const status = STATUS_META[order.status] || STATUS_META.pending;
                const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                });
                const itemCount = (order.items || []).reduce((n, it) => n + (it.quantity || 0), 0);
                const total = Number(order.amount || order.pricing?.total || 0);
                const canCancel = order.status === "pending" || order.status === "confirmed";
                const canRemove = order.status === "cancelled" || order.status === "delivered";
                const busy = actionBusy === id;

                return (
                  <article
                    key={id}
                    className={`${styles.orderCard} ${open ? styles.orderCardOpen : ""}`}
                  >
                    <div className={styles.orderSummary}>
                      <button
                        type="button"
                        className={styles.orderSummaryToggle}
                        aria-expanded={open}
                        onClick={() => toggle(id)}
                      >
                        <div className={styles.orderCol}>
                          <span className={styles.orderColTitle}>Order #{id.slice(-8).toUpperCase()}</span>
                          <span className={styles.orderColSub}>Order ID: {id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className={styles.orderCol}>
                          <span className={styles.orderColLabel}>Date</span>
                          <span className={styles.orderColValue}>{date}</span>
                        </div>
                        <div className={styles.orderCol}>
                          <span className={styles.orderColLabel}>Items</span>
                          <span className={styles.orderColValue}>Items: {itemCount}</span>
                        </div>
                        <div className={styles.orderCol}>
                          <span className={styles.orderColLabel}>Status</span>
                          <span className={styles.orderColStatus} style={{ color: status.color }}>
                            {status.label}
                          </span>
                        </div>
                        <div className={styles.orderCol}>
                          <span className={styles.orderColLabel}>Total</span>
                          <span className={styles.orderColTotal}>{inr(total)}</span>
                        </div>
                        {!canRemove && (
                          <span className={styles.orderChevronWrap} aria-hidden="true">
                            <Chevron open={open} />
                          </span>
                        )}
                      </button>

                      {canRemove && (
                        <button
                          type="button"
                          className={styles.summaryDeleteBtn}
                          disabled={busy}
                          aria-label="Delete order"
                          onClick={() => askDelete(order)}
                        >
                          <TrashIcon />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>

                    <div
                      className={`${styles.orderDetails} ${open ? styles.orderDetailsOpen : ""}`}
                      aria-hidden={!open}
                    >
                      <div className={styles.orderDetailsInner}>
                        <div className={styles.orderItems}>
                          {(order.items || []).map((item, i) => {
                            const unit = Number(item.priceNum) || parseInt(String(item.price).replace(/[₹,]/g, ""), 10) || 0;
                            const lineTotal = unit * (item.quantity || 1);
                            return (
                              <div key={i} className={styles.orderItem}>
                                <div className={styles.orderItemImg}>
                                  <img src={itemImage(item, catalog)} alt={item.title || "Product"} />
                                </div>
                                <div className={styles.orderItemInfo}>
                                  {item.category ? (
                                    <p className={styles.orderItemCategory}>{item.category}</p>
                                  ) : null}
                                  <p className={styles.orderItemTitle}>{item.title}</p>
                                  <p className={styles.orderItemMeta}>
                                    Qty: {item.quantity || 1}
                                    {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                                  </p>
                                </div>
                                <p className={styles.orderItemTotal}>{inr(lineTotal)}</p>
                              </div>
                            );
                          })}
                        </div>

                        <TrackingBar status={order.status || "pending"} />

                        <div className={styles.orderCardFooter}>
                          <div className={styles.orderFooterLeft}>
                            {order.address?.city ? (
                              <span className={styles.orderShipTo}>
                                Ships to: {order.address.city}
                                {order.address.pincode ? ` · ${order.address.pincode}` : ""}
                              </span>
                            ) : (
                              <span className={styles.orderShipTo}>Shipping address on file</span>
                            )}
                            {order.paymentMethod === "cod" && (
                              <span className={styles.orderType}>Cash on Delivery</span>
                            )}
                          </div>
                          <div className={styles.orderFooterActions}>
                            <button
                              type="button"
                              className={`${styles.invoiceBtn} ${invoiceState[id] === "done" ? styles.invoiceBtnDone : ""}`}
                              disabled={invoiceState[id] === "busy"}
                              onClick={async (e) => {
                                e.stopPropagation();
                                setInvoiceState((s) => ({ ...s, [id]: "busy" }));
                                try {
                                  await downloadInvoice(order);
                                  setInvoiceState((s) => ({ ...s, [id]: "done" }));
                                  setTimeout(() => {
                                    setInvoiceState((s) => ({ ...s, [id]: "" }));
                                  }, 2200);
                                } catch {
                                  setInvoiceState((s) => ({ ...s, [id]: "" }));
                                }
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M12 3v12" strokeLinecap="round"/>
                                <path d="M7 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 19h14" strokeLinecap="round"/>
                              </svg>
                              <span>
                                {invoiceState[id] === "busy"
                                  ? "Preparing…"
                                  : invoiceState[id] === "done"
                                    ? "Downloaded"
                                    : "Download Invoice"}
                              </span>
                            </button>
                            {canCancel && (
                              <button
                                type="button"
                                className={styles.cancelOrderBtn}
                                disabled={busy}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  askCancel(order);
                                }}
                              >
                                {busy ? "Cancelling…" : "Cancel Order"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {confirm?.order && (
        <div
          className={styles.confirmOverlay}
          role="presentation"
          onClick={() => !actionBusy && setConfirm(null)}
        >
          <div
            className={styles.confirmModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmIconWrap} data-type={confirm.type}>
              {confirm.type === "delete" ? <TrashIcon /> : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5" strokeLinecap="round" />
                  <circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              )}
            </div>
            <h3 id="order-confirm-title" className={styles.confirmTitle}>
              {confirm.type === "cancel" ? "Cancel this order?" : "Delete this order?"}
            </h3>
            <p className={styles.confirmText}>
              {confirm.type === "cancel"
                ? `Order #${String(confirm.order._id).slice(-8).toUpperCase()} will be cancelled and stock will be released. This can’t be undone.`
                : `Order #${String(confirm.order._id).slice(-8).toUpperCase()} will be removed from My Orders. You won’t see it here anymore.`}
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmSecondary}
                disabled={!!actionBusy}
                onClick={() => setConfirm(null)}
              >
                Keep order
              </button>
              <button
                type="button"
                className={confirm.type === "cancel" ? styles.confirmDanger : styles.confirmPrimary}
                disabled={!!actionBusy}
                onClick={runConfirmedAction}
              >
                {actionBusy
                  ? (confirm.type === "cancel" ? "Cancelling…" : "Removing…")
                  : (confirm.type === "cancel" ? "Yes, cancel" : "Yes, delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
