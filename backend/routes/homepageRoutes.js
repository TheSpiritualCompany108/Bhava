import express from "express";
import { getAllSections, getSection } from "../controllers/homepageController.js";

const router = express.Router();

// Public endpoints so the homepage can load admin-edited content overrides.
// GET /api/homepage
router.get("/", getAllSections);
// GET /api/homepage/:key
router.get("/:key", getSection);

export default router;
