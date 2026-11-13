const dl = () => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

export const clearEcommerce = () => {
  dl()?.push({ ecommerce: null });
};

const itemFromProduct = (p, variantKey, quantity = 1) => ({
  item_id: variantKey ? `${p.slug}:${variantKey}` : p.slug,
  item_name: p.name,
  item_category: p.category,
  item_variant: variantKey && p.mode !== "none" ? variantKey : undefined,
  price: p.price,
  quantity,
});

export function viewItem(p, variantKey) {
  clearEcommerce();
  dl()?.push({ event: "view_item", ecommerce: { currency: "INR", value: p.price, items: [itemFromProduct(p, variantKey)] } });
}

export function selectItem(p, variantKey) {
  clearEcommerce();
  dl()?.push({ event: "select_item", ecommerce: { currency: "INR", items: [itemFromProduct(p, variantKey)] } });
}

export function addToCartEvent(line) {
  clearEcommerce();
  dl()?.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "INR",
      value: (line.priceNum || 0) * (line.quantity || 1),
      items: [{
        item_id: line.kind === "bundle" ? `bundle:${line.slug}` : `${line.slug}:${line.variant || ""}`,
        item_name: line.title,
        item_variant: line.variantLabel || line.variant,
        price: line.priceNum,
        quantity: line.quantity || 1,
      }],
    },
  });
  if (line.kind === "bundle") {
    dl()?.push({
      event: "bundle_select",
      bundle_slug: line.slug,
      value: line.priceNum,
      bracelets: line.selection?.bracelets || [],
      fragrance: line.selection?.fragrance || null,
      camphor: line.selection?.camphor || null,
      pair: line.selection?.pair || null,
    });
  }
}

export function viewCart(items, value) {
  clearEcommerce();
  dl()?.push({
    event: "view_cart",
    ecommerce: {
      currency: "INR",
      value,
      items: (items || []).map((i) => ({
        item_id: i.kind === "bundle" ? `bundle:${i.slug}` : `${i.slug}:${i.variant || ""}`,
        item_name: i.title,
        price: i.priceNum,
        quantity: i.quantity,
      })),
    },
  });
}

export function beginCheckout(items, value) {
  clearEcommerce();
  dl()?.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "INR",
      value,
      items: (items || []).map((i) => ({
        item_id: i.kind === "bundle" ? `bundle:${i.slug}` : `${i.slug}:${i.variant || ""}`,
        item_name: i.title,
        price: i.priceNum,
        quantity: i.quantity,
      })),
    },
  });
}

export function bundleView(b, price) {
  dl()?.push({ event: "bundle_view", bundle_slug: b.slug, value: price });
}

const PURCHASE_KEY = "bhava_ga4_purchases";

export function purchaseOnce(orderId, { value, shipping = 0, items = [] }) {
  const id = String(orderId || "");
  if (!id) return;
  let seen = [];
  try { seen = JSON.parse(sessionStorage.getItem(PURCHASE_KEY) || "[]"); } catch { seen = []; }
  if (seen.includes(id)) return;
  seen.push(id);
  sessionStorage.setItem(PURCHASE_KEY, JSON.stringify(seen.slice(-50)));
  clearEcommerce();
  dl()?.push({
    event: "purchase",
    ecommerce: {
      transaction_id: id,
      currency: "INR",
      value,
      shipping,
      items,
    },
  });
}
