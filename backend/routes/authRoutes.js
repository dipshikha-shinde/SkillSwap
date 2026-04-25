import express from "express";
import { refreshTokenController } from "../controllers/authController.js";
import {
  signup,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/refresh", refreshTokenController);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/signup", signup);
router.post("/login", login);

export default router;
