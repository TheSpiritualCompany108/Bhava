import express from "express";
import { signup, login, googleLogin, getMe, updateMe } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);

export default router;
