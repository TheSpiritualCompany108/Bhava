/**
 * Merge standalone Rose Quartz + Rhodonite into one mixed-stone bracelet (SB-RQ-RH).
 * - Archives old products
 * - Creates / updates combined product from seed
 * - Moves inventory stock onto SB-RQ-RH when possible
 * - Updates Complete Bead Collection components
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import CatalogProduct from "./models/CatalogProduct.js";
import CatalogBundle from "./models/CatalogBundle.js";
import Inventory from "./models/Inventory.js";
import { SEED_PRODUCTS, SEED_BUNDLES } from "./data/catalogSeed.js";

dotenv.config();

const OLD = ["rose-quartz-bracelet", "rhodonite-bracelet"];
const COMBINED = "rose-quartz-rhodonite-bracelet";
const NEW_SKU = "SB-RQ-RH";
const OLD_SKUS = ["SB-RQ", "SB-RH"];

await mongoose.connect(process.env.MONGODB_URL);

const seed = SEED_PRODUCTS.find((p) => p.slug === COMBINED);
if (!seed) throw new Error("Combined product missing from seed");

// Sum stock from old SKUs → new SKU
let movedStock = 0;
for (const sku of OLD_SKUS) {
  const row = await Inventory.findOne({ sku }).lean();
  if (row?.stock) movedStock += Number(row.stock) || 0;
}
await Inventory.updateOne(
  { sku: NEW_SKU },
  { $setOnInsert: { sku: NEW_SKU }, $set: { stock: movedStock } },
  { upsert: true }
);
for (const sku of OLD_SKUS) {
  await Inventory.deleteOne({ sku });
}

// Archive old products (free SKU unique index by rewriting variants off those SKUs)
for (const slug of OLD) {
  const r = await CatalogProduct.updateOne(
    { slug },
    {
      $set: {
        status: "archived",
        name: slug.includes("rose") ? "Rose Quartz Bracelet (archived)" : "Rhodonite Bracelet (archived)",
        approvalNotes: "Merged into rose-quartz-rhodonite-bracelet (SB-RQ-RH) per master playbook.",
        variants: [{ key: "default", label: "Default", sku: `ARCHIVED-${slug.toUpperCase().replace(/-/g, "")}`, fragrances: [], active: false }],
      },
    }
  );
  console.log("archive", slug, r.matchedCount, r.modifiedCount);
}

// Upsert combined product
const existing = await CatalogProduct.findOne({ slug: COMBINED });
if (existing) {
  await CatalogProduct.updateOne({ slug: COMBINED }, { $set: { ...seed, status: "active" } });
  console.log("updated", COMBINED);
} else {
  await CatalogProduct.create({ ...seed, status: "active" });
  console.log("created", COMBINED);
}

// Update complete bead collection components from seed
const beadBundle = SEED_BUNDLES.find((b) => b.slug === "the-complete-bead-collection");
if (beadBundle) {
  const br = await CatalogBundle.updateOne(
    { slug: "the-complete-bead-collection" },
    { $set: { components: beadBundle.components, description: beadBundle.description } }
  );
  console.log("bundle complete-bead", br.matchedCount, br.modifiedCount);
}

const live = await CatalogProduct.find(
  { category: "sacred-beads", status: { $ne: "archived" } },
  "slug name variants.sku status price"
).lean();
console.log(JSON.stringify({ movedStock, bracelets: live }, null, 2));

await mongoose.disconnect();
