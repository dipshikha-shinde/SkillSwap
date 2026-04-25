import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function PopularSkills() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTeachers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/teachers/top`);
        const data = await response.json();

        if (response.ok) {
          setTeachers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTeachers();
  }, []);

  return (
    <section id="featured-teachers" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Featured Teachers
        </h2>

        <p className="mt-4 text-gray-600">
          Meet some of the highest-rated people in our SkillSwap community
        </p>

        {loading ? (
          <p className="mt-10 text-gray-500">Loading teachers...</p>
        ) : teachers.length === 0 ? (
          <p className="mt-10 text-gray-500">No featured teachers yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
              >
                <img
                  src={
                    teacher.profileImage && teacher.profileImage.trim() !== ""
                      ? teacher.profileImage
                      : "https://via.placeholder.com/100"
                  }
                  alt={teacher.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover"
                />

                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  {teacher.name}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Offers:{" "}
                  <span className="font-medium text-black">
                    {teacher.skillsOffered && teacher.skillsOffered.length > 0
                      ? teacher.skillsOffered.join(", ")
                      : "No skills added yet"}
                  </span>
                </p>

                <p className="text-sm text-yellow-600 font-medium mt-3">
                  ⭐ {teacher.rating || 0} ({teacher.reviewsCount || 0} reviews)
                </p>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {teacher.caption?.trim() ||
                    teacher.bio?.trim() ||
                    "No description added yet"}
                </p>

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

        <div className="mt-12">
          <Link to="/exploreSkills">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Browse All Teachers
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PopularSkills;
