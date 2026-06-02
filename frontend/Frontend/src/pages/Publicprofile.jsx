import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Publicprofile() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError("");

        const [teacherRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/teachers/${id}`),
          fetch(`${API_BASE_URL}/api/reviews/teacher/${id}`),
        ]);

        const teacherData = await teacherRes.json();
        const reviewsData = await reviewsRes.json();

        if (!teacherRes.ok) {
          throw new Error(teacherData.message || "Failed to load profile");
        }

        if (!reviewsRes.ok) {
          throw new Error(reviewsData.message || "Failed to load reviews");
        }

        setTeacher(teacherData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (!teacher) {
    return <div className="text-center mt-10">Profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={
                teacher.profileImage && teacher.profileImage.trim() !== ""
                  ? teacher.profileImage
                  : "https://via.placeholder.com/160"
              }
              alt={teacher.name}
              className="w-40 h-40 rounded-full object-cover border"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {teacher.name}
              </h1>

              <p className="text-yellow-600 font-medium mt-3">
                ⭐ {teacher.rating || 0} ({teacher.reviewsCount || 0} reviews)
              </p>

              <p className="mt-4 text-gray-700">
                {teacher.caption?.trim() ||
                  teacher.bio?.trim() ||
                  "No description added yet."}
              </p>

              {teacher.bio?.trim() && teacher.caption?.trim() && (
                <p className="mt-3 text-gray-600">{teacher.bio}</p>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Skills Offered
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {teacher.skillsOffered && teacher.skillsOffered.length > 0
                      ? teacher.skillsOffered.join(", ")
                      : "No skills added yet"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Skills Wanted</h3>
                  <p className="text-gray-600 mt-1">
                    {teacher.skillsWanted && teacher.skillsWanted.length > 0
                      ? teacher.skillsWanted.join(", ")
                      : "No learning goals added yet"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Hobbies</h3>
                  <p className="text-gray-600 mt-1">
                    {teacher.hobbies && teacher.hobbies.length > 0
                      ? teacher.hobbies.join(", ")
                      : "No hobbies added yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <p className="text-gray-500 mt-2">Feedback from completed sessions</p>

          {reviews.length === 0 ? (
            <p className="mt-6 text-gray-500">No reviews yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        review.reviewer?.profileImage?.trim()
                          ? review.reviewer.profileImage
                          : "https://via.placeholder.com/50"
                      }
                      alt={review.reviewer?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.reviewer?.name}
                      </p>
                      <p className="text-sm text-yellow-600">
                        ⭐ {review.rating} / 5
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {review.comment || "No written review"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Publicprofile;
