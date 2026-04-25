import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendRequest,
  getMyRequests,
  updateRequestStatus,
  getPendingReceivedCount,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/my-requests", protect, getMyRequests);
router.put("/:requestId", protect, updateRequestStatus);
router.get("/pending-count", protect, getPendingReceivedCount);

export default router;
