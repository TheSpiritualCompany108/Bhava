import express from "express";
import { submitContact, getContacts, updateContactStatus } from "../controllers/contactController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);          // public — anyone can submit
router.get("/", protect, adminOnly, getContacts);                 // admin only (was open to any signed-in customer)
router.patch("/:id/status", protect, adminOnly, updateContactStatus); // admin only

export default router;
