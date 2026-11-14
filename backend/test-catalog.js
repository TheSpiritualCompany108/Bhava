// Run: node test-catalog.js
// Uses a throwaway local database ("bhava_catalog_test", dropped at start and end). Never touches your real DB.
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  buildCtx, resolveLine, priceCart, shippingFor, availabilityFor, limitsFor, bundlePrice, SHIPPING, needsOf,
} from "./data/catalog.js";
import { SEED_PRODUCTS, SEED_BUNDLES, SEED_CATEGORIES, DOCUMENT_BUNDLE_PRICES } from "./data/catalogSeed.js";

let n = 0;
const ok = (name) => { n++; console.log("  ✓", name); };
const t = (name, fn) => { fn(); ok(name); };

const ctx = buildCtx({ products: SEED_PRODUCTS, bundles: SEED_BUNDLES, categories: SEED_CATEGORIES });
const ALL_SKUS = SEED_PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku));
const allStock = (v) => Object.fromEntries(ALL_SKUS.map((s) => [s, v]));
const B = (slug, selection, quantity = 1) => ({ kind: "bundle", slug, selection, quantity });
const SEL = { fragrance: "guggal", camphor: "guggal", pair: "guggal-oud" };
const braceletSel = (slug) => ({ ...SEL, bracelets: ctx.bracelets.slice(0, ctx.getBundle(slug).needs.bracelets) });

console.log("Approved catalogue (seed)");
t("14 products, correct prices, 27 SKUs, all unique", () => {
  assert.equal(SEED_PRODUCTS.length, 14);
  assert.deepEqual(Object.fromEntries(SEED_PRODUCTS.map((p) => [p.slug, p.price])), {
    "sacred-notes-discovery": 251, "sacred-notes-duo": 501, "sacred-notes-triveni": 501, "pure-ritual-single": 351, "pure-ritual-twin": 701,
    "pure-ritual-27": 501, "sacred-ember": 401, "sacred-sambrani-offering-cups": 501, "camphor-ritual-duo": 351,
    "tiger-eye-bracelet": 1101, "evil-eye-bracelet": 1101, "dhan-yog-bracelet": 1101, "freshwater-pearl-bracelet": 1101, "rose-quartz-rhodonite-bracelet": 1101,
  });
  assert.equal(ALL_SKUS.length, 27);
  assert.equal(new Set(ALL_SKUS).size, 27);
});
t("variant matrix + SKU register", () => {
  const keys = (s) => ctx.getProduct(s).variants.map((v) => `${v.key}=${v.sku}`).join(",");
  assert.equal(keys("sacred-notes-discovery"), "guggal=SN-DIS-GUG,oud=SN-DIS-OUD,sandalwood=SN-DIS-SAN");
  assert.equal(keys("sacred-notes-duo"), "guggal-oud=SN-DUO-GO,guggal-sandalwood=SN-DUO-GS,oud-sandalwood=SN-DUO-OS");
  assert.equal(keys("sacred-notes-triveni"), "all=SN-TRI");
  assert.equal(keys("pure-ritual-twin"), "guggal-oud=PR-TWIN-GO,guggal-sandalwood=PR-TWIN-GS,oud-sandalwood=PR-TWIN-OS");
  assert.equal(keys("pure-ritual-27"), "guggal=PR-27-GUG,oud=PR-27-OUD,sandalwood=PR-27-SAN");
  assert.equal(keys("sacred-ember"), "guggal=SE-GUG,oud=SE-OUD,sandalwood=SE-SAN");
  assert.equal(keys("sacred-sambrani-offering-cups"), "guggal=SSC-21-GUG");
  assert.equal(keys("camphor-ritual-duo"), "guggal=CRD-44-GUG,sandalwood=CRD-44-SAN");
});
t("product facts: quantities, confirmed weights only, no invented Triveni split", () => {
  const q = (s) => `${ctx.getProduct(s).packQuantity}|${ctx.getProduct(s).netWeight}`;
  assert.equal(q("sacred-notes-discovery"), "21 sticks|21 g");
  assert.equal(q("camphor-ritual-duo"), "2 tablets × 22 g|44 g total");
  assert.equal(ctx.getProduct("pure-ritual-27").packQuantity, "27 units");
  assert.equal(ctx.getProduct("pure-ritual-single").netWeight, ""); // unverified weight left blank
  assert.doesNotMatch(JSON.stringify(ctx.getProduct("sacred-notes-triveni")), /\b\d+ (sticks )?of (Guggal|Oud|Sandalwood)/i);
});
t("sambrani/camphor/pair rules enforced", () => {
  const r = (o) => resolveLine({ kind: "product", ...o }, ctx);
  assert.equal(r({ slug: "sacred-sambrani-offering-cups", variant: "oud" }).ok, false);
  assert.equal(r({ slug: "sacred-sambrani-offering-cups" }).line.components[0].sku, "SSC-21-GUG");
  assert.equal(r({ slug: "camphor-ritual-duo", variant: "oud" }).ok, false);
  assert.equal(r({ slug: "camphor-ritual-duo" }).ok, false);
  assert.equal(r({ slug: "sacred-notes-discovery", variant: "guggal-oud" }).ok, false);
  assert.equal(r({ slug: "sacred-notes-duo", variant: "oud" }).ok, false);
});

console.log("30 bundles");
t("exactly 30 bundles, 8 featured with launch priorities 1–8", () => {
  assert.equal(SEED_BUNDLES.length, 30);
  assert.equal(new Set(SEED_BUNDLES.map((b) => b.slug)).size, 30);
  const f = SEED_BUNDLES.filter((b) => b.featured);
  assert.equal(f.length, 8);
  assert.deepEqual(f.map((b) => b.launchPriority).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(Object.fromEntries(f.map((b) => [b.launchPriority, b.slug])), {
    1: "the-classic-pair", 2: "the-three-format-discovery", 3: "the-sacred-smoke-pair", 4: "the-complete-fragrance-ritual",
    5: "the-personal-ritual-pair", 6: "the-dual-intention", 7: "the-sacred-offering-set", 8: "the-complete-home-ritual-set",
  });
  assert.equal(SEED_BUNDLES.filter((b) => !b.featured).length, 22);
});
t("every bundle price (computed from components) equals the document price", () => {
  for (const b of SEED_BUNDLES) {
    assert.equal(bundlePrice(ctx, b), DOCUMENT_BUNDLE_PRICES[b.slug], b.slug);
    const r = resolveLine(B(b.slug, braceletSel(b.slug)), ctx);
    assert.ok(r.ok, `${b.slug}: ${r.message}`);
    assert.equal(r.line.unitPrice, DOCUMENT_BUNDLE_PRICES[b.slug], `${b.slug} resolved total`);
  }
  assert.equal(Object.keys(DOCUMENT_BUNDLE_PRICES).length, 30);
});
t("bracelet-choice listing uses cheapest bracelet; checkout uses the selected SKUs", () => {
  const products = ctx.products.map((p) => (p.slug === "freshwater-pearl-bracelet" ? { ...p, price: 2100 } : p));
  const ctx2 = buildCtx({ products, bundles: SEED_BUNDLES, categories: SEED_CATEGORIES });
  assert.equal(bundlePrice(ctx2, ctx2.getBundle("the-dual-intention")), 2202);
  assert.equal(bundlePrice(ctx2, ctx2.getBundle("the-personal-ritual-pair")), 1352);
  assert.equal(bundlePrice(ctx2, ctx2.getBundle("the-sacred-offering-set")), 1602);
  assert.equal(resolveLine(B("the-dual-intention", { bracelets: ["tiger-eye-bracelet", "evil-eye-bracelet"] }), ctx2).line.unitPrice, 2202);
  assert.equal(resolveLine(B("the-dual-intention", { bracelets: ["tiger-eye-bracelet", "freshwater-pearl-bracelet"] }), ctx2).line.unitPrice, 3201);
  assert.equal(bundlePrice(ctx2, ctx2.getBundle("the-dual-intention"), { bracelets: ["tiger-eye-bracelet", "evil-eye-bracelet"] }), 2202);
});
t("fragrance propagates; sambrani Guggal; camphor independent; pairs; fixed components", () => {
  const sku = (slug, sel) => resolveLine(B(slug, sel), ctx).line.components.map((c) => c.sku);
  assert.deepEqual(sku("the-complete-home-ritual-set", { fragrance: "oud", camphor: "sandalwood" }), ["SN-DIS-OUD", "PR-SGL-OUD", "SE-OUD", "SSC-21-GUG", "CRD-44-SAN"]);
  assert.deepEqual(sku("the-sacred-smoke-pair", { camphor: "guggal" }), ["SSC-21-GUG", "CRD-44-GUG"]);
  assert.deepEqual(sku("the-fragrance-and-intention-set", { pair: "oud-sandalwood", bracelets: ["rose-quartz-rhodonite-bracelet"] }), ["SB-RQ-RH", "SN-DUO-OS"]);
  assert.deepEqual(sku("the-inner-stillness-set", { pair: "guggal-sandalwood", bracelets: ["tiger-eye-bracelet"] }), ["SB-TE", "PR-TWIN-GS"]);
  assert.deepEqual(sku("the-threefold-intention-set", { bracelets: ["tiger-eye-bracelet"] }), ["SB-TE", "SN-TRI"]);
  assert.deepEqual(sku("the-intention-and-abundance-collection", { camphor: "sandalwood" }), ["SB-DY", "SN-DIS-GUG", "SSC-21-GUG", "CRD-44-SAN"]);
  assert.deepEqual(sku("the-protection-and-peace-collection", { camphor: "guggal" }), ["SB-EE", "PR-SGL-GUG", "SSC-21-GUG", "CRD-44-GUG"]);
  assert.equal(sku("the-complete-bead-collection", {}).length, 5);
  assert.deepEqual(sku("the-everyday-sacred-set", { fragrance: "oud", camphor: "guggal", bracelets: ["tiger-eye-bracelet"] }), ["SB-TE", "SN-DIS-OUD", "CRD-44-GUG"]);
});
t("selection validation: duplicates, counts, invalid values", () => {
  assert.equal(resolveLine(B("the-classic-pair", {}), ctx).ok, false);
  assert.equal(resolveLine(B("the-classic-pair", { fragrance: "rose" }), ctx).ok, false);
  assert.equal(resolveLine(B("the-sacred-smoke-pair", { camphor: "oud" }), ctx).ok, false);
  assert.equal(resolveLine(B("the-dual-intention", { bracelets: ["tiger-eye-bracelet", "tiger-eye-bracelet"] }), ctx).ok, false);
  assert.equal(resolveLine(B("the-dual-intention", { bracelets: ["tiger-eye-bracelet"] }), ctx).ok, false);
  assert.equal(resolveLine(B("the-dual-intention", { bracelets: ["tiger-eye-bracelet", "sacred-ember"] }), ctx).ok, false);
  assert.equal(resolveLine(B("the-triple-intention", { bracelets: ["tiger-eye-bracelet", "evil-eye-bracelet", "tiger-eye-bracelet"] }), ctx).ok, false);
  assert.equal(resolveLine(B("the-fragrance-and-intention-set", { bracelets: ["tiger-eye-bracelet"], pair: "guggal" }), ctx).ok, false);
  assert.deepEqual(needsOf(ctx.getBundle("the-everyday-sacred-set").components), { fragrance: true, camphor: true, pair: false, bracelets: 1 });
});
t("no discounts / client price ignored / shipping ₹50 below ₹501, free at ₹501+", () => {
  assert.equal(resolveLine({ kind: "product", slug: "sacred-ember", variant: "oud", price: 1 }, ctx).line.unitPrice, 401);
  assert.equal(shippingFor(500), 50); assert.equal(shippingFor(501), 0); assert.equal(shippingFor(0), 0);
  const stock = allStock(10);
  const one = priceCart([{ kind: "product", slug: "sacred-notes-discovery", variant: "guggal", quantity: 1 }], stock, ctx);
  assert.equal(one.total, 301); assert.equal(one.shipping, SHIPPING.fee);
  assert.equal(priceCart([{ kind: "product", slug: "pure-ritual-27", variant: "oud" }], stock, ctx).shipping, 0);
});
t("stock rules: bundle blocked if any component out; no oversell across lines; limits cap at stock", () => {
  const stock = allStock(5); stock["SE-OUD"] = 0;
  assert.equal(priceCart([B("the-three-format-discovery", { fragrance: "oud" })], stock, ctx).allOk, false);
  assert.equal(priceCart([B("the-three-format-discovery", { fragrance: "guggal" })], stock, ctx).allOk, true);
  const a = availabilityFor(stock, ctx);
  assert.equal(a.bundles["the-three-format-discovery"].fragrance.oud, false);
  assert.equal(a.products["sacred-ember"].oud, false);
  const s2 = allStock(0); s2["SN-DIS-GUG"] = 1; s2["PR-SGL-GUG"] = 5;
  const r = priceCart([{ kind: "product", slug: "sacred-notes-discovery", variant: "guggal" }, B("the-classic-pair", { fragrance: "guggal" })], s2, ctx);
  assert.deepEqual(r.lines.map((l) => l.ok), [true, false]);
  const s3 = allStock(50); s3["SN-DIS-OUD"] = 3; s3["SSC-21-GUG"] = 5;
  assert.equal(limitsFor(s3, ctx).products["sacred-notes-discovery"].oud, 3);
  assert.equal(limitsFor(s3, ctx).bundles["the-complete-fragrance-ritual"].fixed, 5);
  assert.equal(priceCart([{ kind: "product", slug: "sacred-ember", variant: "guggal" }], {}, ctx).allOk, false);
});

// ── Database-backed behaviour ────────────────────────────────────────────────
console.log("Database: sync, products, inventory, orders (bhava_catalog_test)");
await mongoose.connect("mongodb://127.0.0.1:27017/bhava_catalog_test");
await mongoose.connection.dropDatabase();
const M = async (p) => (await import(p)).default;
const Inventory = await M("./models/Inventory.js");
const StockMovement = await M("./models/StockMovement.js");
const CatalogProduct = await M("./models/CatalogProduct.js");
const CatalogBundle = await M("./models/CatalogBundle.js");
const Order = await M("./models/Order.js");
const svc = await import("./services/catalogService.js");
const cc = await import("./controllers/catalogController.js");
const { checkout, updateOrderStatus } = await import("./controllers/orderController.js");

const call = async (handler, { body = {}, params = {}, query = {}, file } = {}) => {
  const out = {};
  const res = { status(c) { out.status = c; return this; }, json(b) { out.body = b; out.status ||= 200; return this; } };
  await handler({ body, params, query, file, userId: new mongoose.Types.ObjectId() }, res);
  return out;
};
const stockOf = async (sku) => (await Inventory.findOne({ sku }))?.stock ?? null;

// Simulate the real DB state: stock the owner already entered, before any catalogue exists
await Inventory.insertMany([{ sku: "SN-DIS-GUG", stock: 2 }, { sku: "SN-DIS-OUD", stock: 5 }, { sku: "PR-SGL-SAN", stock: 1 }]);

let rep = await svc.syncCatalog();
assert.deepEqual(rep.created, { categories: 5, products: 14, bundles: 30, inventory: 24 });
assert.equal(await stockOf("SN-DIS-GUG"), 2); assert.equal(await stockOf("SN-DIS-OUD"), 5); assert.equal(await stockOf("PR-SGL-SAN"), 1);
assert.equal(await stockOf("SE-GUG"), 0);
ok("first sync loads 14 products / 30 bundles / 5 categories; existing stock preserved; new SKUs at 0");

await svc.setStock("SN-DIS-OUD", 9, { reason: "count" });
rep = await svc.syncCatalog();
assert.deepEqual(rep.created, { categories: 0, products: 0, bundles: 0, inventory: 0 });
assert.equal(await stockOf("SN-DIS-OUD"), 9);
assert.equal(await CatalogProduct.countDocuments(), 14); assert.equal(await CatalogBundle.countDocuments(), 30);
ok("re-running sync creates no duplicates and never resets stock");

await CatalogProduct.updateOne({ slug: "sacred-ember" }, { $set: { price: 420, tagline: "Edited in admin" } });
rep = await svc.syncCatalog();
assert.equal((await CatalogProduct.findOne({ slug: "sacred-ember" })).price, 420);
ok("sync never overwrites admin edits");
await CatalogProduct.updateOne({ slug: "sacred-ember" }, { $set: { price: 401 } });

const dupSku = await CatalogProduct.collection.getIndexes().then((i) => Object.keys(i).some((k) => k.includes("variants.sku")));
assert.ok(dupSku);
await assert.rejects(CatalogProduct.create({ ...SEED_PRODUCTS[0], slug: "dup-test", name: "Dup Test", variants: SEED_PRODUCTS[0].variants }), /duplicate key|E11000/);
ok("database enforces unique SKUs (and unique slugs)");

// Public catalogue API reads from MongoDB
let cat = (await call(cc.getCatalog)).body;
assert.equal(cat.products.length, 15); assert.equal(cat.bundles.length, 30); assert.equal(cat.bundles.filter((b) => b.featured).length, 8);
assert.equal(cat.bundles.find((b) => b.slug === "the-complete-home-ritual-set").price, 1855);
assert.equal(cat.products.find((p) => p.slug === "sacred-notes-discovery").contents[0].join("="), "Quantity=21 sticks");
ok("storefront API serves DB products + 30 bundles with computed prices");

// Admin create / validate / edit
const newP = { slug: "test-incense", name: "Test Incense", category: "incense-sticks", price: 199, mode: "single", status: "active", variants: [{ key: "guggal", sku: "TST-GUG" }, { key: "oud", sku: "TST-OUD" }], tagline: "t", description: "d", packQuantity: "10 sticks", image: "/Products/Home Page Incense.png" };
let r = await call(cc.createProduct, { body: newP });
assert.equal(r.status, 201, JSON.stringify(r.body));
assert.equal(await stockOf("TST-GUG"), 0); assert.equal(await stockOf("TST-OUD"), 0);
ok("admin create saves to MongoDB; new SKUs start at 0 stock");
for (const [label, patch, rx] of [
  ["duplicate slug", {}, /already exists/],
  ["duplicate name", { slug: "other-slug", variants: [{ key: "guggal", sku: "OTH-GUG" }] }, /already named/],
  ["duplicate SKU (other product)", { slug: "other-slug", name: "Other Name", variants: [{ key: "guggal", sku: "SN-DIS-GUG" }] }, /already used/],
  ["invalid variant for Sambrani-type", { slug: "sam-x", name: "Sam X", mode: "fixed", variants: [{ key: "oud", sku: "SAMX-OUD" }] }, /not an approved variant/],
  ["camphor Oud", { slug: "camp-x", name: "Camp X", mode: "camphor", variants: [{ key: "oud", sku: "CAMPX-OUD" }] }, /not an approved variant/],
  ["bad price", { slug: "bp", name: "Bad Price", price: -5 }, /Price/],
  ["bad category", { slug: "bc", name: "Bad Cat", category: "nope" }, /category/],
]) {
  const x = await call(cc.createProduct, { body: { ...newP, ...patch } });
  assert.equal(x.status, 422, label + " " + JSON.stringify(x.body));
  assert.match(JSON.stringify(x.body.errors), rx, label);
}
ok("server rejects duplicate slug/name/SKU, invalid variants (Sambrani/Camphor rules), bad price/category");

await svc.setStock("TST-GUG", 7, { reason: "initial count" });
r = await call(cc.updateProduct, { params: { slug: "test-incense" }, body: { ...newP, price: 249, tagline: "Edited", variants: [{ key: "guggal", sku: "TST-GUG" }, { key: "oud", sku: "TST-OUD" }, { key: "sandalwood", sku: "TST-SAN" }] } });
assert.equal(r.status, 200, JSON.stringify(r.body));
const saved = await CatalogProduct.findOne({ slug: "test-incense" });
assert.equal(saved.price, 249); assert.equal(saved.tagline, "Edited"); assert.equal(saved.variants.length, 3);
assert.equal(await stockOf("TST-GUG"), 7, "edit must not reset stock"); assert.equal(await stockOf("TST-SAN"), 0);
cat = (await call(cc.getCatalog)).body;
assert.equal(cat.products.find((p) => p.slug === "test-incense").price, 249);
ok("edit persists in MongoDB, preserves stock, new variant gets a 0-stock record, storefront reflects it");

for (const [label, body, rx] of [
  ["change existing SKU", { ...newP, variants: [{ key: "guggal", sku: "TST-CHANGED" }, { key: "oud", sku: "TST-OUD" }, { key: "sandalwood", sku: "TST-SAN" }] }, /cannot be changed/],
  ["remove variant", { ...newP, variants: [{ key: "guggal", sku: "TST-GUG" }] }, /cannot be removed/],
  ["change type", { ...newP, mode: "pair" }, /cannot be changed/],
]) {
  const x = await call(cc.updateProduct, { params: { slug: "test-incense" }, body });
  assert.equal(x.status, 422, label); assert.match(JSON.stringify(x.body.errors), rx, label);
}
ok("existing SKUs / variants / type are protected from edits");

// Status: inactive hides from storefront and blocks purchase
await call(cc.setProductStatus, { params: { slug: "test-incense" }, body: { status: "inactive" } });
cat = (await call(cc.getCatalog)).body;
assert.ok(!cat.products.some((p) => p.slug === "test-incense"));
await call(cc.setProductStatus, { params: { slug: "test-incense" }, body: { status: "active" } });
ok("inactive products disappear from the storefront; reactivation restores them");

// Inventory: set/adjust/negative/movements/search/filter/sort/summary
await svc.setStock("SE-GUG", 0, {});
await assert.rejects(svc.adjustStock("SE-GUG", -1, { reason: "x" }), /negative/);
await assert.rejects(svc.adjustStock("SE-GUG", 3, {}), /reason/);
await assert.rejects(svc.setStock("NOT-A-SKU", 5), /Unknown SKU/);
await assert.rejects(svc.setStock("SE-GUG", -2), /whole number/);
let adj = await svc.adjustStock("SE-GUG", 4, { reason: "Received stock", actor: "tester" });
assert.equal(adj.stock, 4);
adj = await svc.adjustStock("SE-GUG", -1, { reason: "Damaged" });
assert.equal(adj.stock, 3);
const mv = await svc.stockMovements("SE-GUG");
assert.deepEqual(mv.slice(0, 2).map((m) => `${m.type}:${m.delta}:${m.after}:${m.reason}`), ["adjust:-1:3:Damaged", "adjust:4:4:Received stock"]);
ok("stock set/adjust: negative blocked, reason required, unknown SKU rejected, movement history recorded");

await svc.setStock("SN-DIS-GUG", 2, {}); await svc.setStock("SN-DIS-SAN", 40, {}); await svc.setStock("SN-DIS-OUD", 0, {});
const q = (query) => svc.inventoryList(query);
assert.deepEqual((await q({ search: "SN-DIS-OUD" })).items.map((i) => i.sku), ["SN-DIS-OUD"]);
assert.ok((await q({ search: "sacred notes discovery" })).items.length === 3);
assert.ok((await q({ search: "sandalwood" })).items.every((i) => i.fragrances.includes("sandalwood")));
assert.ok((await q({ search: "sandalwood" })).total >= 8);
assert.deepEqual((await q({ category: "sambrani-camphor" })).items.map((i) => i.sku).sort(), ["CRD-44-GUG", "CRD-44-SAN", "SSC-21-GUG"]);
assert.ok((await q({ stockStatus: "low" })).items.every((i) => i.stock > 0 && i.stock <= 5));
assert.ok((await q({ stockStatus: "out" })).items.every((i) => i.stock === 0));
assert.ok((await q({ stockStatus: "in" })).items.every((i) => i.stock > 5));
const byStock = (await q({ sort: "stock", order: "desc", limit: 100 })).items.map((i) => i.stock);
assert.deepEqual(byStock, [...byStock].sort((a, b) => b - a));
const p1 = await q({ limit: 10, page: 1 }), p3 = await q({ limit: 10, page: 3 });
assert.equal(p1.items.length, 10); assert.equal(p1.pages, Math.ceil(p1.total / 10)); assert.notEqual(p1.items[0].sku, p3.items[0].sku);
ok("inventory search (name/SKU/fragrance), category/status filters, sorting and pagination run on database data");

const sum = await svc.inventorySummary();
const all = (await q({ limit: 100 })).items;
const rows = (await q({ limit: 100, page: 1 })); // 31 SKUs (28 + 3 test) fit in 1 page of 100
assert.equal(sum.totalSkus, rows.total);
assert.equal(sum.totalProducts, 16);
assert.equal(sum.inStock + sum.lowStock + sum.outOfStock, sum.totalSkus);
assert.equal(sum.totalUnits, all.reduce((s, r) => s + r.stock, 0));
assert.equal(sum.outOfStock, all.filter((r) => r.stock === 0).length);
assert.equal(sum.lowStock, all.filter((r) => r.stock > 0 && r.stock <= sum.lowStockThreshold).length);
ok("dashboard metrics equal the actual database records (products, SKUs, in/low/out, units)");

// Bundles admin
let bx = await call(cc.createBundle, { body: { slug: "test-bundle", name: "Test Bundle", components: [{ product: "sacred-notes-discovery", via: "fragrance" }, { product: "sacred-sambrani-offering-cups", via: "fixed", variant: "oud" }] } });
assert.equal(bx.status, 422);
bx = await call(cc.createBundle, { body: { slug: "test-bundle", name: "Test Bundle", components: [{ product: "sacred-sambrani-offering-cups", via: "fragrance" }] } });
assert.equal(bx.status, 422);
bx = await call(cc.createBundle, { body: { slug: "test-bundle", name: "Test Bundle", status: "active", components: [{ product: "sacred-notes-discovery", via: "fragrance" }, { product: "sacred-sambrani-offering-cups", via: "fixed", variant: "guggal" }] } });
assert.equal(bx.status, 201, JSON.stringify(bx.body));
cat = (await call(cc.getCatalog)).body;
assert.equal(cat.bundles.find((b) => b.slug === "test-bundle").price, 752, "price computed from components (251 + 501)");
await call(cc.updateProduct, { params: { slug: "sacred-notes-discovery" }, body: { ...(await CatalogProduct.findOne({ slug: "sacred-notes-discovery" }).lean()), price: 300 } });
cat = (await call(cc.getCatalog)).body;
assert.equal(cat.bundles.find((b) => b.slug === "test-bundle").price, 801); // follows component price
assert.equal(cat.bundles.find((b) => b.slug === "the-classic-pair").price, 651);
await call(cc.updateProduct, { params: { slug: "sacred-notes-discovery" }, body: { ...(await CatalogProduct.findOne({ slug: "sacred-notes-discovery" }).lean()), price: 251 } });
ok("collections: invalid components rejected, price is computed from component prices (never stored/discounted)");

let fx = await call(cc.patchBundle, { params: { slug: "test-bundle" }, body: { featured: true, launchPriority: 9 } });
assert.equal(fx.status, 422); assert.match(fx.body.message, /Only 8/);
await call(cc.patchBundle, { params: { slug: "the-dual-intention" }, body: { featured: false } });
fx = await call(cc.patchBundle, { params: { slug: "test-bundle" }, body: { featured: true, launchPriority: 9 } });
assert.equal(fx.status, 200);
await call(cc.patchBundle, { params: { slug: "test-bundle" }, body: { featured: false } });
await call(cc.patchBundle, { params: { slug: "the-dual-intention" }, body: { featured: true, launchPriority: 6 } });
assert.equal(await CatalogBundle.countDocuments({ featured: true }), 8);
await call(cc.patchBundle, { params: { slug: "test-bundle" }, body: { status: "inactive" } });
cat = (await call(cc.getCatalog)).body;
assert.ok(!cat.bundles.some((b) => b.slug === "test-bundle"));
ok("only 8 collections can be featured; activate/deactivate hides from the storefront");

// Checkout (DB-driven): stock deduction, edits, inactive
await Inventory.updateMany({}, { $set: { stock: 3 } });
const callCheckout = async (items, addr = {}) => {
  const out = {};
  const res = { status(c) { out.status = c; return this; }, json(b) { out.body = b; out.status ||= 200; return this; } };
  await checkout({ userId: new mongoose.Types.ObjectId(), body: { items, notes: "", paymentMethod: "cod", address: { fullName: "Test User", phone: "9876543210", line1: "12 Test Street", city: "Pune", state: "Maharashtra", pincode: "411001", ...addr } } }, res);
  return out;
};
let o = await callCheckout([B("the-complete-home-ritual-set", { fragrance: "oud", camphor: "sandalwood" })]);
assert.equal(o.status, 201, JSON.stringify(o.body)); assert.equal(o.body.total, 1855); assert.equal(o.body.shipping, 0);
for (const sku of ["SN-DIS-OUD", "PR-SGL-OUD", "SE-OUD", "SSC-21-GUG", "CRD-44-SAN"]) assert.equal(await stockOf(sku), 2, sku);
assert.equal(await stockOf("SN-DIS-GUG"), 3);
const placed = await Order.findById(o.body.orderId);
assert.equal(placed.items[0].components.map((c) => c.sku).join(), "SN-DIS-OUD,PR-SGL-OUD,SE-OUD,SSC-21-GUG,CRD-44-SAN");
assert.equal((await StockMovement.find({ orderId: placed._id })).length, 5);
ok("bundle checkout deducts the exact component SKUs, stores them on the order and logs movements");

o = await callCheckout([{ kind: "product", slug: "sacred-notes-discovery", variant: "guggal", quantity: 1 }]);
assert.equal(o.body.total, 301); // ₹251 + ₹50
ok("single product: ₹251 + ₹50 shipping");

await Inventory.updateOne({ sku: "SE-OUD" }, { stock: 0 });
const keep = await stockOf("SN-DIS-OUD");
o = await callCheckout([B("the-three-format-discovery", { fragrance: "oud" })]);
assert.equal(o.status, 409); assert.equal(await stockOf("SN-DIS-OUD"), keep);
ok("out-of-stock component blocks the bundle; nothing deducted");

await Inventory.updateOne({ sku: "SE-GUG" }, { stock: 1 });
const d0 = await stockOf("SN-DIS-GUG"), p0 = await stockOf("PR-SGL-GUG");
const [g1, g2] = await Promise.all([callCheckout([B("the-three-format-discovery", { fragrance: "guggal" })]), callCheckout([B("the-three-format-discovery", { fragrance: "guggal" })])]);
assert.deepEqual([g1.status, g2.status].sort(), [201, 409]);
assert.equal(await stockOf("SE-GUG"), 0); assert.equal(await stockOf("SN-DIS-GUG"), d0 - 1); assert.equal(await stockOf("PR-SGL-GUG"), p0 - 1);
ok("concurrent orders for the last unit: one wins, loser rolled back, no negative stock");

const before = await stockOf("TST-GUG");
await call(cc.setProductStatus, { params: { slug: "test-incense" }, body: { status: "inactive" } });
o = await callCheckout([{ kind: "product", slug: "test-incense", variant: "guggal", quantity: 1 }]);
assert.equal(o.status, 409); assert.equal(await stockOf("TST-GUG"), before);
await call(cc.setProductStatus, { params: { slug: "test-incense" }, body: { status: "active" } });
await call(cc.updateProduct, { params: { slug: "test-incense" }, body: { ...(await CatalogProduct.findOne({ slug: "test-incense" }).lean()), price: 260, variants: (await CatalogProduct.findOne({ slug: "test-incense" }).lean()).variants } });
o = await callCheckout([{ kind: "product", slug: "test-incense", variant: "guggal", quantity: 1 }]);
assert.equal(o.body.total, 310); // edited ₹260 + ₹50 shipping — admin edit is what checkout charges
ok("inactive products cannot be bought; an admin price edit is what checkout charges");

// Cancellation / restock
const bundleOrder = placed._id;
const beforeCancel = await stockOf("SN-DIS-OUD");
let cx = await call(updateOrderStatus, { params: { id: String(bundleOrder) }, body: { status: "cancelled" } });
assert.equal(cx.status, 200, JSON.stringify(cx.body));
assert.equal(await stockOf("SN-DIS-OUD"), beforeCancel + 1);
for (const sku of ["PR-SGL-OUD", "SE-OUD", "SSC-21-GUG", "CRD-44-SAN"]) assert.ok((await stockOf(sku)) >= 1, sku);
cx = await call(updateOrderStatus, { params: { id: String(bundleOrder) }, body: { status: "cancelled" } });
assert.equal(cx.status, 409);
assert.equal(await stockOf("SN-DIS-OUD"), beforeCancel + 1, "second cancel must not restock again");
cx = await call(updateOrderStatus, { params: { id: String(bundleOrder) }, body: { status: "pending" } });
assert.equal(cx.status, 409);
assert.equal((await StockMovement.find({ orderId: bundleOrder, type: "restock" })).length, 5);
ok("cancelling an order returns each component SKU exactly once (double-cancel and reopen are refused)");

// Delete / archive guards
let dx = await call(cc.deleteProduct, { params: { slug: "sacred-notes-discovery" } });
assert.equal(dx.status, 409);
await call(cc.createProduct, { body: { ...newP, slug: "temp-product", name: "Temp Product", variants: [{ key: "guggal", sku: "TMP-GUG" }] } });
dx = await call(cc.deleteProduct, { params: { slug: "temp-product" } });
assert.equal(dx.status, 200); assert.equal(await stockOf("TMP-GUG"), null);
await call(cc.setProductStatus, { params: { slug: "tiger-eye-bracelet" }, body: { status: "archived" } });
assert.ok((await Order.countDocuments()) >= 3);
assert.equal(await stockOf("SB-TE") !== null, true, "archiving keeps inventory records");
cat = (await call(cc.getCatalog)).body;
assert.ok(!cat.products.some((p) => p.slug === "tiger-eye-bracelet"));
assert.equal(cat.bundles.find((b) => b.slug === "the-complete-bead-collection"), undefined, "bundle needing an archived component disappears");
await call(cc.setProductStatus, { params: { slug: "tiger-eye-bracelet" }, body: { status: "active" } });
ok("delete is blocked when referenced; unreferenced products can be deleted; archive keeps orders/stock and hides dependent collections");

await mongoose.connection.dropDatabase();
await mongoose.disconnect();
console.log(`\nAll ${n} checks passed.`);
