import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessagesByRequest,
  getMyAcceptedChats,
  getUnreadChatsCount,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/my-chats", protect, getMyAcceptedChats);
router.get("/unread-count", protect, getUnreadChatsCount);
router.get("/:requestId", protect, getMessagesByRequest);
router.post("/", protect, sendMessage);

export default router;
