import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import CatalogSettings from "../models/CatalogSettings.js";
import { couponAmount } from "../data/catalog.js";
import { ApiError } from "./catalogService.js";

export const DONATION_DEFAULTS = {
  enabled: false,
  heading: "Support transformative social work in India",
  label: "Donate and make a difference",
  note: "",
  amounts: [10, 20, 50, 100],
  maxAmount: 10000,
};

export async function getDonationConfig() {
  const doc = await CatalogSettings.findOne({ key: "main" }, "donation").lean();
  const d = { ...DONATION_DEFAULTS, ...(doc?.donation || {}) };
  d.amounts = (Array.isArray(d.amounts) ? d.amounts : DONATION_DEFAULTS.amounts).filter((n) => Number.isInteger(n) && n > 0);
  return d;
}

/** Validates + normalises the admin's donation settings (throws ApiError 422). */
export function cleanDonationConfig(input = {}) {
  const out = {};
  if (input.enabled !== undefined) out.enabled = !!input.enabled;
  for (const k of ["heading", "label", "note"]) {
    if (input[k] !== undefined) out[k] = String(input[k] ?? "").trim().slice(0, k === "note" ? 300 : 120);
  }
  if (input.maxAmount !== undefined) {
    const n = Number(input.maxAmount);
    if (!Number.isInteger(n) || n < 1 || n > 1000000) throw new ApiError(422, "Maximum donation must be a whole number of rupees (1 – 10,00,000).");
    out.maxAmount = n;
  }
  if (input.amounts !== undefined) {
    const list = (Array.isArray(input.amounts) ? input.amounts : String(input.amounts).split(",")).map((x) => Number(String(x).trim()));
    if (list.some((n) => !Number.isInteger(n) || n < 1)) throw new ApiError(422, "Donation amounts must be whole rupees, e.g. 10, 20, 50, 100.");
    out.amounts = [...new Set(list)].slice(0, 6);
  }
  return out;
}

const publicCoupon = (c, subtotal) => ({
  code: c.code, title: c.title, type: c.type, value: c.value, maxDiscount: c.maxDiscount, minOrder: c.minOrder,
  saves: couponAmount(c, subtotal || 0),
  eligible: (subtotal || 0) >= (c.minOrder || 0),
});

function checkWindow(c, now = new Date()) {
  if (!c.active) return "This coupon is not active.";
  if (c.startsAt && now < c.startsAt) return "This coupon is not live yet.";
  if (c.endsAt && now > c.endsAt) return "This coupon has expired.";
  if (c.usageLimit > 0 && c.usedCount >= c.usageLimit) return "This coupon has been fully redeemed.";
  return "";
}

/**
 * Resolve a typed coupon code against the current selling subtotal.
 * Returns { coupon, error } — coupon is the full doc (or null). `userId` enables the per-customer limit.
 */
export async function findApplicableCoupon(codeRaw, subtotal, userId = null) {
  const code = String(codeRaw || "").trim().toUpperCase();
  if (!code) return { coupon: null, error: "" };
  const coupon = await Coupon.findOne({ code }).lean();
  if (!coupon) return { coupon: null, error: "That coupon code is not valid." };
  const bad = checkWindow(coupon);
  if (bad) return { coupon: null, error: bad };
  if (subtotal < coupon.minOrder) return { coupon: null, error: `Add items worth ₹${coupon.minOrder - subtotal} more to use ${coupon.code}.` };
  if (coupon.perUserLimit > 0 && userId) {
    const used = await Order.countDocuments({ userId, "pricing.couponCode": coupon.code, status: { $ne: "cancelled" } });
    if (used >= coupon.perUserLimit) return { coupon: null, error: "You have already used this coupon." };
  }
  if (couponAmount(coupon, subtotal) <= 0) return { coupon: null, error: "This coupon gives no discount on your bag." };
  return { coupon, error: "" };
}

/** Normalise a requested donation against the admin's settings → { amount, error }. */
export async function checkDonation(raw) {
  const n = Number(raw);
  if (!raw || !Number.isFinite(n) || n <= 0) return { amount: 0, error: "" };
  const cfg = await getDonationConfig();
  if (!cfg.enabled) return { amount: 0, error: "Donations are not available right now." };
  if (!Number.isInteger(n)) return { amount: 0, error: "Please enter a whole-rupee donation." };
  if (n > cfg.maxAmount) return { amount: 0, error: `The maximum donation is ₹${cfg.maxAmount}.` };
  return { amount: n, error: "" };
}

/** Coupons to list under "Apply Coupons" (visible + currently usable window). */
export async function listPublicCoupons(subtotal = 0) {
  const rows = await Coupon.find({ active: true, visible: true }).sort({ createdAt: -1 }).lean();
  return rows.filter((c) => !checkWindow(c)).map((c) => publicCoupon(c, subtotal));
}

/** Count a redemption. Fails (returns false) if the usage limit was reached in the meantime. */
export async function redeemCoupon(code) {
  const r = await Coupon.findOneAndUpdate(
    { code, $or: [{ usageLimit: 0 }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }] },
    { $inc: { usedCount: 1 } },
  );
  return !!r;
}
export const releaseCoupon = (code) => Coupon.updateOne({ code, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });

// ── Admin CRUD ───────────────────────────────────────────────────────────────
export function cleanCouponInput(input = {}, existing = null) {
  const d = {};
  const err = (m) => { throw new ApiError(422, m); };
  d.code = existing ? existing.code : String(input.code || "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,20}$/.test(d.code)) err("Code must be 3–20 letters, numbers, - or _.");
  d.title = String(input.title ?? "").trim().slice(0, 120);
  d.type = input.type === "flat" ? "flat" : input.type === "percent" ? "percent" : err("Choose percent or flat.");
  d.value = Number(input.value);
  if (!Number.isInteger(d.value) || d.value < 1) err("Discount value must be a whole number ≥ 1.");
  if (d.type === "percent" && d.value > 90) err("Percent discount cannot be more than 90.");
  for (const k of ["maxDiscount", "minOrder", "usageLimit", "perUserLimit"]) {
    const n = input[k] === undefined || input[k] === "" || input[k] === null ? 0 : Number(input[k]);
    if (!Number.isInteger(n) || n < 0) err(`${k} must be a whole number ≥ 0.`);
    d[k] = n;
  }
  d.active = input.active !== false;
  d.visible = input.visible !== false;
  for (const k of ["startsAt", "endsAt"]) {
    if (!input[k]) { d[k] = null; continue; }
    const t = new Date(input[k]);
    if (Number.isNaN(t.getTime())) err(`${k} is not a valid date.`);
    d[k] = t;
  }
  if (d.startsAt && d.endsAt && d.endsAt <= d.startsAt) err("End date must be after the start date.");
  return d;
}
