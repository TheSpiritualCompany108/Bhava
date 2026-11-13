import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

function realUserId(raw) {
  return mongoose.isValidObjectId(raw) ? raw : null;
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sendResponse = (res, statusCode, user, message) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
};

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({ name, email, password, provider: "email" });
    sendResponse(res, 201, user, "Account created successfully");
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email. Please sign up first.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google sign-in. Please use 'Continue with Google'.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    sendResponse(res, 200, user, "Logged in successfully");
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// POST /api/auth/google  — body: { credential } (Google ID token from Google Identity Services)
export const googleLogin = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(501).json({ success: false, message: "Google sign-in is not configured." });
    }
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential" });
    }

    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    const info = await verifyRes.json();
    if (!verifyRes.ok || info.aud !== clientId || String(info.email_verified) !== "true") {
      return res.status(401).json({ success: false, message: "Google sign-in failed. Please try again." });
    }

    const email = String(info.email).toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: info.name || email.split("@")[0],
        email,
        provider: "google",
        googleId: info.sub,
        avatar: info.picture || "",
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = info.sub;
      if (!user.avatar && info.picture) user.avatar = info.picture;
      user.isVerified = true;
      await user.save();
    }

    sendResponse(res, 200, user, "Logged in with Google");
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

function serializeAddress(a) {
  return {
    id: a.clientId || String(a._id),
    fullName: a.fullName || "",
    countryCode: a.countryCode || "+91",
    phone: a.phone || "",
    line1: a.line1 || "",
    line2: a.line2 || "",
    city: a.city || "",
    state: a.state || "",
    pincode: a.pincode || "",
    addressType: a.addressType === "Office" ? "Office" : "Home",
    makeDefault: !!a.makeDefault,
  };
}

function normalizeAddressInput(raw = {}) {
  const clean = (v) => String(v || "").trim();
  let countryCode = clean(raw.countryCode) || "+91";
  if (!countryCode.startsWith("+")) countryCode = `+${countryCode}`;
  const digits = clean(raw.phone).replace(/\D/g, "");
  const phone = countryCode === "+91" ? digits.slice(-10) : digits.slice(0, 15);
  const addressType = clean(raw.addressType) === "Office" ? "Office" : "Home";
  return {
    clientId: clean(raw.id || raw.clientId) || `addr_${Date.now()}`,
    fullName: clean(raw.fullName),
    countryCode,
    phone,
    line1: clean(raw.line1),
    line2: clean(raw.line2),
    city: clean(raw.city),
    state: clean(raw.state),
    pincode: clean(raw.pincode),
    addressType,
    makeDefault: !!raw.makeDefault,
  };
}

function validateAddress(a) {
  if (a.fullName.length < 2) return "Please enter your full name.";
  if (a.countryCode === "+91") {
    if (!/^[6-9]\d{9}$/.test(a.phone)) return "Please enter a valid 10-digit mobile number.";
  } else if (!/^\d{7,15}$/.test(a.phone)) {
    return "Please enter a valid mobile number.";
  }
  if (a.line1.length < 5) return "Please enter your full address.";
  if (!a.city) return "Please enter your city.";
  if (!a.state) return "Please select your state.";
  if (!/^\d{6}$/.test(a.pincode)) return "Please enter a valid 6-digit pincode.";
  return "";
}

/** Upsert one address onto a user document (mutates + saves). */
export async function upsertUserAddress(userId, rawAddress, { makeDefault = false } = {}) {
  if (!userId) return null;
  const user = await User.findById(userId);
  if (!user) return null;

  const entry = normalizeAddressInput({ ...rawAddress, makeDefault: makeDefault || rawAddress.makeDefault });
  const err = validateAddress(entry);
  if (err) throw Object.assign(new Error(err), { status: 400 });

  const same = (a) =>
    (entry.clientId && a.clientId === entry.clientId) ||
    (a.phone === entry.phone &&
      a.line1.toLowerCase() === entry.line1.toLowerCase() &&
      a.pincode === entry.pincode);

  const idx = user.addresses.findIndex(same);
  if (idx >= 0) {
    Object.assign(user.addresses[idx], entry);
  } else {
    if (user.addresses.length === 0) entry.makeDefault = true;
    user.addresses.push(entry);
  }

  if (entry.makeDefault || makeDefault) {
    const targetId = entry.clientId;
    user.addresses.forEach((a) => {
      a.makeDefault = a.clientId === targetId;
    });
  }

  await user.save();
  return user.addresses.map(serializeAddress);
}

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/auth/addresses (protected)
export const getAddresses = async (req, res) => {
  try {
    const userId = realUserId(req.userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in with your customer account.",
      });
    }
    const user = await User.findById(userId).select("addresses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      addresses: (user.addresses || []).map(serializeAddress),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/auth/addresses (protected) — replace / sync full address book
export const putAddresses = async (req, res) => {
  try {
    const userId = realUserId(req.userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in with your customer account.",
      });
    }
    const list = Array.isArray(req.body?.addresses) ? req.body.addresses : null;
    if (!list) {
      return res.status(400).json({ success: false, message: "addresses array is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const normalized = [];
    for (const raw of list) {
      const entry = normalizeAddressInput(raw);
      const err = validateAddress(entry);
      if (err) return res.status(400).json({ success: false, message: err });
      normalized.push(entry);
    }

    if (normalized.length && !normalized.some((a) => a.makeDefault)) {
      normalized[0].makeDefault = true;
    }
    if (normalized.filter((a) => a.makeDefault).length > 1) {
      let seen = false;
      for (const a of normalized) {
        if (a.makeDefault && !seen) { seen = true; continue; }
        a.makeDefault = false;
      }
    }

    user.addresses = normalized;
    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses.map(serializeAddress),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/auth/addresses/:id (protected)
export const deleteAddress = async (req, res) => {
  try {
    const userId = realUserId(req.userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in with your customer account.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const id = String(req.params.id || "");
    const before = user.addresses.length;
    user.addresses = user.addresses.filter(
      (a) => a.clientId !== id && String(a._id) !== id
    );
    if (user.addresses.length === before) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }
    if (user.addresses.length && !user.addresses.some((a) => a.makeDefault)) {
      user.addresses[0].makeDefault = true;
    }
    await user.save();
    res.status(200).json({
      success: true,
      addresses: user.addresses.map(serializeAddress),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/auth/me  (protected) — update name / avatar
export const updateMe = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name && name.trim().length >= 2) updates.name = name.trim();
    if (avatar !== undefined) updates.avatar = avatar;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "Nothing to update." });
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
