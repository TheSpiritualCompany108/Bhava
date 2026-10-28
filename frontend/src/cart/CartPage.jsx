import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./CartPage.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveCartImageUrl = (url) => {
  if (!url) return "/Products/Home Page mala.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads") || url.startsWith("uploads")) {
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  return url.startsWith("/") ? url : `/${url}`;
};

const parsePrice = (str) =>
  parseInt(String(str).replace(/[₹,]/g, ""), 10) || 0;

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, itemCount, total } = useCart();

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
          <p className={styles.emptyText}>
            Explore our sacred collection and add items you love.
          </p>
          <button className={styles.continuBtn} onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const savings = Math.round(subtotal * 0.3);       // 30% founding-member discount
  const finalTotal = subtotal - savings;

  const handleCheckout = () => {
    const token = localStorage.getItem("bhava_token");
    if (!token) {
      navigate("/auth");
    } else {
      // TODO: navigate to checkout/payment page
      alert("Checkout coming soon! Your order has been noted.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/products")}>
          ← Continue Shopping
        </button>
        <h1 className={styles.heading}>Your Cart</h1>
        <button className={styles.clearBtn} onClick={clearCart}>
          Clear All
        </button>
      </div>

      <div className={styles.layout}>
        {/* ── Item List ── */}
        <div className={styles.itemsList}>
          {cartItems.map((item) => {
            const itemTotal = parsePrice(item.price) * item.quantity;
            return (
              <div key={item.productId} className={styles.cartItem}>
                {/* Image */}
                <div className={styles.itemImageWrap}>
                  <img
                    src={resolveCartImageUrl(item.image)}
                    alt={item.title}
                    className={styles.itemImage}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/Products/Home Page mala.png";
                    }}
                  />
                </div>

                {/* Info */}
                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemUnitPrice}>{item.price} each</p>

                  {/* Qty stepper */}
                  <div className={styles.qtyRow}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right: total + remove */}
                <div className={styles.itemRight}>
                  <p className={styles.itemTotal}>
                    ₹{itemTotal.toLocaleString("en-IN")}
                  </p>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.productId)}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order Summary ── */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span>Items ({itemCount})</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.savingsRow}`}>
            <span>Founding Member (30% off)</span>
            <span>− ₹{savings.toLocaleString("en-IN")}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.freeTag}>FREE</span>
          </div>

          <div className={styles.divider} />

          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString("en-IN")}</span>
          </div>

          <div className={styles.savingsBadge}>
            You save ₹{savings.toLocaleString("en-IN")} with founding-member pricing!
          </div>

          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <p className={styles.secureNote}>
            🔒 Secure checkout · 7-day returns · Free shipping
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
