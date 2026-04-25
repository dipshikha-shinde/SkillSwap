import Request from "../models/Request.js";

export const sendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({ message: "You cannot request yourself" });
    }

    const existingConnection = await Request.findOne({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if (existingConnection) {
      return res.status(400).json({
        message:
          existingConnection.status === "accepted"
            ? "You are already connected with this user"
            : "A request already exists between you and this user",
      });
    }

    const newRequest = await Request.create({
      sender: req.user._id,
      receiver: receiverId,
      message: message || "",
    });

    res.status(201).json({
      message: "Request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const sent = await Request.find({ sender: req.user._id })
      .populate("receiver", "name email profileImage skillsOffered")
      .sort({ createdAt: -1 });

    const received = await Request.find({ receiver: req.user._id })
      .populate("sender", "name email profileImage skillsOffered")
      .sort({ createdAt: -1 });

    res.status(200).json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPendingReceivedCount = async (req, res) => {
  try {
    const count = await Request.countDocuments({
      receiver: req.user._id,
      status: "pending",
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
