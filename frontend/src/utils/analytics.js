const dl = () => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

// ── Meta Pixel (standard events) — mirrors the GA4 dataLayer events below ──
// ids are the same item_id used for GA4 so SKU data stays consistent across both tools.
const fb = (name, data, eventID) => {
  try {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    window.fbq("track", name, data, eventID ? { eventID } : undefined);
  } catch { /* tracking must never break the shop */ }
};
const fbContents = (items) => (items || []).map((i) => ({ id: i.item_id, quantity: i.quantity || 1, item_price: i.price }));

export function searchEvent(query) {
  const q = String(query || "").trim().slice(0, 100);
  if (!q) return;
  dl()?.push({ event: "search", search_term: q });
  fb("Search", { search_string: q });
}

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
  const item = itemFromProduct(p, variantKey);
  dl()?.push({ event: "view_item", ecommerce: { currency: "INR", value: p.price, items: [item] } });
  fb("ViewContent", { content_type: "product", content_ids: [item.item_id], content_name: p.name, content_category: p.category, contents: fbContents([item]), value: p.price, currency: "INR" });
}

export function selectItem(p, variantKey) {
  clearEcommerce();
  dl()?.push({ event: "select_item", ecommerce: { currency: "INR", items: [itemFromProduct(p, variantKey)] } });
}

export function addToCartEvent(line) {
  clearEcommerce();
  const item = {
    item_id: line.kind === "bundle" ? `bundle:${line.slug}` : `${line.slug}:${line.variant || ""}`,
    item_name: line.title,
    item_variant: line.variantLabel || line.variant,
    price: line.priceNum,
    quantity: line.quantity || 1,
  };
  const value = (line.priceNum || 0) * (line.quantity || 1);
  dl()?.push({ event: "add_to_cart", ecommerce: { currency: "INR", value, items: [item] } });
  fb("AddToCart", { content_type: "product", content_ids: [item.item_id], content_name: line.title, contents: fbContents([item]), value, currency: "INR" });
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
  const mapped = (items || []).map((i) => ({
    item_id: i.kind === "bundle" ? `bundle:${i.slug}` : `${i.slug}:${i.variant || ""}`,
    item_name: i.title,
    price: i.priceNum,
    quantity: i.quantity,
  }));
  dl()?.push({ event: "begin_checkout", ecommerce: { currency: "INR", value, items: mapped } });
  fb("InitiateCheckout", { content_type: "product", content_ids: mapped.map((i) => i.item_id), contents: fbContents(mapped), num_items: mapped.reduce((n, i) => n + (i.quantity || 1), 0), value, currency: "INR" });
}

export function bundleView(b, price) {
  dl()?.push({ event: "bundle_view", bundle_slug: b.slug, value: price });
  fb("ViewContent", { content_type: "product", content_ids: [`bundle:${b.slug}`], content_name: b.name, content_category: "Collection", value: price, currency: "INR" });
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
  // eventID = order id, so a future server-side (Conversions API) purchase can be deduplicated against this one
  fb("Purchase", { content_type: "product", content_ids: items.map((i) => i.item_id), contents: fbContents(items), num_items: items.reduce((n, i) => n + (i.quantity || 1), 0), value, currency: "INR" }, `purchase_${id}`);
}
