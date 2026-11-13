// Safe, repeatable catalogue sync (additive only).
//   node sync-catalog.js             → insert approved products/collections/categories that are MISSING,
//                                      create inventory records at stock 0 for new SKUs
//   node sync-catalog.js --dry-run   → report only, change nothing
// It NEVER overwrites existing products, collections or stock.
import dotenv from "dotenv";
import mongoose from "mongoose";
import { syncCatalog } from "./services/catalogService.js";

dotenv.config();
const dryRun = process.argv.includes("--dry-run");
await mongoose.connect(process.env.MONGODB_URL);
const report = await syncCatalog({ dryRun });
console.log(JSON.stringify(report, null, 2));
await mongoose.disconnect();
