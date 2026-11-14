// One-off: ensure Pearl is ₹1,101 and combined RQ+RH uses interim packshot.
import dotenv from "dotenv";
import mongoose from "mongoose";
import CatalogProduct from "./models/CatalogProduct.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URL);

const updates = [
  { slug: "freshwater-pearl-bracelet", $set: { price: 1101 } },
  { slug: "rose-quartz-rhodonite-bracelet", $set: { image: "/Products/Product mala 1.png", price: 1101 } },
];

for (const u of updates) {
  const r = await CatalogProduct.updateOne({ slug: u.slug }, { $set: u.$set });
  const doc = await CatalogProduct.findOne({ slug: u.slug }, "slug name price image").lean();
  console.log(JSON.stringify({ slug: u.slug, matched: r.matchedCount, modified: r.modifiedCount, product: doc }, null, 2));
}

await mongoose.disconnect();
