import express from "express";
import {
  signup,
  login,
  googleLogin,
  getMe,
  updateMe,
  getAddresses,
  putAddresses,
  deleteAddress,
} from "../controllers/authController.js";
import { forgotPassword, verifyResetOtp, resetPassword } from "../controllers/passwordResetController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.get("/addresses", protect, getAddresses);
router.put("/addresses", protect, putAddresses);
router.delete("/addresses/:id", protect, deleteAddress);

export default router;
