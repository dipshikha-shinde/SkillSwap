import User from "../models/User.js";

export const getPublicTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      skillsOffered: { $exists: true, $ne: [] },
    }).select(
      "name bio caption profileImage skillsOffered skillsWanted rating reviewsCount"
    );

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPublicTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select(
      "name bio caption profileImage skillsOffered skillsWanted rating reviewsCount hobbies"
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTopTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      skillsOffered: { $exists: true, $ne: [] },
    })
      .select(
        "name bio caption profileImage skillsOffered skillsWanted rating reviewsCount"
      )
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(3);

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
