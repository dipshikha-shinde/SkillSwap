import CommunityPost from "../models/CommunityPost.js";
import CommunityReply from "../models/CommunityReply.js";
import Notification from "../models/notification.js";
export const createPost = async (req, res) => {
  try {
    const { topic, text } = req.body;

    if (!topic || !text) {
      return res.status(400).json({ message: "Topic and text are required" });
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      topic,
      text,
    });

    const populatedPost = await CommunityPost.findById(post._id).populate(
      "author",
      "name profileImage"
    );

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { topic, sort } = req.query;

    const filter = {};
    if (topic && topic !== "All") {
      filter.topic = topic;
    }

    const posts = await CommunityPost.find(filter).populate(
      "author",
      "name profileImage"
    );

    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const replies = await CommunityReply.find({ post: post._id })
          .populate("author", "name profileImage")
          .sort({ createdAt: 1 });

        return {
          ...post.toObject(),
          replies,
        };
      })
    );

    if (sort === "liked") {
      postsWithReplies.sort((a, b) => {
        const likeDiff = (b.likes?.length || 0) - (a.likes?.length || 0);
        if (likeDiff !== 0) return likeDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      postsWithReplies.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    res.status(200).json(postsWithReplies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res
        .status(400)
        .json({ message: "Post and reply text are required" });
    }

    const post = await CommunityPost.findById(postId).populate(
      "author",
      "name"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = await CommunityReply.create({
      post: postId,
      author: req.user._id,
      text,
    });

    const populatedReply = await CommunityReply.findById(reply._id).populate(
      "author",
      "name profileImage"
    );

    if (String(post.author._id) !== String(req.user._id)) {
      await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: "community_reply",
        post: post._id,
        reply: reply._id,
        message: `${
          populatedReply.author?.name || "Someone"
        } replied to your community post`,
      });
    }

    res.status(201).json({
      message: "Reply added successfully",
      reply: populatedReply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes) {
      post.likes = [];
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopics = async (req, res) => {
  try {
    const topics = await CommunityPost.distinct("topic");
    res.status(200).json(["All", ...topics]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { topic, text } = req.body;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    post.topic = topic || post.topic;
    post.text = text || post.text;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await CommunityReply.deleteMany({ post: postId });
    await CommunityPost.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { text } = req.body;

    const reply = await CommunityReply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this reply" });
    }

    reply.text = text || reply.text;
    await reply.save();

    res.status(200).json({
      message: "Reply updated successfully",
      reply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;

    const reply = await CommunityReply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this reply" });
    }

    await CommunityReply.findByIdAndDelete(replyId);

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
