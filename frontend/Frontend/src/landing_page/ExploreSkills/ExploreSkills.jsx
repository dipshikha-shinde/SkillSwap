import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function ExploreSkills() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/teachers`);
        const data = await response.json();

        if (response.ok) {
          setTeachers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const availableSkills = useMemo(() => {
    const skillsSet = new Set();

    teachers.forEach((teacher) => {
      (teacher.skillsOffered || []).forEach((skill) => {
        if (skill?.trim()) {
          skillsSet.add(skill.trim());
        }
      });
    });

    return ["All", ...Array.from(skillsSet).sort()];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    let result = [...teachers];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result.filter((teacher) => {
        const nameMatch = teacher.name?.toLowerCase().includes(term);
        const bioMatch = teacher.bio?.toLowerCase().includes(term);
        const captionMatch = teacher.caption?.toLowerCase().includes(term);
        const skillsMatch = (teacher.skillsOffered || []).some((skill) =>
          skill.toLowerCase().includes(term)
        );

        return nameMatch || bioMatch || captionMatch || skillsMatch;
      });
    }

    if (selectedSkill !== "All") {
      result = result.filter((teacher) =>
        (teacher.skillsOffered || []).includes(selectedSkill)
      );
    }

    if (sortBy === "rating-high") {
      result.sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0) ||
          (b.reviewsCount || 0) - (a.reviewsCount || 0)
      );
    } else if (sortBy === "reviews-high") {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === "name-az") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [teachers, searchTerm, selectedSkill, sortBy]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Explore Skills
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Discover skilled people ready to teach what they know.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by teacher, skill, bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              <option value="default">Sort By</option>
              <option value="rating-high">Highest Rated</option>
              <option value="reviews-high">Most Reviewed</option>
              <option value="name-az">Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading teachers...</p>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-500 text-lg">No teachers found.</p>
            <p className="text-gray-400 mt-2">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      teacher.profileImage && teacher.profileImage.trim() !== ""
                        ? teacher.profileImage
                        : "https://via.placeholder.com/100"
                    }
                    alt={teacher.name}
                    className="w-16 h-16 rounded-full object-cover border"
                  />

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {teacher.name}
                    </h2>
                    <p className="text-sm text-yellow-600 mt-1">
                      ⭐ {teacher.rating || 0} ({teacher.reviewsCount || 0}{" "}
                      reviews)
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mt-4 leading-relaxed">
                  {teacher.caption?.trim() ||
                    teacher.bio?.trim() ||
                    "No description added yet."}
                </p>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Skills Offered
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {teacher.skillsOffered && teacher.skillsOffered.length > 0
                      ? teacher.skillsOffered.join(", ")
                      : "No skills added yet"}
                  </p>
                </div>

                <div className="mt-6">
                  <Link to={`/profile/${teacher._id}`}>
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreSkills;
