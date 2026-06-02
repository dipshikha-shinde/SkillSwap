import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadmiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, upload.single("profileImage"), updateMyProfile);

export default router;
