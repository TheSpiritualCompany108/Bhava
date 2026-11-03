import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
