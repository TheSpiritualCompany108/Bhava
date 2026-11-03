import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Tile from "../models/Tile.js";
import mongoose from "mongoose";

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

// POST /api/orders  — place a full order from cart (protected)
export const placeOrder = async (req, res) => {
  try {
    const { address, notes } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    const amount = cart.items.reduce((s, i) => s + i.priceNum * i.quantity, 0);

    const order = await Order.create({
      userId: req.userId,
      type: "order",
      items: cart.items.map((i) => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        priceNum: i.priceNum,
        image: i.image,
        category: i.category,
        quantity: i.quantity,
      })),
      amount,
      address: address || {},
      notes: notes || "",
    });

    // Clear the cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id,
      amount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// GET /api/orders  — get user's orders (protected)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/orders/checkout — secure checkout (protected)
// body: { items: [{ productId, quantity }], address: {...}, notes, paymentMethod }
// Prices are always re-read from the product (never trusted from the client).
const FOUNDING_DISCOUNT = 0.3; // keep in sync with CartPage
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
    const a = {
      fullName: clean(address.fullName),
      phone: clean(address.phone).replace(/\D/g, ""),
      line1: clean(address.line1),
      line2: clean(address.line2),
      city: clean(address.city),
      state: clean(address.state),
      pincode: clean(address.pincode),
    };
    if (a.fullName.length < 2) return res.status(400).json({ success: false, message: "Please enter your full name." });
    if (!/^[6-9]\d{9}$/.test(a.phone.slice(-10)) || a.phone.length < 10) return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    if (a.line1.length < 5) return res.status(400).json({ success: false, message: "Please enter your full address." });
    if (!a.city) return res.status(400).json({ success: false, message: "Please enter your city." });
    if (!a.state) return res.status(400).json({ success: false, message: "Please select your state." });
    if (!/^\d{6}$/.test(a.pincode)) return res.status(400).json({ success: false, message: "Please enter a valid 6-digit pincode." });
    a.phone = a.phone.slice(-10);

    const orderItems = [];
    for (const it of items) {
      const qty = Math.min(Math.max(parseInt(it.quantity, 10) || 1, 1), 99);
      if (!mongoose.isValidObjectId(it.productId)) {
        return res.status(400).json({ success: false, message: "One of the items in your cart is no longer available. Please remove it and try again." });
      }
      const tile = await Tile.findById(it.productId);
      if (!tile || tile.status === "draft" || tile.status === "archived") {
        return res.status(400).json({ success: false, message: `"${it.title || "An item"}" is no longer available. Please remove it from your cart.` });
      }
      const priceNum = parsePrice(tile.badgeText);
      orderItems.push({
        productId: String(tile._id),
        title: tile.title,
        price: tile.badgeText || `₹${priceNum}`,
        priceNum,
        image: tile.imageUrl || "",
        category: tile.meta?.productType || tile.category || "",
        quantity: qty,
      });
    }

    const subtotal = orderItems.reduce((s, i) => s + i.priceNum * i.quantity, 0);
    const discount = Math.round(subtotal * FOUNDING_DISCOUNT);
    const shipping = 0;
    const total = subtotal - discount + shipping;

    const order = await Order.create({
      userId: req.userId,
      type: "order",
      items: orderItems,
      amount: total,
      pricing: { subtotal, discount, shipping, total },
      address: a,
      paymentMethod: "cod",
      paymentStatus: "pending",
      notes: clean(notes).slice(0, 500),
    });

    // Best-effort: empty the server-side cart
    Cart.updateOne({ userId: req.userId }, { items: [] }).catch(() => {});

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id,
      total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
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
