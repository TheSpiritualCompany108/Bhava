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

/** Sibling .webp for static /Products (and similar) assets only — not /uploads. */
export const imgWebpSrc = (url) => {
  const src = imgSrc(url);
  if (!src || /^https?:\/\//.test(src) || src.startsWith("data:")) return "";
  if (src.includes("/uploads")) return "";
  if (/\.svg($|\?)/i.test(src) || /\.webp($|\?)/i.test(src)) return "";
  if (!/^\/(Products|Daily%20Practices|Explore%20Sacred%20Wisdom|Timeless%20Wisdom)\//i.test(src)
    && !/^\/[A-Za-z0-9 _%-]+\.(jpe?g|png|gif)($|\?)/i.test(src)) {
    // allow root public files like /incense.jpeg and /Products/...
    if (!src.startsWith("/Products/") && !/^\/[^/]+\.(jpe?g|png|gif)($|\?)/i.test(src)) return "";
  }
  return src.replace(/\.(jpe?g|png|gif)($|\?)/i, ".webp$2");
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

// Offered fragrance (stock-independent — OOS items still match a filter, with a badge)
export const productHasFragrance = (catalog, p, f) =>
  p.variants.some((v) => v.fragrances.includes(f) || v.key === f);

export const bundleHasFragrance = (catalog, b, f) => {
  if (b.needs.fragrance) {
    return b.components.some((c) => c.via === "fragrance" && productHasFragrance(catalog, getProduct(catalog, c.product) || { variants: [] }, f));
  }
  if (b.needs.camphor) {
    return b.components.some((c) => c.via === "camphor" && productHasFragrance(catalog, getProduct(catalog, c.product) || { variants: [] }, f));
  }
  if (b.needs.pair) {
    return b.components.some((c) => c.via === "pair" && (getProduct(catalog, c.product)?.variants || []).some((v) => v.key.split("-").includes(f)));
  }
  return b.components.some((c) => {
    if (c.via === "fixed" && (c.variant === f || c.variant === "all" || (c.variant || "").split("-").includes(f))) {
      const p = getProduct(catalog, c.product);
      if (p?.mode === "fixed") return c.variant === f; // Sambrani: Guggal only
      return true;
    }
    return false;
  });
};

export const braceletsSamePrice = (catalog) => {
  const beads = (catalog?.products || []).filter((p) => p.mode === "none");
  return beads.length > 0 && beads.every((p) => p.price === beads[0].price);
};

export const FORMAT_FILTERS = [
  { id: "sticks", label: "Sticks", category: "incense-sticks" },
  { id: "bamboo-less", label: "Bamboo-less", category: "bamboo-less-incense" },
  { id: "cones", label: "Cones", category: "incense-cones" },
  { id: "cups", label: "Cups", slugs: ["sacred-sambrani-offering-cups"] },
  { id: "tablets", label: "Tablets", slugs: ["camphor-ritual-duo"] },
  { id: "bracelets", label: "Bracelets", category: "sacred-beads" },
  { id: "collections", label: "Collections", bundles: true },
];

export const PRICE_FILTERS = [
  { id: "under-501", label: "Under ₹501", test: (n) => n < 501 },
  { id: "501-1000", label: "₹501–₹1,000", test: (n) => n >= 501 && n <= 1000 },
  { id: "1001-2000", label: "₹1,001–₹2,000", test: (n) => n >= 1001 && n <= 2000 },
  { id: "2000-plus", label: "₹2,000+", test: (n) => n > 2000 },
];

export const INTENTION_FILTERS = [
  { id: "courage", label: "Courage", slugs: ["tiger-eye-bracelet"] },
  { id: "protection", label: "Protection symbolism", slugs: ["evil-eye-bracelet"] },
  { id: "prosperity", label: "Prosperity", slugs: ["dhan-yog-bracelet"] },
  { id: "calm", label: "Calm", slugs: ["freshwater-pearl-bracelet"] },
  { id: "love", label: "Love & healing", slugs: ["rose-quartz-rhodonite-bracelet"] },
];

export const matchesFormat = (p, b, format) => {
  const f = FORMAT_FILTERS.find((x) => x.id === format);
  if (!f) return true;
  if (f.bundles) return !!b;
  if (p) return f.category ? p.category === f.category : (f.slugs || []).includes(p.slug);
  return false;
};

export const matchesPrice = (price, rangeId) => {
  const r = PRICE_FILTERS.find((x) => x.id === rangeId);
  return !r || r.test(Number(price) || 0);
};

export const matchesIntention = (p, intention) => {
  const r = INTENTION_FILTERS.find((x) => x.id === intention);
  if (!r) return true;
  return p ? r.slugs.includes(p.slug) : false;
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

/** Exact collection total: selected bracelets + fixed components. Unchosen bracelet slots use the cheapest bracelet (listing “from”). */
export function liveBundlePrice(catalog, b, selection) {
  if (!catalog || !b) return b?.price || 0;
  const beads = catalog.products.filter((p) => p.mode === "none");
  const cheapest = beads.length ? Math.min(...beads.map((p) => p.price)) : 0;
  let total = 0;
  let bi = 0;
  const chosen = selection?.bracelets || [];
  for (const c of b.components) {
    if (c.bracelet) {
      const p = getProduct(catalog, chosen[bi++]);
      total += p ? p.price : cheapest;
    } else {
      total += getProduct(catalog, c.product)?.price || 0;
    }
  }
  return total;
}

export const bundleLine = (b, selection, quantity = 1, unitPrice) => ({
  productId: `bundle:${b.slug}:${selection.fragrance || ""}|${selection.camphor || ""}|${selection.pair || ""}|${[...(selection.bracelets || [])].sort().join("+")}`,
  kind: "bundle", slug: b.slug, selection, quantity,
  title: b.name, priceNum: unitPrice ?? b.price, image: b.image || "/Products/Home Page Incense.png",
  variantLabel: [selection.fragrance && cap(selection.fragrance), selection.pair && selection.pair.split("-").map(cap).join(" + "), selection.camphor && `Camphor: ${cap(selection.camphor)}`].filter(Boolean).join(" · "),
});

export const fragLabel = (catalog, id) => catalog?.fragrances[id]?.label || cap(id);

/** Split query into words; every word must appear somewhere in `haystack` (AND). */
export const matchesSearchWords = (haystack, query) => {
  const text = String(haystack || "").toLowerCase();
  const words = String(query || "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return true;
  return words.every((w) => text.includes(w));
};

export const productSearchText = (catalog, p) => {
  const catLabel = catalog?.categories?.find((c) => c.id === p.category)?.label || p.category || "";
  const frags = (p.variants || [])
    .flatMap((v) => v.fragrances || [])
    .map((f) => fragLabel(catalog, f))
    .join(" ");
  return [p.name, p.tagline, p.description, p.pack, p.slug, catLabel, frags].filter(Boolean).join(" ");
};

export const bundleSearchText = (catalog, b) => {
  const frags = Object.values(catalog?.fragrances || {})
    .map((f) => f.label)
    .join(" ");
  return [b.name, b.tagline, b.description, b.slug, frags].filter(Boolean).join(" ");
};

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

/** Soften catalog pack facts for UI — middots, drop redundant notes. */
export function formatPackFacts(pack) {
  if (!pack) return "";
  let s = String(pack).trim();
  s = s.replace(/\s*;?\s*one fragrance per pack\.?/gi, "");
  s = s.replace(/\s*;?\s*one selected pair\.?/gi, "");
  s = s.replace(/\bnet weight\b/gi, "");
  s = s.replace(/\s{2,}/g, " ").replace(/\s*;\s*/g, " · ").replace(/\.\s*$/, "").trim();
  s = s.replace(/^(\d+)\s+units$/i, "Pack of $1");
  s = s.replace(/^(\d+)\s+cones$/i, "Pack of $1 cones");
  s = s.replace(/\s*·\s*$/, "").replace(/^\s*·\s*/, "").replace(/\s·\s·/g, " · ").trim();
  return s;
}

/** One polished meta line under a collection “What's included” row. */
export function includeMetaLine({ pack, via, fragranceLabel }) {
  let status = "";
  if (fragranceLabel) status = fragranceLabel;
  else if (via === "camphor") status = "Select camphor fragrance";
  else if (via === "pair") status = "Select fragrance pair";
  else if (via === "fragrance") status = "Select your fragrance";

  const facts = formatPackFacts(pack);
  return [status, facts].filter(Boolean).join(" · ");
}

/**
 * Collection-level thumb for curated bundles (not a single product packshot).
 * Prefers admin-uploaded `b.image`; otherwise format / home lifestyle art.
 */
export function bundleThumbImage(_catalog, b) {
  if (!b) return "/Products/Home Page Incense.png";
  if (b.image) return b.image;

  const comps = b.components || [];
  let hasBracelet = comps.some((c) => c.bracelet || /bracelet/i.test(c.product || ""));
  let hasSticks = false;
  let hasBamboo = false;
  let hasCones = false;
  let hasSmoke = false;

  for (const c of comps) {
    if (c.bracelet) continue;
    const p = getProduct(_catalog, c.product);
    const cat = p?.category || "";
    if (cat === "incense-sticks") hasSticks = true;
    else if (cat === "bamboo-less-incense") hasBamboo = true;
    else if (cat === "incense-cones") hasCones = true;
    else if (cat === "sambrani-camphor") hasSmoke = true;
    else if (cat === "sacred-beads") hasBracelet = true;
  }

  const group = String(b.group || "").toLowerCase();

  // Multi-category / bracelet + ritual → devotion-box lifestyle (reads as a set)
  if (hasBracelet && (hasSticks || hasBamboo || hasCones || hasSmoke || group.includes("+"))) {
    return "/Products/Home Page Devotion Box.png";
  }
  if (group.includes("bracelet collection") || (hasBracelet && !hasSticks && !hasBamboo && !hasCones && !hasSmoke)) {
    return "/Products/Home Page mala.png";
  }
  if (hasSmoke && !hasSticks && !hasBamboo && !hasCones) {
    return "/Products/Home Page Sambrani.png";
  }
  if (hasCones && !hasSticks && !hasBamboo) {
    return "/Products/Format Incense Cones.jpg";
  }
  if (hasBamboo && !hasSticks) {
    return "/Products/Format Bamboo-less Incense.jpg";
  }
  if (hasSticks && hasBamboo) {
    // Classic Pair etc. — format art, not Discovery/Pure Ritual packshots
    return "/Products/Format Incense Sticks.jpg";
  }
  if (hasSticks || group.includes("incense") || group.includes("ritual")) {
    return "/Products/Home Page Incense.png";
  }
  return "/Products/Home Page Devotion Box.png";
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
