import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MAX_LINE_QTY } from "../shop/shopUtils";

const CartContext = createContext(null);

const STORAGE_KEY = "bhava_cart";

// Cart lines are *requests* for catalogue items: { productId(lineId), kind, slug, variant, selection,
// quantity } plus display fields. Prices/shipping/stock are always re-derived by the server
// (POST /api/catalog/cart), so nothing stored here is trusted for money.
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // Drop legacy (pre-catalogue) lines — they can no longer be fulfilled.
    return Array.isArray(raw) ? raw.filter((i) => i && i.kind && i.slug) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  // Indicative merchandise total (display only — the server price is authoritative)
  const total = cartItems.reduce((s, i) => s + (i.priceNum || 0) * i.quantity, 0);

  const addToCart = useCallback((line) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === line.productId);
      if (idx >= 0) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: Math.min(MAX_LINE_QTY, item.quantity + (line.quantity || 1)) } : item
        );
      }
      return [...prev, { ...line, quantity: Math.min(MAX_LINE_QTY, line.quantity || 1) }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1 || quantity > MAX_LINE_QTY) return;
    setCartItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
