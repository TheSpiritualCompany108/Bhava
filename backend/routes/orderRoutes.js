import express from "express";
import {
  createPreorder,
  placeOrder,
  checkout,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: SacredJourney pre-order CTA (no login needed)
router.post("/preorder", createPreorder);

// Protected: place order from cart
router.post("/", protect, placeOrder);

// Protected: secure checkout (server re-prices items)
router.post("/checkout", protect, checkout);

// Protected: get current user's orders
router.get("/", protect, getMyOrders);

// Protected: admin — all orders
router.get("/all", protect, adminOnly, getAllOrders);

// Admin: change order status (cancelling restores component stock once)
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
