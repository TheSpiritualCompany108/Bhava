import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { priceCart, requirementsOf } from "../data/catalog.js";
import { loadCtx, loadStock, deductStock, restoreStock, logOrderMovements, cancelOrderAndRestock, ApiError } from "../services/catalogService.js";
import { upsertUserAddress } from "./authController.js";

/** Admin panel JWT uses id: "admin" — not a Mongo ObjectId. Storefront users use real ids. */
function orderUserId(raw) {
  return mongoose.isValidObjectId(raw) ? raw : null;
}

// Helper: parse "₹1,299" → 1299
const parsePrice = (str) => {
  if (typeof str === "number") return str;
  return parseInt(String(str).replace(/[₹,]/g, ""), 10) || 0;
};

// POST /api/orders/preorder  — SacredJourney "Pre-Order Now" CTA (public)
export const createPreorder = async (req, res) => {
  try {
    const { name, email, mobile, notes } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least an email or mobile number.",
      });
    }

    // Fixed pre-order product (the launch collection)
    const preorderItem = {
      productId: 0,
      title: "BHAVA Launch Collection",
      price: "₹1,299",
      priceNum: 1299,
      image: "",
      category: "PRE-ORDER",
      quantity: 1,
    };

    const order = await Order.create({
      userId: req.userId || null,
      guestEmail: email || "",
      guestName: name || "",
      guestMobile: mobile || "",
      type: "preorder",
      items: [preorderItem],
      amount: 1299,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Pre-order placed! We'll contact you with confirmation details.",
      orderId: order._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// POST /api/orders — legacy server-cart order path. Disabled: it bypassed catalogue pricing,
// shipping and component-level inventory checks. All purchases go through /api/orders/checkout.
export const placeOrder = async (req, res) => {
  res.status(410).json({ success: false, message: "Please use the checkout page to place your order." });
};

// GET /api/orders  — get user's orders (protected)
export const getMyOrders = async (req, res) => {
  try {
    const userId = orderUserId(req.userId);
    if (!userId) {
      return res.status(200).json({ success: true, count: 0, orders: [] });
    }
    const orders = await Order.find({ userId, hiddenFromUser: { $ne: true } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("getMyOrders:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/orders/:id/cancel — customer cancels own pending/confirmed order
export const cancelMyOrder = async (req, res) => {
  try {
    const userId = orderUserId(req.userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please sign in with your customer account." });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    if (!order.userId || String(order.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "You can only cancel your own orders." });
    }
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(409).json({
        success: false,
        message: order.status === "cancelled"
          ? "This order is already cancelled."
          : `A ${order.status} order cannot be cancelled online. Please contact support.`,
      });
    }

    const { order: cancelled, restored } = await cancelOrderAndRestock(order._id, {
      actor: String(userId),
    });
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order: cancelled,
      restored,
    });
  } catch (err) {
    if (err instanceof ApiError) return res.status(err.status).json({ success: false, message: err.message });
    console.error("cancelMyOrder:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/orders/:id — customer soft-removes order from My Orders
export const hideMyOrder = async (req, res) => {
  try {
    const userId = orderUserId(req.userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please sign in with your customer account." });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    if (!order.userId || String(order.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "You can only remove your own orders." });
    }
    // Only remove finished/cancelled orders from the list (active ones must be cancelled first)
    if (!["cancelled", "delivered"].includes(order.status)) {
      return res.status(409).json({
        success: false,
        message: "Cancel the order first, or wait until it is delivered, before removing it.",
      });
    }
    order.hiddenFromUser = true;
    await order.save();
    res.status(200).json({ success: true, message: "Order removed from your list." });
  } catch (err) {
    console.error("hideMyOrder:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/orders/checkout — secure checkout (protected)
// body: { items: [{ kind, slug, variant?, selection?, quantity }], address, notes, paymentMethod }
// Prices, shipping and stock are always computed server-side from the master catalogue.
// Stock for every component SKU is deducted atomically; bundles deduct their actual components.
export const checkout = async (req, res) => {
  try {
    const { items, address = {}, notes = "", paymentMethod = "cod" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }
    if (paymentMethod !== "cod") {
      return res.status(400).json({ success: false, message: "Online payment is not available yet. Please choose Cash on Delivery." });
    }

    const clean = (v) => String(v || "").trim();
    const addressTypeRaw = clean(address.addressType);
    let countryCode = clean(address.countryCode) || "+91";
    if (!countryCode.startsWith("+")) countryCode = `+${countryCode}`;
    const phoneDigits = clean(address.phone).replace(/\D/g, "");
    const a = {
      fullName: clean(address.fullName),
      countryCode,
      phone: countryCode === "+91" ? phoneDigits.slice(-10) : phoneDigits.slice(0, 15),
      line1: clean(address.line1),
      line2: clean(address.line2),
      city: clean(address.city),
      state: clean(address.state),
      pincode: clean(address.pincode),
      addressType: addressTypeRaw === "Office" ? "Office" : "Home",
    };
    if (a.fullName.length < 2) return res.status(400).json({ success: false, message: "Please enter your full name." });
    if (a.countryCode === "+91") {
      if (!/^[6-9]\d{9}$/.test(a.phone)) {
        return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
      }
    } else if (!/^\d{7,15}$/.test(a.phone)) {
      return res.status(400).json({ success: false, message: "Please enter a valid mobile number." });
    }
    if (a.line1.length < 5) return res.status(400).json({ success: false, message: "Please enter your full address." });
    if (!a.city) return res.status(400).json({ success: false, message: "Please enter your city." });
    if (!a.state) return res.status(400).json({ success: false, message: "Please select your state." });
    if (!/^\d{6}$/.test(a.pincode)) return res.status(400).json({ success: false, message: "Please enter a valid 6-digit pincode." });

    // Validate + price against current stock
    const [ctx, stock] = await Promise.all([loadCtx(), loadStock()]);
    const priced = priceCart(items, stock, ctx);
    const bad = priced.lines.find((l) => !l.ok);
    if (bad) {
      return res.status(409).json({
        success: false,
        code: "CART_INVALID",
        message: `${bad.title || "An item in your cart"}: ${bad.message} Please review your cart.`,
      });
    }

    // Reserve (deduct) every component SKU atomically — fails closed if anything raced out of stock
    const need = requirementsOf(priced.lines);
    const deducted = await deductStock(need);
    if (!deducted) {
      return res.status(409).json({
        success: false,
        code: "OUT_OF_STOCK",
        message: "Sorry — an item in your cart just went out of stock. Please review your cart.",
      });
    }

    const orderItems = priced.lines.map((l) => {
      const fromCatalog =
        l.kind === "bundle"
          ? ctx.getBundle?.(l.slug)?.image
          : ctx.getProduct?.(l.slug)?.image;
      return {
        productId: l.lineId,
        title: l.title,
        price: `₹${l.unitPrice.toLocaleString("en-IN")}`,
        priceNum: l.unitPrice,
        image: fromCatalog || "",
        category: l.category,
        quantity: l.quantity,
        kind: l.kind,
        slug: l.slug,
        variantLabel: l.variantLabel,
        components: l.components,
      };
    });

    const userId = orderUserId(req.userId);
    if (!userId) {
      await restoreStock(need);
      return res.status(401).json({
        success: false,
        message: "Please sign in with your customer account to place an order.",
      });
    }

    let order;
    try {
      order = await Order.create({
        userId,
        type: "order",
        items: orderItems,
        amount: priced.total,
        pricing: { subtotal: priced.subtotal, discount: 0, shipping: priced.shipping, total: priced.total },
        address: a,
        paymentMethod: "cod",
        paymentStatus: "pending",
        notes: clean(notes).slice(0, 500),
      });
    } catch (err) {
      await restoreStock(need);
      throw err;
    }
    await logOrderMovements(deducted, order._id); // audit trail (best-effort, never blocks the order)

    // Best-effort: empty the server-side cart + save delivery address to the user's book
    Cart.updateOne({ userId }, { items: [] }).catch(() => {});
    upsertUserAddress(userId, { ...a, makeDefault: true }, { makeDefault: true }).catch((e) => {
      console.error("[checkout] address save:", e.message);
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id,
      total: priced.total,
      shipping: priced.shipping,
      subtotal: priced.subtotal,
      items: orderItems.map((l) => ({
        item_id: l.kind === "bundle" ? `bundle:${l.slug}` : l.slug,
        item_name: l.title,
        item_variant: l.variantLabel,
        price: l.priceNum,
        quantity: l.quantity,
        sku: (l.components || []).map((c) => c.sku).filter(Boolean),
      })),
    });
  } catch (err) {
    console.error("[checkout]", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      detail: process.env.NODE_ENV === "production" ? undefined : String(err?.message || err),
    });
  }
};

// GET /api/orders/all  — admin: all orders (protected)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// PATCH /api/orders/:id/status — admin. Cancelling returns each component SKU's stock exactly once.
export const updateOrderStatus = async (req, res) => {
  try {
    const status = String(req.body?.status || "");
    if (!["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }
    if (status === "cancelled") {
      const { order, restored } = await cancelOrderAndRestock(req.params.id, { actor: String(req.userId || "admin") });
      return res.json({ success: true, message: `Order cancelled. Stock returned for ${Object.keys(restored).length} SKU(s).`, order, restored });
    }
    const current = await Order.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: "Order not found." });
    if (current.status === "cancelled") {
      return res.status(409).json({ success: false, message: "A cancelled order cannot be reopened (its stock has already been returned). Ask the customer to place a new order." });
    }
    current.status = status;
    await current.save();
    res.json({ success: true, message: `Order marked ${status}.`, order: current });
  } catch (err) {
    if (err instanceof ApiError) return res.status(err.status).json({ success: false, message: err.message });
    res.status(500).json({ success: false, message: "Server error." });
  }
};
