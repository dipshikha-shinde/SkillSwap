import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

function EditProfile() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    savedUser.profileImage || ""
  );

  const [formData, setFormData] = useState({
    name: savedUser.name || "",
    bio: savedUser.bio || "",
    caption: savedUser.caption || "",
    hobbies: savedUser.hobbies ? savedUser.hobbies.join(", ") : "",
    skillsOffered: savedUser.skillsOffered
      ? savedUser.skillsOffered.join(", ")
      : "",
    skillsWanted: savedUser.skillsWanted
      ? savedUser.skillsWanted.join(", ")
      : "",
  });
  const formatCommaSeparated = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const [loading, setLoading] = useState(false);
  const completionChecks = [
    previewImage && previewImage.trim() !== "",
    formData.name.trim() !== "",
    formData.caption.trim() !== "",
    formData.bio.trim() !== "",
    formatCommaSeparated(formData.hobbies).length > 0,
    formatCommaSeparated(formData.skillsOffered).length > 0,
    formatCommaSeparated(formData.skillsWanted).length > 0,
  ];

  const completedCount = completionChecks.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedCount / completionChecks.length) * 100
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const dataToSend = new FormData();

      dataToSend.append("name", formData.name);
      dataToSend.append("bio", formData.bio);
      dataToSend.append("caption", formData.caption);
      dataToSend.append(
        "hobbies",
        JSON.stringify(formatCommaSeparated(formData.hobbies))
      );
      dataToSend.append(
        "skillsOffered",
        JSON.stringify(formatCommaSeparated(formData.skillsOffered))
      );
      dataToSend.append(
        "skillsWanted",
        JSON.stringify(formatCommaSeparated(formData.skillsWanted))
      );

      if (selectedImage) {
        dataToSend.append("profileImage", selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTagsPreview = (value) => {
    const items = formatCommaSeparated(value);

    if (items.length === 0) {
      return (
        <p className="text-sm text-gray-400 mt-2">
          Add items separated by commas
        </p>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-200"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-8 py-6 bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-500 mt-2">
            Update your public profile, teaching skills, and learning goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-800">
                Profile Completion
              </h2>
              <span className="text-sm font-medium text-gray-700">
                {completionPercentage}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Complete your profile to build more trust and attract better
              learning matches.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img
              src={
                previewImage && previewImage.trim() !== ""
                  ? previewImage
                  : "https://via.placeholder.com/120"
              }
              alt="Profile preview"
              className="w-28 h-28 rounded-full object-cover border shadow-sm"
            />

            <label className="mt-4 inline-block cursor-pointer bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-500 mt-2">
              Upload a clear profile picture
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Short Caption
              </label>
              <input
                type="text"
                name="caption"
                placeholder="Example: Java mentor and photography lover"
                value={formData.caption}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                About You
              </label>
              <textarea
                name="bio"
                placeholder="Write a short introduction about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Hobbies
              </label>
              <input
                type="text"
                name="hobbies"
                placeholder="Reading, Sketching, Fitness"
                value={formData.hobbies}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              {renderTagsPreview(formData.hobbies)}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Skills You Offer
              </label>
              <input
                type="text"
                name="skillsOffered"
                placeholder="Java, Guitar, Photography"
                value={formData.skillsOffered}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              {renderTagsPreview(formData.skillsOffered)}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Skills You Want to Learn
              </label>
              <input
                type="text"
                name="skillsWanted"
                placeholder="UI Design, Public Speaking"
                value={formData.skillsWanted}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              {renderTagsPreview(formData.skillsWanted)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
