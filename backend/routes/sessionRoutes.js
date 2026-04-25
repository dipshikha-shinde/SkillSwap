import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createSession,
  getMySessions,
  updateSessionStatus,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protect, createSession);
router.get("/", protect, getMySessions);
router.put("/:sessionId", protect, updateSessionStatus);

export default router;
