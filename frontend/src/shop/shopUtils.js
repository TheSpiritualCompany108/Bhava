// Shared helpers for catalogue UI. Money rules live on the server; these are display helpers only.
export const MAX_LINE_QTY = 20;
export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const shippingCopy = (shipping) =>
  `${inr(shipping.fee)} shipping below ${inr(shipping.freeAbove)} · Free shipping at ${inr(shipping.freeAbove)} and above`;

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Images uploaded from Admin live on the API host (/uploads/…); bundled assets (/Products/…) are served by the site itself.
export const imgSrc = (url) => {
  if (!url) return "/Products/Home Page Incense.png";
  if (/^https?:\/\//.test(url)) return url;
  return url.startsWith("/uploads") || url.startsWith("uploads") ? `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}` : url;
};

// Navigation / category tabs (PDF §9.1): Shop All + the (Admin-managed) categories + Curated Collections
export const shopTabs = (catalog) => [
  { id: "all", label: "Shop All" },
  ...(catalog?.categories || []).map((c) => ({ id: c.id, label: c.label })),
  { id: "curated-collections", label: "Curated Collections" },
];

export const getProduct = (catalog, slug) => catalog?.products.find((p) => p.slug === slug);
export const getBundle = (catalog, slug) => catalog?.bundles.find((b) => b.slug === slug);

export const variantInStock = (catalog, slug, key) => !!catalog?.availability.products[slug]?.[key];
export const productInStock = (catalog, p) => p.variants.some((v) => variantInStock(catalog, p.slug, v.key));
export const bundleInStock = (catalog, slug) => !!catalog?.availability.bundles[slug]?.available;

// Does a product offer fragrance f (only fragrances actually in stock)?
export const productHasFragrance = (catalog, p, f) =>
  p.variants.some((v) => v.fragrances.includes(f) && variantInStock(catalog, p.slug, v.key));

// Bundle supports fragrance f if a customer can pick it (shared fragrance / camphor) or it is fixed to it
export const bundleHasFragrance = (catalog, b, f) => {
  const a = catalog.availability.bundles[b.slug];
  if (!a?.available) return false;
  if (b.needs.fragrance) return !!a.fragrance?.[f];
  if (b.needs.camphor) return !!a.camphor?.[f];
  if (b.needs.pair) return !!a.pair && Object.entries(a.pair).some(([k, ok]) => ok && k.split("-").includes(f));
  return b.components.some((c) => c.via === "fixed" && c.variant === f);
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Build a cart line request (no authoritative prices — the server prices it)
export const productLine = (p, variantKey, quantity = 1) => {
  const v = p.variants.find((x) => x.key === variantKey) || p.variants[0];
  return {
    productId: `product:${p.slug}:${v.key}`,
    kind: "product", slug: p.slug, variant: v.key, quantity,
    title: p.name, variantLabel: p.mode === "none" ? "" : v.label,
    priceNum: p.price, image: p.image,
  };
};

export const bundleLine = (b, selection, quantity = 1) => ({
  productId: `bundle:${b.slug}:${selection.fragrance || ""}|${selection.camphor || ""}|${selection.pair || ""}|${[...(selection.bracelets || [])].sort().join("+")}`,
  kind: "bundle", slug: b.slug, selection, quantity,
  title: b.name, priceNum: b.price, image: "/Products/Home Page Incense.png",
  variantLabel: [selection.fragrance && cap(selection.fragrance), selection.pair && selection.pair.split("-").map(cap).join(" + "), selection.camphor && `Camphor: ${cap(selection.camphor)}`].filter(Boolean).join(" · "),
});

export const fragLabel = (catalog, id) => catalog?.fragrances[id]?.label || cap(id);

// Section 8.3 basket-building: one relevant add-on for what is already in the cart.
// Returns { slug, variant|null, reason } — variant is set only when it can be inferred safely
// (same fragrance); otherwise the shopper is sent to the product page to choose.
export function suggestAddOn(catalog, lines) {
  if (!catalog || !lines.length) return null;
  const has = (slug) => lines.some((l) => l.kind === "product" && l.slug === slug);
  const varOf = (slug) => lines.find((l) => l.kind === "product" && l.slug === slug)?.variant;
  const core = (v) => ["guggal", "oud", "sandalwood"].includes(v);
  const pick = (slug, variant, reason) => (has(slug) ? null : { slug, variant, reason });

  if (has("sacred-notes-discovery") && core(varOf("sacred-notes-discovery"))) {
    const v = varOf("sacred-notes-discovery");
    return pick("pure-ritual-single", v, "Pair it with a bamboo-less format in the same fragrance.") ||
      pick("sacred-ember", v, "Add cones in the same fragrance.");
  }
  if (has("pure-ritual-single") && core(varOf("pure-ritual-single")))
    return pick("sacred-notes-discovery", varOf("pure-ritual-single"), "Add Sacred Notes sticks in the same fragrance.");
  if (has("sacred-ember") && core(varOf("sacred-ember")))
    return pick("sacred-notes-discovery", varOf("sacred-ember"), "Add Sacred Notes sticks in the same fragrance.");
  if (has("sacred-sambrani-offering-cups"))
    return pick("camphor-ritual-duo", null, "A natural complement to Sambrani — choose your camphor fragrance.");
  if (has("camphor-ritual-duo"))
    return pick("sacred-sambrani-offering-cups", "guggal", "A traditional Guggal offering to go with your camphor.");
  if (lines.some((l) => l.kind === "product" && l.slug.endsWith("-bracelet")))
    return pick("sacred-notes-discovery", null, "Pair your bracelet with a fragrance to begin with.");
  return null;
}

// Contents summary lines for a bundle, e.g. "1 × Sacred Notes Discovery"
export function bundleContentLines(catalog, b) {
  return b.components.map((c) => {
    if (c.bracelet) return "1 × Bracelet of your choice";
    const p = getProduct(catalog, c.product);
    const frag = c.via === "fixed" && catalog.fragrances[c.variant]; // bracelets / Triveni have no single fragrance to show
    const how = frag ? ` (${frag.label})` : "";
    return `1 × ${p?.name || c.product}${how}`;
  });
}


// ── Quantity limits (real stock, capped at MAX_LINE_QTY) ──
export const productMaxQty = (catalog, slug, variantKey) => catalog?.availability.limits?.products[slug]?.[variantKey] ?? 0;

// Bundle max = lowest limit among the selected options and fixed components
export const bundleMaxQty = (catalog, slug, sel) => {
  const l = catalog?.availability.limits?.bundles[slug];
  if (!l) return 0;
  const vals = [l.fixed];
  if (sel.fragrance) vals.push(l.fragrance[sel.fragrance] ?? 0);
  if (sel.camphor) vals.push(l.camphor[sel.camphor] ?? 0);
  if (sel.pair) vals.push(l.pair?.[sel.pair] ?? 0);
  (sel.bracelets || []).forEach((b) => vals.push(l.bracelets[b] ?? 0));
  return Math.min(MAX_LINE_QTY, ...vals);
};
