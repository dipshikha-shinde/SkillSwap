import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, caption, hobbies, skillsOffered, skillsWanted } =
      req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.caption = caption ?? user.caption;

    if (req.file) {
      user.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    user.hobbies = hobbies ? JSON.parse(hobbies) : user.hobbies;

    user.skillsOffered = skillsOffered
      ? JSON.parse(skillsOffered)
      : user.skillsOffered;

    user.skillsWanted = skillsWanted
      ? JSON.parse(skillsWanted)
      : user.skillsWanted;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        caption: updatedUser.caption,
        hobbies: updatedUser.hobbies,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        profileImage: updatedUser.profileImage,
        rating: updatedUser.rating,
        reviewsCount: updatedUser.reviewsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

