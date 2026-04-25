import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  createReply,
  toggleLikePost,
  getTopics,
  updatePost,
  deletePost,
  updateReply,
  deleteReply,
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/topics", getTopics);
router.post("/", protect, createPost);
router.post("/reply", protect, createReply);
router.put("/:postId/like", protect, toggleLikePost);

router.put("/post/:postId", protect, updatePost);
router.delete("/post/:postId", protect, deletePost);

router.put("/reply/:replyId", protect, updateReply);
router.delete("/reply/:replyId", protect, deleteReply);

export default router;
