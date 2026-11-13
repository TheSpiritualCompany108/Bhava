import express from "express";
import multer from "multer";
import * as c from "../controllers/catalogController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const admin = [protect, adminOnly]; // every write (and every admin read) requires an authenticated admin

// Public (read-only)
router.get("/", c.getCatalog);
router.post("/cart", c.priceCartHandler);

// Admin — products
router.get("/admin/products", admin, c.adminProducts);
router.get("/admin/products/:slug", admin, c.adminProduct);
router.post("/admin/products", admin, c.createProduct);
router.put("/admin/products/:slug", admin, c.updateProduct);
router.patch("/admin/products/:slug/status", admin, c.setProductStatus);
router.delete("/admin/products/:slug", admin, c.deleteProduct);

// Admin — collections (bundles)
router.get("/admin/bundles", admin, c.adminBundles);
router.post("/admin/bundles", admin, c.createBundle);
router.put("/admin/bundles/:slug", admin, c.updateBundle);
router.patch("/admin/bundles/:slug", admin, c.patchBundle);
router.delete("/admin/bundles/:slug", admin, c.deleteBundle);

// Admin — categories
router.get("/admin/categories", admin, c.adminCategories);
router.post("/admin/categories", admin, c.saveCategory);
router.put("/admin/categories/:id", admin, c.saveCategory);

// Admin — inventory
router.get("/admin/inventory", admin, c.adminInventory);
router.get("/admin/inventory/summary", admin, c.adminInventorySummary);
router.put("/admin/inventory", admin, c.adminSetStock);
router.post("/admin/inventory/adjust", admin, c.adminAdjustStock);
router.get("/admin/inventory/:sku/movements", admin, c.adminMovements);

// Admin — settings, sync, uploads
router.get("/admin/settings", admin, c.adminGetSettings);
router.put("/admin/settings", admin, c.adminPutSettings);
router.post("/admin/sync", admin, c.adminSync);
router.post("/admin/upload", admin, upload.single("image"), c.adminUpload);

export default router;
