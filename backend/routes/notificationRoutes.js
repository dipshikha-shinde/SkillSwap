import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  getUnreadNotificationsCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadNotificationsCount);
router.put("/:notificationId/read", protect, markNotificationAsRead);

export default router;
