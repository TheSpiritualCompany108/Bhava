import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Asks the server to price + stock-check the cart. The server is the only source of truth for
// prices, shipping and availability; this is what the cart and checkout pages render.
export default function useCartValidation(cartItems) {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const key = JSON.stringify(
    cartItems.map((i) => ({ kind: i.kind, slug: i.slug, variant: i.variant, selection: i.selection, quantity: i.quantity }))
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      setState({ loading: false, error: "", data: null });
      return undefined;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/catalog/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: JSON.parse(key) }),
      })
        .then((r) => r.json())
        .then((j) => {
          if (cancelled) return;
          if (!j.success) throw new Error(j.message);
          setState({ loading: false, error: "", data: j });
        })
        .catch(() => {
          if (!cancelled) setState({ loading: false, error: "Could not verify prices and availability. Please try again.", data: null });
        });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
