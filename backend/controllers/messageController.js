import Message from "../models/Message.js";
import Request from "../models/Request.js";

export const sendMessage = async (req, res) => {
  try {
    const { requestId, receiverId, text } = req.body;

    if (!requestId || !receiverId || !text?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Chat is only available for accepted requests" });
    }

    const isParticipant =
      request.sender.toString() === req.user._id.toString() ||
      request.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized for this chat" });
    }

    const message = await Message.create({
      requestId,
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim(),
      isRead: false,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage");

    res.status(201).json({
      message: "Message sent successfully",
      chatMessage: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Chat is only available for accepted requests" });
    }

    const isParticipant =
      request.sender.toString() === req.user._id.toString() ||
      request.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized for this chat" });
    }

    await Message.updateMany(
      {
        requestId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    const messages = await Message.find({ requestId })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAcceptedChats = async (req, res) => {
  try {
    const acceptedRequests = await Request.find({
      status: "accepted",
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name email profileImage skillsOffered")
      .populate("receiver", "name email profileImage skillsOffered")
      .sort({ updatedAt: -1 });

    const uniqueChatsMap = new Map();

    for (const request of acceptedRequests) {
      const userIds = [
        request.sender._id.toString(),
        request.receiver._id.toString(),
      ].sort();
      const key = `${userIds[0]}-${userIds[1]}`;

      if (!uniqueChatsMap.has(key)) {
        uniqueChatsMap.set(key, request);
      }
    }

    const uniqueChats = Array.from(uniqueChatsMap.values());

    res.status(200).json(uniqueChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadChatsCount = async (req, res) => {
  try {
    const unreadRequestIds = await Message.distinct("requestId", {
      receiver: req.user._id,
      isRead: false,
    });

    res.status(200).json({ count: unreadRequestIds.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
