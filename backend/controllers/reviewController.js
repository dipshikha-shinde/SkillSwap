import Review from "../models/Review.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  try {
    const { sessionId, teacherId, rating, comment } = req.body;

    if (!sessionId || !teacherId || !rating) {
      return res
        .status(400)
        .json({ message: "Session, teacher and rating are required" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can review only completed sessions" });
    }

    const alreadyReviewed = await Review.findOne({
      sessionId,
      reviewer: req.user._id,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this session" });
    }

    const review = await Review.create({
      sessionId,
      reviewer: req.user._id,
      teacher: teacherId,
      rating,
      comment: comment || "",
    });

    const reviews = await Review.find({ teacher: teacherId });

    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await User.findByIdAndUpdate(teacherId, {
      rating: Number(averageRating.toFixed(1)),
      reviewsCount: reviews.length,
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer", "name profileImage")
      .populate("teacher", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByTeacher = async (req, res) => {
  try {
    const reviews = await Review.find({ teacher: req.params.teacherId })
      .populate("reviewer", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
