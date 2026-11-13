// Catalogue LOGIC — pure functions over a catalogue "context" loaded from MongoDB.
// No catalogue data lives here (see catalogSeed.js for the one-time bootstrap source).
import {
  SHIPPING, MAX_LINE_QTY, FRAGRANCES, CORE_FRAGRANCES, CAMPHOR_FRAGRANCES, PAIR_KEYS,
} from "./catalogConstants.js";

export * from "./catalogConstants.js";

const fail = (message) => ({ ok: false, message });
const variantOf = (p, key) => p?.variants.find((v) => v.key === key);
const fragLabel = (id) => FRAGRANCES[id]?.label || id;
const pairLabel = (key) => key.split("-").map(fragLabel).join(" + ");

/** What a bundle asks the customer to select, derived from its components. */
export const needsOf = (components = []) => ({
  fragrance: components.some((c) => c.via === "fragrance"),
  camphor: components.some((c) => c.via === "camphor"),
  pair: components.some((c) => c.via === "pair"),
  bracelets: components.filter((c) => c.bracelet).length,
});

/** Build a lookup context from active products/bundles (plain objects). */
export function buildCtx({ products = [], bundles = [], categories = [] }) {
  const pmap = new Map(products.map((p) => [p.slug, p]));
  const bmap = new Map(bundles.map((b) => [b.slug, { ...b, needs: needsOf(b.components) }]));
  return {
    products,
    categories,
    bundles: [...bmap.values()],
    bracelets: products.filter((p) => p.mode === "none").map((p) => p.slug),
    getProduct: (s) => pmap.get(s),
    getBundle: (s) => bmap.get(s),
  };
}

/** Bundle price = sum of component prices (bracelet choice slots use the highest bracelet price). null if a component is missing. */
export function bundlePrice(ctx, b) {
  let total = 0;
  for (const c of b.components) {
    if (c.bracelet) {
      const prices = ctx.bracelets.map((s) => ctx.getProduct(s).price);
      if (!prices.length) return null;
      total += Math.max(...prices);
    } else {
      const p = ctx.getProduct(c.product);
      if (!p || !variantOf(p, c.via === "fixed" ? c.variant : p.variants[0]?.key)) return null;
      total += p.price;
    }
  }
  return total;
}

/**
 * Resolve a cart request into a priced line with its actual component SKUs.
 * input: { kind:'product'|'bundle', slug, variant?, selection?:{fragrance,camphor,pair,bracelets[]}, quantity }
 */
export function resolveLine(input, ctx) {
  const quantity = Math.min(Math.max(parseInt(input?.quantity, 10) || 1, 1), MAX_LINE_QTY);

  if (input?.kind === "bundle") {
    const bundle = ctx.getBundle(input.slug);
    if (!bundle) return fail("This collection is no longer available.");
    const sel = input.selection || {};
    const { needs } = bundle;

    const fragrance = needs.fragrance ? sel.fragrance : null;
    if (needs.fragrance && !CORE_FRAGRANCES.includes(fragrance)) return fail("Please choose a fragrance.");
    const camphor = needs.camphor ? sel.camphor : null;
    if (needs.camphor && !CAMPHOR_FRAGRANCES.includes(camphor)) return fail("Please choose a camphor fragrance (Guggal or Sandalwood).");
    const pair = needs.pair ? sel.pair : null;
    if (needs.pair && !PAIR_KEYS.includes(pair)) return fail("Please choose a fragrance pair.");
    let bracelets = [];
    if (needs.bracelets) {
      bracelets = Array.isArray(sel.bracelets) ? sel.bracelets : [];
      if (bracelets.length !== needs.bracelets) {
        return fail(needs.bracelets === 1 ? "Please choose a bracelet." : `Please choose ${needs.bracelets} different bracelets.`);
      }
      if (new Set(bracelets).size !== bracelets.length) return fail("Please choose different bracelets — duplicates are not allowed in this collection.");
      if (!bracelets.every((s) => ctx.bracelets.includes(s))) return fail("One of the selected bracelets is not valid.");
    }

    const components = [];
    let bi = 0;
    for (const c of bundle.components) {
      let product, variant;
      if (c.bracelet) {
        product = ctx.getProduct(bracelets[bi++]);
        variant = product?.variants[0];
      } else {
        product = ctx.getProduct(c.product);
        const key = c.via === "fragrance" ? fragrance : c.via === "camphor" ? camphor : c.via === "pair" ? pair : c.variant;
        variant = variantOf(product, key);
      }
      if (!product || !variant) return fail("That combination is not available.");
      components.push({
        sku: variant.sku, productSlug: product.slug, name: product.name, variantLabel: product.mode === "none" ? "" : variant.label,
        pack: product.pack, unitPrice: product.price, quantity: 1,
      });
    }

    const unitPrice = components.reduce((s, c) => s + c.unitPrice, 0); // always the exact sum of its components
    return {
      ok: true,
      line: {
        lineId: `bundle:${bundle.slug}:${[fragrance, camphor, pair, [...bracelets].sort().join("+")].join("|")}`,
        kind: "bundle", slug: bundle.slug, title: bundle.name, category: "Curated Collection",
        variantLabel: [fragrance && fragLabel(fragrance), pair && pairLabel(pair), camphor && `Camphor: ${fragLabel(camphor)}`].filter(Boolean).join(" · "),
        selection: { fragrance, camphor, pair, bracelets },
        unitPrice, quantity, components,
      },
    };
  }

  const product = ctx.getProduct(input?.slug);
  if (!product) return fail("This product is no longer available.");
  const variant = variantOf(product, input.variant || (product.variants.length === 1 ? product.variants[0].key : ""));
  if (!variant) return fail("Please choose a valid option for this product.");
  const catLabel = ctx.categories?.find((c) => c.id === product.category)?.label || "";
  return {
    ok: true,
    line: {
      lineId: `product:${product.slug}:${variant.key}`,
      kind: "product", slug: product.slug, title: product.name, category: catLabel,
      variantLabel: product.mode === "none" ? "" : variant.label, variant: variant.key,
      unitPrice: product.price, quantity,
      components: [{
        sku: variant.sku, productSlug: product.slug, name: product.name, variantLabel: product.mode === "none" ? "" : variant.label,
        pack: product.pack, unitPrice: product.price, quantity: 1,
      }],
    },
  };
}

export const shippingFor = (subtotal) => (subtotal > 0 && subtotal < SHIPPING.freeAbove ? SHIPPING.fee : 0);

/** Total stock needed per SKU for a set of resolved lines. */
export function requirementsOf(lines) {
  const need = {};
  for (const l of lines) for (const c of l.components) need[c.sku] = (need[c.sku] || 0) + c.quantity * l.quantity;
  return need;
}

/**
 * Price + validate a whole cart against a stock map {sku: number}.
 * A line is blocked if its components can't be covered by the stock left after earlier lines.
 */
export function priceCart(items, stock, ctx) {
  const remaining = { ...stock };
  const lines = [];
  for (const raw of Array.isArray(items) ? items : []) {
    const r = resolveLine(raw, ctx);
    if (!r.ok) {
      lines.push({ ok: false, message: r.message, request: { kind: raw?.kind, slug: raw?.slug } });
      continue;
    }
    const l = r.line;
    const short = l.components.find((c) => (remaining[c.sku] || 0) < c.quantity * l.quantity);
    if (short) {
      const have = remaining[short.sku] || 0;
      const canBuy = Math.floor(have / short.quantity);
      lines.push({
        ...l, ok: false, available: canBuy,
        message: canBuy > 0
          ? `Only ${canBuy} available right now.`
          : l.kind === "bundle"
            ? `Currently unavailable — a required item (${short.name}${short.variantLabel ? ` · ${short.variantLabel}` : ""}) is out of stock.`
            : "Currently out of stock.",
      });
      continue;
    }
    const maxQty = Math.min(MAX_LINE_QTY, ...l.components.map((c) => Math.floor((remaining[c.sku] || 0) / c.quantity)));
    for (const c of l.components) remaining[c.sku] -= c.quantity * l.quantity;
    lines.push({ ...l, ok: true, lineTotal: l.unitPrice * l.quantity, maxQty });
  }
  const subtotal = lines.filter((l) => l.ok).reduce((s, l) => s + l.lineTotal, 0);
  const shipping = shippingFor(subtotal);
  return { lines, subtotal, shipping, total: subtotal + shipping, allOk: lines.length > 0 && lines.every((l) => l.ok) };
}

/**
 * Purchasable-quantity limits (capped at MAX_LINE_QTY). Same shape drives availability:
 * products[slug][variantKey] = n; bundles[slug] = { fixed, fragrance:{f:n}, camphor:{f:n}, pair:{key:n}, bracelets:{slug:n} }.
 * A bundle line's max = min(limit of every selected option, fixed components). Missing/inactive component → 0.
 */
export function limitsFor(stock, ctx) {
  const lim = (sku) => (sku ? Math.min(MAX_LINE_QTY, Math.max(0, stock[sku] || 0)) : 0);
  const skuOf = (c, key) => variantOf(ctx.getProduct(c.product), key)?.sku;
  const minOf = (arr) => (arr.length ? Math.min(...arr) : MAX_LINE_QTY);

  const products = {};
  for (const p of ctx.products) products[p.slug] = Object.fromEntries(p.variants.map((v) => [v.key, lim(v.sku)]));

  const bundles = {};
  for (const b of ctx.bundles) {
    const via = (name) => b.components.filter((c) => c.via === name);
    const fixed = minOf(via("fixed").map((c) => lim(skuOf(c, c.variant))));
    const frag = {}, camph = {}, pairs = {};
    for (const f of CORE_FRAGRANCES) frag[f] = minOf(via("fragrance").map((c) => lim(skuOf(c, f))));
    for (const f of CAMPHOR_FRAGRANCES) camph[f] = minOf(via("camphor").map((c) => lim(skuOf(c, f))));
    for (const k of PAIR_KEYS) pairs[k] = minOf(via("pair").map((c) => lim(skuOf(c, k))));
    const brac = Object.fromEntries(ctx.bracelets.map((s) => [s, lim(ctx.getProduct(s).variants[0]?.sku)]));
    bundles[b.slug] = { fixed, fragrance: frag, camphor: camph, pair: pairs, bracelets: brac };
  }
  return { products, bundles };
}

/** Public availability (booleans) + limits. Never exposes more than the capped limit. */
export function availabilityFor(stock, ctx) {
  const limits = limitsFor(stock, ctx);
  const bool = (o) => Object.fromEntries(Object.entries(o).map(([k, n]) => [k, n > 0]));
  const products = {};
  for (const [slug, vs] of Object.entries(limits.products)) products[slug] = bool(vs);

  const bundles = {};
  for (const b of ctx.bundles) {
    const l = limits.bundles[b.slug];
    const complete = b.components.every((c) =>
      c.bracelet ? ctx.bracelets.length >= 1 : !!ctx.getProduct(c.product) && (c.via !== "fixed" || !!variantOf(ctx.getProduct(c.product), c.variant)));
    const fragOk = !b.needs.fragrance || Object.values(l.fragrance).some((n) => n > 0);
    const campOk = !b.needs.camphor || Object.values(l.camphor).some((n) => n > 0);
    const pairOk = !b.needs.pair || Object.values(l.pair).some((n) => n > 0);
    const bracOk = !b.needs.bracelets || Object.values(l.bracelets).filter((n) => n > 0).length >= b.needs.bracelets;
    bundles[b.slug] = {
      available: complete && l.fixed > 0 && fragOk && campOk && pairOk && bracOk,
      fragrance: b.needs.fragrance ? bool(l.fragrance) : undefined,
      camphor: b.needs.camphor ? bool(l.camphor) : undefined,
      pair: b.needs.pair ? bool(l.pair) : undefined,
      bracelets: b.needs.bracelets ? bool(l.bracelets) : undefined,
    };
  }
  return { products, bundles, limits };
}
