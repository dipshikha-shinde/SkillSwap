import { StreamClient } from "@stream-io/node-sdk";

const streamClient = new StreamClient(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export const getVideoToken = async (req, res) => {
  try {
    const userId = String(req.user._id);

    // ✅ STEP 1: Create/Update user in Stream
    await streamClient.upsertUsers([
      {
        id: userId,
        name: req.user.name,
        image: req.user.profileImage || "",
      },
    ]);

    // ✅ STEP 2: Generate token
    const token = streamClient.createToken(userId);

    res.status(200).json({
      apiKey: process.env.STREAM_API_KEY,
      token,
      user: {
        id: userId,
        name: req.user.name,
        image: req.user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("VIDEO TOKEN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
