import CatalogProduct from "../models/CatalogProduct.js";
import Review from "../models/Review.js";
import CatalogBundle from "../models/CatalogBundle.js";
import CatalogCategory from "../models/CatalogCategory.js";
import CatalogSettings from "../models/CatalogSettings.js";
import Inventory from "../models/Inventory.js";
import { uploadToBlob } from "../utils/uploadToBlob.js";
import {
  SHIPPING, FRAGRANCES, PENDING, MODES, allowedVariants, availabilityFor, priceCart, bundlePrice, needsOf, mrpOf,
} from "../data/catalog.js";
import Coupon from "../models/Coupon.js";
import {
  getDonationConfig, cleanDonationConfig, findApplicableCoupon, checkDonation, listPublicCoupons, cleanCouponInput,
} from "../services/offersService.js";
import {
  ApiError, loadCtx, loadAdminCtx, loadStock, syncCatalog, validateProductInput, validateBundleInput, adminListProducts, adminListBundles,
  inventoryList, inventorySummary, setStock, adjustStock, bulkSetStock, stockMovements, productReferences, bundleReferences, getSettings,
} from "../services/catalogService.js";

// One response format everywhere: { success: true, ... } | { success: false, message, errors?: [{field,message}] }
const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    if (e instanceof ApiError) return res.status(e.status).json({ success: false, message: e.message, errors: e.details });
    if (e?.code === 11000) return res.status(409).json({ success: false, message: "Duplicate value — a product or SKU with that identifier already exists." });
    console.error("catalog error:", e);
    res.status(500).json({ success: false, message: "Something went wrong. Nothing was changed — please try again." });
  }
};
const actorOf = (req) => String(req.userId || "admin");
const invalid = (errors) => {
  throw new ApiError(422, errors[0]?.message || "Please fix the highlighted fields.", errors);
};

// ── Public ───────────────────────────────────────────────────────────────────
const publicProduct = (p) => {
  const contents = [["Quantity", p.packQuantity], ["Net weight", p.netWeight], ...(p.contents || []).map((c) => [c.label, c.value])].filter(([, v]) => v);
  return {
    slug: p.slug, name: p.name, category: p.category, price: p.price, mrp: p.mrp > p.price ? p.mrp : 0, mode: p.mode, format: p.format,
    variants: p.variants.map((v) => ({ key: v.key, label: v.label, fragrances: v.fragrances })),
    tagline: p.tagline, description: p.description, intention: p.intention || "", copyPending: !!p.copyPending,
    pack: p.pack, contents, fitNote: p.fitNote || "", materials: p.materials || "", usage: p.usage || "", safety: p.safety || "", storage: p.storage || "",
    faqs: p.faqs || [], image: p.image, gallery: p.gallery || [], seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "",
    related: p.related || {},
    aplusContent: p.aplusContent || [],
  };
};

export const getCatalog = wrap(async (req, res) => {
  const [ctx, stock, settings, donation] = await Promise.all([loadCtx(), loadStock(), getSettings(), getDonationConfig()]);
  // Real review averages for the shop cards (one grouped query; a failure just means no stars are shown)
  const ratings = {};
  try {
    const rows = await Review.aggregate([{ $group: { _id: "$productId", count: { $sum: 1 }, average: { $avg: "$rating" } } }]);
    rows.forEach((r) => { ratings[r._id] = { count: r.count, average: Math.round(r.average * 10) / 10 }; });
  } catch { /* ignore */ }
  const bundles = ctx.bundles
    .map((b) => ({ b, price: bundlePrice(ctx, b) }))
    .filter(({ price }) => price !== null)
    .map(({ b, price }) => ({
      slug: b.slug, name: b.name, price, mrp: Math.max(bundlePrice(ctx, b, undefined, mrpOf) || 0, price) > price ? bundlePrice(ctx, b, undefined, mrpOf) : 0, group: b.group, tagline: b.tagline, description: b.description, needs: b.needs,
      image: b.image || "", gallery: b.gallery || [], aplusContent: b.aplusContent || [],
      featured: !!b.featured, priority: b.launchPriority || null, homeModule: b.homeModule || "", sortOrder: b.sortOrder,
      components: b.components.map((c) => ({ product: c.product || null, bracelet: !!c.bracelet, via: c.via || null, variant: c.variant || null })),
    }));
  res.json({
    success: true,
    shipping: SHIPPING,
    categories: ctx.categories.map((c) => ({ id: c.id, label: c.label, blurb: c.blurb })),
    fragrances: FRAGRANCES,
    products: ctx.products.filter((p) => p.price > 0).map(publicProduct),
    bundles,
    availability: availabilityFor(stock, ctx),
    shopFilters: settings.shopFilters,
    donation: donation.enabled ? donation : null,
    ratings,
  });
});

// Prices a cart and (optionally) a coupon code + donation. The same maths runs again at checkout.
export const priceCartHandler = wrap(async (req, res) => {
  const [ctx, stock] = await Promise.all([loadCtx(), loadStock()]);
  const base = priceCart(req.body?.items, stock, ctx);
  const { coupon, error: couponError } = await findApplicableCoupon(req.body?.couponCode, base.subtotal);
  const { amount: donation, error: donationError } = await checkDonation(req.body?.donation);
  const priced = priceCart(req.body?.items, stock, ctx, { coupon, donation });
  res.json({
    success: true, shippingRule: SHIPPING, ...priced,
    coupon: coupon ? { code: coupon.code, title: coupon.title } : null, couponError, donationError,
  });
});

// Coupons listed under "Apply Coupons" (visible ones only; `subtotal` shows what each would save on this bag)
export const publicCoupons = wrap(async (req, res) => {
  const subtotal = Math.max(0, parseInt(req.query.subtotal, 10) || 0);
  res.json({ success: true, coupons: await listPublicCoupons(subtotal) });
});

// ── Admin: bulk product discount ─────────────────────────────────────────────
// Sets each product's MRP so that its current selling price is `percent` below it (or clears the MRP).
// Selling prices never change. Scope: every product, or one category.
export const adminBulkDiscount = wrap(async (req, res) => {
  const clear = req.body?.clear === true;
  const percent = Number(req.body?.percent);
  if (!clear && (!Number.isInteger(percent) || percent < 1 || percent > 90)) throw new ApiError(422, "Discount must be a whole number between 1 and 90.");
  const category = String(req.body?.category || "").trim();
  const q = { status: { $ne: "archived" }, price: { $gt: 0 }, ...(category ? { category } : {}) };
  const products = await CatalogProduct.find(q, "slug price").lean();
  if (!products.length) throw new ApiError(404, "No products match.");
  await CatalogProduct.bulkWrite(products.map((p) => ({
    updateOne: { filter: { slug: p.slug }, update: { $set: { mrp: clear ? 0 : Math.round(p.price / (1 - percent / 100)) } } },
  })));
  res.json({
    success: true, count: products.length,
    message: clear ? `Discount removed from ${products.length} product(s).` : `${percent}% discount applied to ${products.length} product(s). Selling prices are unchanged.`,
  });
});

// ── Admin: coupons ───────────────────────────────────────────────────────────
export const adminCoupons = wrap(async (req, res) => {
  res.json({ success: true, coupons: await Coupon.find().sort({ createdAt: -1 }).lean() });
});
export const adminCreateCoupon = wrap(async (req, res) => {
  const d = cleanCouponInput(req.body);
  if (await Coupon.exists({ code: d.code })) throw new ApiError(409, `Coupon ${d.code} already exists.`);
  const c = await Coupon.create(d);
  res.status(201).json({ success: true, message: `Coupon ${c.code} created.`, coupon: c });
});
export const adminUpdateCoupon = wrap(async (req, res) => {
  const existing = await Coupon.findOne({ code: String(req.params.code).toUpperCase() });
  if (!existing) throw new ApiError(404, "Coupon not found.");
  Object.assign(existing, cleanCouponInput(req.body, existing));
  await existing.save();
  res.json({ success: true, message: `Coupon ${existing.code} saved.`, coupon: existing });
});
export const adminDeleteCoupon = wrap(async (req, res) => {
  const r = await Coupon.deleteOne({ code: String(req.params.code).toUpperCase() });
  if (!r.deletedCount) throw new ApiError(404, "Coupon not found.");
  res.json({ success: true, message: "Coupon deleted. Past orders keep their record." });
});

// ── Admin: products ──────────────────────────────────────────────────────────
export const adminProducts = wrap(async (req, res) => {
  const { search = "", status = "", category = "" } = req.query;
  const items = await adminListProducts({ search: String(search), status: String(status), category: String(category) });
  const categories = await CatalogCategory.find({}).sort({ sortOrder: 1 }).lean();
  const bundleRows = await CatalogBundle.find({ status: { $ne: "archived" } }, "slug name").lean();
  const pickers = await CatalogProduct.find({ status: { $ne: "archived" } }, "slug name").sort({ sortOrder: 1 }).lean();
  res.json({ success: true, items, categories, bundles: bundleRows, products: pickers, modes: MODES, allowedVariants: Object.fromEntries(MODES.map((m) => [m, allowedVariants(m)])), pending: PENDING });
});

export const adminProduct = wrap(async (req, res) => {
  const p = await CatalogProduct.findOne({ slug: req.params.slug }).lean();
  if (!p) throw new ApiError(404, "Product not found.");
  res.json({ success: true, item: p });
});

const ensureInventory = async (variants) => {
  for (const v of variants) await Inventory.updateOne({ sku: v.sku }, { $setOnInsert: { sku: v.sku, stock: 0 } }, { upsert: true });
};

export const createProduct = wrap(async (req, res) => {
  const { errors, data } = await validateProductInput(req.body || {});
  if (errors.length) invalid(errors);
  const doc = await CatalogProduct.create(data);
  await ensureInventory(doc.variants); // new SKUs start at 0 — never an arbitrary quantity
  res.status(201).json({ success: true, message: `"${doc.name}" was created. Its SKUs start at 0 stock — enter the physical quantity in Inventory.`, item: doc });
});

export const updateProduct = wrap(async (req, res) => {
  const existing = await CatalogProduct.findOne({ slug: req.params.slug }).lean();
  if (!existing) throw new ApiError(404, "Product not found.");
  const { errors, data } = await validateProductInput(req.body || {}, { existing });
  if (errors.length) invalid(errors);
  const { slug, ...fields } = data; // slug is immutable; stock is never touched here
  const doc = await CatalogProduct.findOneAndUpdate({ slug: existing.slug }, { $set: fields }, { new: true });
  await ensureInventory(doc.variants); // only creates records for newly added variants (existing stock untouched)
  res.json({ success: true, message: `"${doc.name}" was saved and is live on the storefront.`, item: doc });
});

export const setProductStatus = wrap(async (req, res) => {
  const status = String(req.body?.status || "");
  if (!["active", "inactive", "archived"].includes(status)) throw new ApiError(400, "Invalid status.");
  const p = await CatalogProduct.findOne({ slug: req.params.slug });
  if (!p) throw new ApiError(404, "Product not found.");
  if (status === "active" && !p.variants.some((v) => v.active !== false)) throw new ApiError(422, "Activate at least one variant first.");
  p.status = status;
  await p.save();
  const msg = { active: "is now live", inactive: "is hidden from the storefront", archived: "was archived (orders and stock history are preserved)" }[status];
  res.json({ success: true, message: `"${p.name}" ${msg}.`, item: p });
});

export const deleteProduct = wrap(async (req, res) => {
  const p = await CatalogProduct.findOne({ slug: req.params.slug }).lean();
  if (!p) throw new ApiError(404, "Product not found.");
  const refs = await productReferences(p.slug);
  if (refs.orders || refs.bundles || refs.products) {
    const why = [refs.orders && `${refs.orders} past order(s)`, refs.bundles && `${refs.bundles} collection(s)`, refs.products && `${refs.products} product recommendation(s)`].filter(Boolean).join(", ");
    throw new ApiError(409, `"${p.name}" cannot be permanently deleted — it is referenced by ${why}. Archive it instead.`);
  }
  const skus = p.variants.map((v) => v.sku);
  const withStock = await Inventory.find({ sku: { $in: skus }, stock: { $gt: 0 } }).lean();
  if (withStock.length) throw new ApiError(409, `Cannot delete — ${withStock.map((i) => `${i.sku} still has ${i.stock} unit(s)`).join(", ")}. Set stock to 0 first, or archive.`);
  await CatalogProduct.deleteOne({ slug: p.slug });
  await Inventory.deleteMany({ sku: { $in: skus } });
  res.json({ success: true, message: `"${p.name}" was permanently deleted.` });
});

// ── Admin: bundles ───────────────────────────────────────────────────────────
export const adminBundles = wrap(async (req, res) => {
  const items = await adminListBundles();
  const products = await CatalogProduct.find({ status: { $ne: "archived" } }, "slug name mode price variants.key variants.label").sort({ sortOrder: 1 }).lean();
  res.json({ success: true, items, products, featuredCount: items.filter((b) => b.featured).length });
});

export const createBundle = wrap(async (req, res) => {
  const { errors, data } = await validateBundleInput(req.body || {});
  if (errors.length) invalid(errors);
  const doc = await CatalogBundle.create(data);
  res.status(201).json({ success: true, message: `Collection "${doc.name}" was created.`, item: doc });
});

export const updateBundle = wrap(async (req, res) => {
  const existing = await CatalogBundle.findOne({ slug: req.params.slug }).lean();
  if (!existing) throw new ApiError(404, "Collection not found.");
  const { errors, data } = await validateBundleInput(req.body || {}, { existing });
  if (errors.length) invalid(errors);
  const { slug, ...fields } = data;
  const doc = await CatalogBundle.findOneAndUpdate({ slug: existing.slug }, { $set: fields }, { new: true });
  res.json({ success: true, message: `Collection "${doc.name}" was saved.`, item: doc });
});

export const patchBundle = wrap(async (req, res) => {
  const b = await CatalogBundle.findOne({ slug: req.params.slug }).lean();
  if (!b) throw new ApiError(404, "Collection not found.");
  const merged = { ...b, ...(req.body?.status !== undefined && { status: req.body.status }), ...(req.body?.featured !== undefined && { featured: !!req.body.featured }),
    ...(req.body?.launchPriority !== undefined && { launchPriority: req.body.launchPriority }) };
  const { errors, data } = await validateBundleInput(merged, { existing: b });
  if (errors.length) invalid(errors);
  const { slug, ...fields } = data;
  const doc = await CatalogBundle.findOneAndUpdate({ slug: b.slug }, { $set: fields }, { new: true });
  res.json({ success: true, message: `Collection "${doc.name}" updated.`, item: doc });
});

export const deleteBundle = wrap(async (req, res) => {
  const b = await CatalogBundle.findOne({ slug: req.params.slug }).lean();
  if (!b) throw new ApiError(404, "Collection not found.");
  const refs = await bundleReferences(b.slug);
  if (refs.orders || refs.products) throw new ApiError(409, `"${b.name}" is referenced by ${refs.orders} past order(s) / ${refs.products} product recommendation(s). Deactivate or archive it instead.`);
  await CatalogBundle.deleteOne({ slug: b.slug });
  res.json({ success: true, message: `Collection "${b.name}" was permanently deleted.` });
});

// ── Admin: categories ────────────────────────────────────────────────────────
export const adminCategories = wrap(async (req, res) => {
  res.json({ success: true, items: await CatalogCategory.find({}).sort({ sortOrder: 1 }).lean() });
});
export const saveCategory = wrap(async (req, res) => {
  const id = String(req.params.id || req.body?.id || "").trim().toLowerCase();
  const label = String(req.body?.label || "").trim();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) throw new ApiError(422, "Category id must be lowercase letters, numbers and hyphens.");
  if (!label) throw new ApiError(422, "Category name is required.");
  const fields = { label, blurb: String(req.body?.blurb || "").trim().slice(0, 200), sortOrder: Number(req.body?.sortOrder) || 0, active: req.body?.active !== false };
  if (req.method === "POST") {
    if (await CatalogCategory.exists({ id })) throw new ApiError(409, `Category "${id}" already exists.`);
    return res.status(201).json({ success: true, message: "Category created.", item: await CatalogCategory.create({ id, ...fields }) });
  }
  if (fields.active === false && (await CatalogProduct.exists({ category: id, status: "active" }))) throw new ApiError(409, "Cannot hide a category that still has active products.");
  const doc = await CatalogCategory.findOneAndUpdate({ id }, { $set: fields }, { new: true });
  if (!doc) throw new ApiError(404, "Category not found.");
  res.json({ success: true, message: "Category saved.", item: doc });
});

// ── Admin: inventory ─────────────────────────────────────────────────────────
export const adminInventory = wrap(async (req, res) => res.json({ success: true, ...(await inventoryList(req.query)) }));
export const adminInventorySummary = wrap(async (req, res) => res.json({ success: true, ...(await inventorySummary()) }));
export const adminSetStock = wrap(async (req, res) => {
  const r = await setStock(String(req.body?.sku || ""), Number(req.body?.stock), { reason: req.body?.reason, actor: actorOf(req) });
  res.json({ success: true, message: `${r.sku}: stock set to ${r.stock} (was ${r.before}).`, ...r });
});
export const adminAdjustStock = wrap(async (req, res) => {
  const r = await adjustStock(String(req.body?.sku || ""), Number(req.body?.delta), { reason: req.body?.reason, actor: actorOf(req) });
  res.json({ success: true, message: `${r.sku}: stock is now ${r.stock}.`, ...r });
});
export const adminBulkSetStock = wrap(async (req, res) => {
  const r = await bulkSetStock(req.body?.items || [], { reason: req.body?.reason, actor: actorOf(req) });
  const msg = r.failed
    ? `Updated ${r.updated} SKU(s); ${r.failed} failed.`
    : `Updated stock for ${r.updated} SKU(s).`;
  res.json({ success: true, message: msg, ...r });
});
export const adminMovements = wrap(async (req, res) => res.json({ success: true, items: await stockMovements(req.params.sku, 100) }));

// ── Admin: settings / sync / upload ──────────────────────────────────────────
export const adminGetSettings = wrap(async (req, res) => res.json({ success: true, ...(await getSettings()), donation: await getDonationConfig() }));
export const adminPutSettings = wrap(async (req, res) => {
  const patch = {};
  if (req.body?.lowStockThreshold !== undefined) {
    const n = Number(req.body.lowStockThreshold);
    if (!Number.isInteger(n) || n < 0 || n > 10000) throw new ApiError(422, "Low-stock threshold must be a whole number ≥ 0.");
    patch.lowStockThreshold = n;
  }
  if (req.body?.shopFilters && typeof req.body.shopFilters === "object") {
    const keys = ["category", "collection", "fragrance", "format", "price", "intention", "availability"];
    const next = {};
    for (const k of keys) {
      if (typeof req.body.shopFilters[k] === "boolean") next[`shopFilters.${k}`] = req.body.shopFilters[k];
    }
    Object.assign(patch, next);
  }
  if (req.body?.donation && typeof req.body.donation === "object") {
    for (const [k, v] of Object.entries(cleanDonationConfig(req.body.donation))) patch[`donation.${k}`] = v;
  }
  if (!Object.keys(patch).length) throw new ApiError(400, "Nothing to update.");
  await CatalogSettings.updateOne({ key: "main" }, { $set: patch }, { upsert: true });
  const settings = await getSettings();
  res.json({ success: true, message: "Shop settings saved.", ...settings, donation: await getDonationConfig() });
});
export const adminSync = wrap(async (req, res) => {
  const report = await syncCatalog({ dryRun: !!req.body?.dryRun });
  const c = report.created;
  res.json({ success: true, message: report.dryRun ? "Dry run complete — nothing was changed." : `Sync complete: ${c.products} product(s), ${c.bundles} collection(s), ${c.categories} categor(ies), ${c.inventory} inventory record(s) added. Nothing existing was overwritten.`, report });
});
export const adminUpload = wrap(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image received.");
  if (!/^image\/(png|jpe?g|webp|gif|avif)$/.test(req.file.mimetype)) throw new ApiError(415, "Only PNG, JPG, WEBP, GIF or AVIF images are allowed.");
  res.json({ success: true, url: await uploadToBlob(req.file, "catalog") });
});

export { loadAdminCtx, needsOf };
