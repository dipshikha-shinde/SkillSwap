import Session from "../models/Session.js";
import Request from "../models/Request.js";

export const createSession = async (req, res) => {
  try {
    const { requestId, title, date, time, mode, meetingLink, notes } = req.body;

    if (!requestId || !date || !time) {
      return res
        .status(400)
        .json({ message: "Request, date, and time are required" });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Session can only be created for accepted requests" });
    }

    const isParticipant =
      request.sender.toString() === req.user._id.toString() ||
      request.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const existingSession = await Session.findOne({
      requestId,
      status: "scheduled",
    });

    if (existingSession) {
      return res
        .status(400)
        .json({ message: "A session is already scheduled for this request" });
    }

    const session = await Session.create({
      requestId,
      scheduledBy: req.user._id,
      participants: [request.sender, request.receiver],
      title: title || "Skill Session",
      date,
      time,
      mode: mode || "online",
      meetingLink: meetingLink || "",
      notes: notes || "",
    });

    const populatedSession = await Session.findById(session._id)
      .populate("participants", "name email profileImage")
      .populate("scheduledBy", "name");

    res.status(201).json({
      message: "Session scheduled successfully",
      session: populatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      participants: req.user._id,
    })
      .populate("participants", "name email profileImage")
      .populate("scheduledBy", "name")
      .populate("requestId")
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const isParticipant = session.participants.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = status;
    await session.save();

    res.status(200).json({
      message: `Session ${status} successfully`,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
