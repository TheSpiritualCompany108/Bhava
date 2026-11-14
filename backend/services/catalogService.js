// Catalogue + inventory data layer. MongoDB is the single source of truth.
import CatalogProduct from "../models/CatalogProduct.js";
import CatalogBundle from "../models/CatalogBundle.js";
import CatalogCategory from "../models/CatalogCategory.js";
import CatalogSettings, { DEFAULT_SHOP_FILTERS } from "../models/CatalogSettings.js";
import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";
import Order from "../models/Order.js";
import {
  buildCtx, needsOf, bundlePrice, availabilityFor, allowedVariants, MODES, PRODUCT_STATUSES, BUNDLE_STATUSES, HOME_MODULES, LOW_STOCK_DEFAULT, CORE_FRAGRANCES,
} from "../data/catalog.js";
import { SEED_PRODUCTS, SEED_BUNDLES, SEED_CATEGORIES } from "../data/catalogSeed.js";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SKU_RE = /^[A-Z0-9][A-Z0-9-]{1,30}$/;
const str = (v, max = 4000) => String(v ?? "").trim().slice(0, max);

// ── Loading ──────────────────────────────────────────────────────────────────
/** Storefront context: ACTIVE products (active variants only) + ACTIVE bundles + active categories. */
export async function loadCtx() {
  const [products, bundles, categories] = await Promise.all([
    CatalogProduct.find({ status: "active" }).sort({ sortOrder: 1, name: 1 }).lean(),
    CatalogBundle.find({ status: "active" }).sort({ sortOrder: 1 }).lean(),
    CatalogCategory.find({ active: true }).sort({ sortOrder: 1 }).lean(),
  ]);
  const live = products.map((p) => ({ ...p, variants: p.variants.filter((v) => v.active !== false) })).filter((p) => p.variants.length > 0);
  return buildCtx({ products: live, bundles, categories });
}

/** Admin context: every non-archived product/bundle, all variants (for price previews & pickers). */
export async function loadAdminCtx() {
  const [products, bundles, categories] = await Promise.all([
    CatalogProduct.find({ status: { $ne: "archived" } }).sort({ sortOrder: 1 }).lean(),
    CatalogBundle.find({ status: { $ne: "archived" } }).sort({ sortOrder: 1 }).lean(),
    CatalogCategory.find({}).sort({ sortOrder: 1 }).lean(),
  ]);
  return buildCtx({ products, bundles, categories });
}

export async function loadStock() {
  const rows = await Inventory.find({}, "sku stock").lean();
  return Object.fromEntries(rows.map((r) => [r.sku, r.stock]));
}

export async function getSettings() {
  const doc = await CatalogSettings.findOneAndUpdate({ key: "main" }, { $setOnInsert: { key: "main", lowStockThreshold: LOW_STOCK_DEFAULT } }, { upsert: true, new: true });
  return {
    lowStockThreshold: doc.lowStockThreshold,
    shopFilters: { ...DEFAULT_SHOP_FILTERS, ...(doc.shopFilters?.toObject?.() || doc.shopFilters || {}) },
  };
}

// ── Sync / migration (additive only) ─────────────────────────────────────────
/**
 * Inserts approved catalogue records that are MISSING. Never updates or deletes existing
 * products/bundles/categories, never touches stock (new SKUs start at 0). Safe to re-run.
 */
export async function syncCatalog({ dryRun = false } = {}) {
  const report = {
    dryRun,
    created: { categories: 0, products: 0, bundles: 0, inventory: 0 },
    existing: { categories: 0, products: 0, bundles: 0 },
    warnings: [],
    notInApprovedCatalogue: { products: [], bundles: [] },
  };

  for (const c of SEED_CATEGORIES) {
    if (await CatalogCategory.exists({ id: c.id })) report.existing.categories++;
    else {
      report.created.categories++;
      if (!dryRun) await CatalogCategory.create({ ...c, active: true });
    }
  }

  const usedSkus = new Map();
  for (const p of await CatalogProduct.find({}, "slug variants.sku").lean()) p.variants.forEach((v) => usedSkus.set(v.sku, p.slug));

  for (const p of SEED_PRODUCTS) {
    if (await CatalogProduct.exists({ slug: p.slug })) {
      report.existing.products++;
      continue;
    }
    const clash = p.variants.find((v) => usedSkus.has(v.sku));
    if (clash) {
      report.warnings.push(`Skipped "${p.slug}": SKU ${clash.sku} is already used by "${usedSkus.get(clash.sku)}".`);
      continue;
    }
    report.created.products++;
    p.variants.forEach((v) => usedSkus.set(v.sku, p.slug));
    if (!dryRun) await CatalogProduct.create(p);
  }

  for (const b of SEED_BUNDLES) {
    if (await CatalogBundle.exists({ slug: b.slug })) report.existing.bundles++;
    else {
      report.created.bundles++;
      if (!dryRun) await CatalogBundle.create(b);
    }
  }

  // Inventory records: one per variant SKU; created at 0 only if missing — existing stock is never touched
  if (!dryRun) {
    await CatalogSettings.updateOne({ key: "main" }, { $setOnInsert: { key: "main", lowStockThreshold: LOW_STOCK_DEFAULT } }, { upsert: true });
    for (const p of await CatalogProduct.find({}, "variants.sku").lean()) {
      for (const v of p.variants) {
        const r = await Inventory.updateOne({ sku: v.sku }, { $setOnInsert: { sku: v.sku, stock: 0 } }, { upsert: true });
        if (r.upsertedCount) report.created.inventory++;
      }
    }
  }

  const seedSlugs = new Set(SEED_PRODUCTS.map((p) => p.slug));
  const seedBundleSlugs = new Set(SEED_BUNDLES.map((b) => b.slug));
  report.notInApprovedCatalogue.products = (await CatalogProduct.find({}, "slug").lean()).map((p) => p.slug).filter((s) => !seedSlugs.has(s));
  report.notInApprovedCatalogue.bundles = (await CatalogBundle.find({}, "slug").lean()).map((b) => b.slug).filter((s) => !seedBundleSlugs.has(s));

  const allSkus = new Set((await CatalogProduct.find({}, "variants.sku").lean()).flatMap((p) => p.variants.map((v) => v.sku)));
  const orphans = (await Inventory.find({}, "sku").lean()).map((i) => i.sku).filter((s) => !allSkus.has(s));
  if (orphans.length) report.warnings.push(`Inventory records not linked to any product variant: ${orphans.join(", ")}.`);
  return report;
}

/** First-run bootstrap: only if no catalogue exists yet. */
export async function bootstrapCatalogIfEmpty() {
  if ((await CatalogProduct.estimatedDocumentCount()) === 0) {
    const r = await syncCatalog();
    console.log(`Catalogue bootstrapped from approved seed: ${JSON.stringify(r.created)}`);
  }
}

// ── Validation ───────────────────────────────────────────────────────────────
const cleanList = (v, n = 20) => (Array.isArray(v) ? v.map((x) => str(x, 300)).filter(Boolean).slice(0, n) : []);

export async function validateProductInput(input, { existing } = {}) {
  const errors = [];
  const err = (f, m) => errors.push({ field: f, message: m });
  const d = {};

  d.slug = existing ? existing.slug : str(input.slug, 80).toLowerCase();
  if (!existing && !SLUG_RE.test(d.slug)) err("slug", "Slug must be lowercase letters, numbers and hyphens (e.g. sacred-notes-discovery).");
  if (!existing && (await CatalogProduct.exists({ slug: d.slug }))) err("slug", `A product with slug "${d.slug}" already exists.`);

  d.name = str(input.name, 120);
  if (!d.name) err("name", "Product name is required (use the exact catalogue name).");
  const dupName = d.name && (await CatalogProduct.findOne({ name: new RegExp(`^${d.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"), ...(existing ? { slug: { $ne: existing.slug } } : {}) }, "slug").lean());
  if (dupName) err("name", `Another product is already named "${d.name}".`);

  d.category = str(input.category, 80);
  if (!(await CatalogCategory.exists({ id: d.category }))) err("category", "Choose a valid category.");

  d.price = Number(input.price);
  if (!Number.isFinite(d.price) || d.price < 0 || !Number.isInteger(d.price)) err("price", "Price must be a whole number of rupees (≥ 0).");

  d.mode = existing ? existing.mode : str(input.mode, 20);
  if (!MODES.includes(d.mode)) err("mode", "Choose a valid variant type.");
  if (existing && input.mode && input.mode !== existing.mode) err("mode", "Variant type cannot be changed after creation.");

  d.status = str(input.status || "active", 20);
  if (!PRODUCT_STATUSES.includes(d.status)) err("status", "Invalid status.");

  // Variants — only combinations allowed by the approved fragrance matrix; SKUs unique; existing SKUs immutable
  const allowed = new Map(allowedVariants(d.mode).map((v) => [v.key, v]));
  const incoming = Array.isArray(input.variants) ? input.variants : [];
  const seenKeys = new Set(), seenSkus = new Set();
  d.variants = [];
  for (const v of incoming) {
    const key = str(v.key, 40);
    const rule = allowed.get(key);
    if (!rule) { err("variants", `"${key}" is not an approved variant for this product type.`); continue; }
    if (seenKeys.has(key)) { err("variants", `Variant "${rule.label}" is listed twice.`); continue; }
    seenKeys.add(key);
    const sku = str(v.sku, 40).toUpperCase();
    if (!SKU_RE.test(sku)) { err("variants", `SKU for ${rule.label} must be 2–31 characters: A–Z, 0–9 and hyphens.`); continue; }
    if (seenSkus.has(sku)) { err("variants", `SKU ${sku} is used twice in this product.`); continue; }
    seenSkus.add(sku);
    const prev = existing?.variants.find((x) => x.key === key);
    if (prev && prev.sku !== sku) { err("variants", `The SKU of "${rule.label}" (${prev.sku}) cannot be changed — it is linked to stock and past orders. Deactivate the variant and add a new one instead.`); continue; }
    const clash = await CatalogProduct.findOne({ "variants.sku": sku, ...(existing ? { slug: { $ne: existing.slug } } : {}) }, "slug").lean();
    if (clash) { err("variants", `SKU ${sku} is already used by "${clash.slug}".`); continue; }
    d.variants.push({ key, label: rule.label, fragrances: rule.fragrances, sku, active: v.active !== false });
  }
  if (existing) for (const prev of existing.variants) if (!seenKeys.has(prev.key)) err("variants", `Variant "${prev.label}" cannot be removed — deactivate it instead (stock and orders reference it).`);
  if (!d.variants.length) err("variants", "Add at least one variant (every sellable product needs a SKU).");
  if (d.status === "active" && d.variants.length && !d.variants.some((v) => v.active)) err("variants", "An active product needs at least one active variant.");
  if (d.mode === "none" && d.variants.length > 1) err("variants", "Bracelets have exactly one variant.");

  d.tagline = str(input.tagline, 200);
  d.description = str(input.description, 4000);
  d.intention = str(input.intention, 300);
  d.pack = str(input.pack, 300);
  d.packQuantity = str(input.packQuantity, 120);
  d.netWeight = str(input.netWeight, 60);
  d.format = str(input.format, 60);
  d.fitNote = str(input.fitNote, 300);
  d.materials = str(input.materials, 2000);
  d.usage = str(input.usage, 4000);
  d.safety = str(input.safety, 4000);
  d.storage = str(input.storage, 2000);
  d.seoTitle = str(input.seoTitle, 70);
  d.seoDescription = str(input.seoDescription, 170);
  d.approvalNotes = str(input.approvalNotes, 1000);
  d.copyPending = !!input.copyPending;
  d.sortOrder = Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0;
  d.image = str(input.image, 500);
  d.gallery = cleanList(input.gallery, 10);
  d.contents = (Array.isArray(input.contents) ? input.contents : []).map((c) => ({ label: str(c.label, 60), value: str(c.value, 200) })).filter((c) => c.label && c.value).slice(0, 15);
  d.faqs = (Array.isArray(input.faqs) ? input.faqs : []).map((f) => ({ q: str(f.q, 200), a: str(f.a, 1500) })).filter((f) => f.q && f.a).slice(0, 15);

  const rel = input.related || {};
  d.related = { upsell: str(rel.upsell, 80), upsellAlt: str(rel.upsellAlt, 80), upsellBundle: str(rel.upsellBundle, 80), crossSell: cleanList(rel.crossSell, 6), bundle: str(rel.bundle, 80) };
  for (const s of [d.related.upsell, d.related.upsellAlt, ...d.related.crossSell].filter(Boolean)) {
    if (s === d.slug) err("related", "A product cannot recommend itself.");
    else if (!(await CatalogProduct.exists({ slug: s }))) err("related", `Related product "${s}" does not exist.`);
  }
  for (const s of [d.related.bundle, d.related.upsellBundle].filter(Boolean)) {
    if (!(await CatalogBundle.exists({ slug: s }))) err("related", `Related collection "${s}" does not exist.`);
  }
  return { errors, data: d };
}

export async function validateBundleInput(input, { existing } = {}) {
  const errors = [];
  const err = (f, m) => errors.push({ field: f, message: m });
  const d = {};
  d.slug = existing ? existing.slug : str(input.slug, 90).toLowerCase();
  if (!existing && !SLUG_RE.test(d.slug)) err("slug", "Slug must be lowercase letters, numbers and hyphens.");
  if (!existing && (await CatalogBundle.exists({ slug: d.slug }))) err("slug", `A collection with slug "${d.slug}" already exists.`);
  d.name = str(input.name, 120);
  if (!d.name) err("name", "Collection name is required.");
  d.group = str(input.group, 80);
  d.tagline = str(input.tagline, 200);
  d.description = str(input.description, 2000);
  d.image = str(input.image, 500);
  d.approvalNotes = str(input.approvalNotes, 1000);
  d.sortOrder = Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0;
  d.status = str(input.status || "active", 20);
  if (!BUNDLE_STATUSES.includes(d.status)) err("status", "Invalid status.");
  d.homeModule = str(input.homeModule || "", 20);
  if (!HOME_MODULES.includes(d.homeModule)) err("homeModule", "Invalid home module.");
  d.featured = !!input.featured;
  d.launchPriority = d.featured && Number.isInteger(Number(input.launchPriority)) && Number(input.launchPriority) > 0 ? Number(input.launchPriority) : null;
  if (d.featured && d.status !== "active") err("featured", "Only an active collection can be featured.");
  if (d.featured) {
    const others = await CatalogBundle.countDocuments({ featured: true, ...(existing ? { slug: { $ne: existing.slug } } : {}) });
    if (others >= 8) err("featured", "Only 8 priority collections can be featured at launch (PDF §6.8). Un-feature another one first.");
  }

  const comps = Array.isArray(input.components) ? input.components : [];
  if (!comps.length) err("components", "Add at least one component.");
  if (comps.length > 10) err("components", "A collection can have at most 10 components.");
  d.components = [];
  const seenFixed = new Set();
  for (const [i, c] of comps.entries()) {
    const at = `Component ${i + 1}`;
    if (c.bracelet) { d.components.push({ bracelet: true }); continue; }
    const p = await CatalogProduct.findOne({ slug: str(c.product, 80) }).lean();
    if (!p) { err("components", `${at}: product "${c.product}" does not exist.`); continue; }
    if (p.status === "archived") { err("components", `${at}: "${p.name}" is archived.`); continue; }
    const via = str(c.via, 12);
    if (!["fragrance", "camphor", "pair", "fixed"].includes(via)) { err("components", `${at}: choose how the variant is selected.`); continue; }
    if (via === "fragrance" && p.mode !== "single") { err("components", `${at}: "${p.name}" has no single-fragrance choice — use a fixed variant or pair.`); continue; }
    if (via === "camphor" && p.mode !== "camphor") { err("components", `${at}: only Camphor products can use the camphor selection.`); continue; }
    if (via === "pair" && p.mode !== "pair") { err("components", `${at}: "${p.name}" is not a fragrance-pair product.`); continue; }
    const comp = { product: p.slug, via };
    if (via === "fixed") {
      const asked = str(c.variant, 40);
      const active = (p.variants || []).filter((x) => x && x.active !== false);
      // Bracelets / single-SKU products often omit variant in the admin form — default to the only key.
      let v = asked ? p.variants.find((x) => x.key === asked) : null;
      if (!v && active.length === 1) v = active[0];
      if (!v) v = p.variants.find((x) => x.key === "default") || active[0] || p.variants[0];
      if (!v) { err("components", `${at}: "${asked || "undefined"}" is not a variant of "${p.name}".`); continue; }
      comp.variant = v.key;
      const k = `${p.slug}:${v.key}`;
      if (seenFixed.has(k) && p.mode === "none") { err("components", `${at}: bracelet "${p.name}" appears twice.`); continue; }
      seenFixed.add(k);
    }
    d.components.push(comp);
  }
  return { errors, data: d };
}

// ── Admin listings ───────────────────────────────────────────────────────────
function statusOf(stock, threshold) {
  if (stock <= 0) return "out";
  return stock <= threshold ? "low" : "in";
}

export async function adminListProducts({ search = "", status = "", category = "" } = {}) {
  const q = {};
  if (status) q.status = status;
  else q.status = { $ne: "archived" };
  if (category) q.category = category;
  if (search) q.$or = [{ name: new RegExp(escapeRe(search), "i") }, { slug: new RegExp(escapeRe(search), "i") }, { "variants.sku": new RegExp(escapeRe(search), "i") }];
  const [products, stock, settings] = await Promise.all([CatalogProduct.find(q).sort({ sortOrder: 1, name: 1 }).lean(), loadStock(), getSettings()]);
  return products.map((p) => {
    const active = p.variants.filter((v) => v.active !== false);
    const units = active.reduce((s, v) => s + (stock[v.sku] || 0), 0);
    return { ...p, totalUnits: units, stockStatus: units <= 0 ? "out" : active.some((v) => (stock[v.sku] || 0) <= settings.lowStockThreshold) ? "low" : "in", variants: p.variants.map((v) => ({ ...v, stock: stock[v.sku] || 0 })) };
  });
}

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function adminListBundles() {
  const ctx = await loadAdminCtx();
  const stock = await loadStock();
  const activeCtx = await loadCtx();
  const avail = availabilityFor(stock, activeCtx);
  const all = await CatalogBundle.find({ status: { $ne: "archived" } }).sort({ sortOrder: 1 }).lean();
  return all.map((b) => ({
    ...b,
    needs: needsOf(b.components),
    price: bundlePrice(ctx, b),
    purchasable: b.status === "active" && !!avail.bundles[b.slug]?.available,
    contentsText: b.components.map((c) => (c.bracelet ? "Any bracelet" : `${ctx.getProduct(c.product)?.name || c.product}${c.via === "fixed" && c.variant !== "default" ? ` (${c.variant})` : ""}`)).join(" + "),
  }));
}

// ── Inventory ────────────────────────────────────────────────────────────────
async function inventoryRows({ includeArchived = false } = {}) {
  const [products, stockDocs, settings] = await Promise.all([
    CatalogProduct.find(includeArchived ? {} : { status: { $ne: "archived" } }).lean(),
    Inventory.find({}).lean(),
    getSettings(),
  ]);
  const cats = Object.fromEntries((await CatalogCategory.find({}).lean()).map((c) => [c.id, c.label]));
  const bySku = new Map(stockDocs.map((d) => [d.sku, d]));
  const rows = [];
  for (const p of products) {
    for (const v of p.variants) {
      const inv = bySku.get(v.sku);
      const stock = inv?.stock ?? 0;
      rows.push({
        sku: v.sku, productSlug: p.slug, productName: p.name, image: p.image, category: p.category, categoryLabel: cats[p.category] || p.category,
        variantKey: v.key, variantLabel: p.mode === "none" ? "—" : v.label, fragrances: v.fragrances,
        active: p.status === "active" && v.active !== false, variantActive: v.active !== false, productStatus: p.status,
        stock, reserved: 0, stockStatus: statusOf(stock, settings.lowStockThreshold), updatedAt: inv?.updatedAt || null, hasRecord: !!inv,
      });
    }
  }
  return { rows, threshold: settings.lowStockThreshold, orphans: stockDocs.filter((d) => !products.some((p) => p.variants.some((v) => v.sku === d.sku))).map((d) => d.sku) };
}

export async function inventorySummary() {
  const { rows, threshold, orphans } = await inventoryRows();
  const sellable = rows.filter((r) => r.variantActive); // active variants of non-archived products
  const count = (s) => sellable.filter((r) => r.stockStatus === s).length;
  return {
    totalProducts: new Set(sellable.map((r) => r.productSlug)).size,
    totalSkus: sellable.length,
    inStock: count("in"),
    lowStock: count("low"),
    outOfStock: count("out"),
    totalUnits: sellable.reduce((s, r) => s + r.stock, 0),
    lowStockThreshold: threshold,
    unlinkedInventoryRecords: orphans.length,
    definitions: {
      totalProducts: "Non-archived catalogue products (bundles hold no stock and are not counted).",
      totalSkus: "Active variants of non-archived products — one SKU each.",
      inStock: `SKUs with stock above the low-stock threshold (${threshold}).`,
      lowStock: `SKUs with 1–${threshold} units.`,
      outOfStock: "SKUs with 0 units (or no inventory record).",
      totalUnits: "Sum of available units across the counted SKUs.",
    },
  };
}

export async function inventoryList({ search = "", category = "", stockStatus = "", active = "", sort = "name", order = "asc", page = 1, limit = 25 } = {}) {
  const { rows, threshold } = await inventoryRows();
  let list = rows;
  const q = search.trim().toLowerCase();
  if (q) list = list.filter((r) => `${r.productName} ${r.sku} ${r.variantLabel} ${r.fragrances.join(" ")}`.toLowerCase().includes(q));
  if (category) list = list.filter((r) => r.category === category);
  if (stockStatus) list = list.filter((r) => r.stockStatus === stockStatus);
  if (active === "active") list = list.filter((r) => r.active);
  if (active === "inactive") list = list.filter((r) => !r.active);
  const dir = order === "desc" ? -1 : 1;
  const cmp = {
    name: (a, b) => a.productName.localeCompare(b.productName) || a.sku.localeCompare(b.sku),
    stock: (a, b) => a.stock - b.stock || a.sku.localeCompare(b.sku),
    updated: (a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0),
  }[sort] || ((a, b) => a.productName.localeCompare(b.productName));
  list = [...list].sort((a, b) => dir * cmp(a, b));
  const total = list.length;
  const lim = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
  const pages = Math.max(1, Math.ceil(total / lim));
  const pg = Math.min(Math.max(parseInt(page, 10) || 1, 1), pages);
  return { items: list.slice((pg - 1) * lim, pg * lim), total, page: pg, pages, limit: lim, threshold };
}

const knownSku = async (sku) => !!(await CatalogProduct.exists({ "variants.sku": sku }));

/** Absolute stock set. Atomic upsert; movement logged. Never negative. */
export async function setStock(sku, stock, { reason = "", actor = "" } = {}) {
  if (!(await knownSku(sku))) throw new ApiError(400, "Unknown SKU — it is not a variant of any catalogue product.");
  if (!Number.isInteger(stock) || stock < 0 || stock > 1000000) throw new ApiError(400, "Stock must be a whole number ≥ 0.");
  const before = await Inventory.findOneAndUpdate({ sku }, { $set: { stock } }, { upsert: true, new: false });
  const prev = before?.stock ?? 0;
  await StockMovement.create({ sku, type: "set", delta: stock - prev, before: prev, after: stock, reason: str(reason, 300) || "Stock count updated", actor });
  return { sku, stock, before: prev };
}

/** Set absolute stock for many SKUs in one request (each SKU still logged separately). */
export async function bulkSetStock(items, { reason = "", actor = "" } = {}) {
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, "Select at least one SKU to update.");
  if (items.length > 200) throw new ApiError(400, "You can update at most 200 SKUs at once.");

  const results = [];
  const errors = [];
  for (const item of items) {
    const sku = String(item?.sku || "").trim().toUpperCase();
    const stock = Number(item?.stock);
    try {
      results.push(await setStock(sku, stock, { reason, actor }));
    } catch (e) {
      errors.push({ sku: sku || String(item?.sku || ""), message: e?.message || "Could not update this SKU." });
    }
  }
  if (!results.length) {
    throw new ApiError(400, "No SKUs were updated. Check the quantities and try again.", errors);
  }
  return { updated: results.length, failed: errors.length, results, errors };
}

/** Relative adjustment (+/-). Refuses to go below zero, atomically. */
export async function adjustStock(sku, delta, { reason = "", actor = "" } = {}) {
  if (!(await knownSku(sku))) throw new ApiError(400, "Unknown SKU — it is not a variant of any catalogue product.");
  if (!Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 1000000) throw new ApiError(400, "Adjustment must be a non-zero whole number.");
  if (!str(reason)) throw new ApiError(400, "A reason is required for stock adjustments.");
  const filter = delta < 0 ? { sku, stock: { $gte: -delta } } : { sku };
  const doc = await Inventory.findOneAndUpdate(filter, { $inc: { stock: delta } }, { upsert: delta > 0, new: true });
  if (!doc) throw new ApiError(409, "That adjustment would make stock negative.");
  await StockMovement.create({ sku, type: "adjust", delta, before: doc.stock - delta, after: doc.stock, reason: str(reason, 300), actor });
  return { sku, stock: doc.stock };
}

export async function stockMovements(sku, limit = 50) {
  return StockMovement.find({ sku }).sort({ createdAt: -1 }).limit(Math.min(limit, 200)).lean();
}

/** Checkout: atomically deduct every SKU or none. Returns false (after rolling back) if any SKU lacks stock. */
export async function deductStock(need) {
  const done = [];
  for (const [sku, qty] of Object.entries(need)) {
    const doc = await Inventory.findOneAndUpdate({ sku, stock: { $gte: qty } }, { $inc: { stock: -qty } }, { new: true });
    if (!doc) {
      await restoreStock(Object.fromEntries(done.map((d) => [d.sku, d.qty])));
      return false;
    }
    done.push({ sku, qty, after: doc.stock });
  }
  return done;
}

export async function restoreStock(need) {
  for (const [sku, qty] of Object.entries(need)) await Inventory.updateOne({ sku }, { $inc: { stock: qty } }).catch(() => {});
}

export async function logOrderMovements(done, orderId) {
  if (!done?.length) return;
  await StockMovement.insertMany(done.map((d) => ({ sku: d.sku, type: "order", delta: -d.qty, before: d.after + d.qty, after: d.after, reason: "Order placed", orderId, actor: "checkout" })), { ordered: false }).catch(() => {});
}

/** Cancel an order and return its component stock exactly once. */
export async function cancelOrderAndRestock(orderId, { actor = "" } = {}) {
  const claimed = await Order.findOneAndUpdate(
    { _id: orderId, status: { $in: ["pending", "confirmed", "shipped"] }, stockRestored: { $ne: true } },
    { $set: { status: "cancelled", stockRestored: true } },
    { new: true }
  );
  if (!claimed) {
    const o = await Order.findById(orderId).lean();
    if (!o) throw new ApiError(404, "Order not found.");
    if (o.status === "cancelled") throw new ApiError(409, "This order is already cancelled — stock was already returned.");
    throw new ApiError(409, `A ${o.status} order cannot be cancelled here. For returns, record a stock adjustment with a reason.`);
  }
  const need = {};
  for (const it of claimed.items) for (const c of it.components || []) need[c.sku] = (need[c.sku] || 0) + (c.quantity || 1) * it.quantity;
  const docs = [];
  for (const [sku, qty] of Object.entries(need)) {
    const d = await Inventory.findOneAndUpdate({ sku }, { $inc: { stock: qty } }, { upsert: true, new: true });
    docs.push({ sku, type: "restock", delta: qty, before: d.stock - qty, after: d.stock, reason: "Order cancelled", orderId, actor });
  }
  if (docs.length) await StockMovement.insertMany(docs, { ordered: false }).catch(() => {});
  return { order: claimed, restored: need };
}

// ── Delete guards ────────────────────────────────────────────────────────────
export async function productReferences(slug) {
  const [orders, bundles, products] = await Promise.all([
    Order.countDocuments({ $or: [{ "items.slug": slug }, { "items.components.productSlug": slug }] }),
    CatalogBundle.countDocuments({ "components.product": slug }),
    CatalogProduct.countDocuments({ slug: { $ne: slug }, $or: [{ "related.crossSell": slug }, { "related.upsell": slug }, { "related.upsellAlt": slug }] }),
  ]);
  return { orders, bundles, products };
}
export async function bundleReferences(slug) {
  return { orders: await Order.countDocuments({ "items.slug": slug }), products: await CatalogProduct.countDocuments({ $or: [{ "related.bundle": slug }, { "related.upsellBundle": slug }] }) };
}

export { CORE_FRAGRANCES };
