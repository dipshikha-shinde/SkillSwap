import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import { fetchWithAuth } from "../utils/fetchWithAuth";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetchWithAuth(`${API_BASE_URL}/api/users/me`);

        const userData = await userRes.json();
        setUser(userData);

        const teachersRes = await fetch(`${API_BASE_URL}/api/public/teachers`);
        const teachersData = await teachersRes.json();
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
        const reqRes = await fetchWithAuth(
          `${API_BASE_URL}/api/requests/my-requests`
        );

        const reqData = await reqRes.json();

        setMyRequests([...(reqData.sent || []), ...(reqData.received || [])]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleRequestSession = async (teacherId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: teacherId,
          message: "Hi, I would like to request a learning session.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      toast.success("Request sent successfully!");

      const reqRes = await fetchWithAuth(
        `${API_BASE_URL}/api/requests/my-requests`
      );

      const reqData = await reqRes.json();
      setMyRequests([...(reqData.sent || []), ...(reqData.received || [])]);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getRequestForTeacher = (teacherId) => {
    const currentUserId = user?._id || user?.id;

    const relatedRequests = myRequests.filter((request) => {
      const senderId =
        typeof request.sender === "object"
          ? request.sender?._id
          : request.sender;

      const receiverId =
        typeof request.receiver === "object"
          ? request.receiver?._id
          : request.receiver;

      const isBetweenUsers =
        (String(senderId) === String(currentUserId) &&
          String(receiverId) === String(teacherId)) ||
        (String(senderId) === String(teacherId) &&
          String(receiverId) === String(currentUserId));

      return isBetweenUsers;
    });

    if (relatedRequests.length === 0) return null;

    const acceptedRequest = relatedRequests.find(
      (r) => r.status === "accepted"
    );
    if (acceptedRequest) return acceptedRequest;

    const pendingRequest = relatedRequests.find((r) => r.status === "pending");
    if (pendingRequest) return pendingRequest;

    const rejectedRequest = relatedRequests.find(
      (r) => r.status === "rejected"
    );
    if (rejectedRequest) return rejectedRequest;

    return relatedRequests[0];
  };
  const getFilledArrayCount = (arr) =>
    Array.isArray(arr) && arr.filter((item) => item?.trim?.()).length > 0;

  const normalizeSkills = (skills) =>
    Array.isArray(skills)
      ? skills.map((skill) => skill.toLowerCase().trim()).filter(Boolean)
      : [];

  const getMatchData = (teacher, wantedSkills) => {
    const offeredSkills = normalizeSkills(teacher?.skillsOffered);
    const matchedSkills = wantedSkills.filter((skill) =>
      offeredSkills.includes(skill)
    );

    return {
      ...teacher,
      matchedSkills,
      matchCount: matchedSkills.length,
    };
  };

  const teacherSections = useMemo(() => {
    if (!user) {
      return { recommendedTeachers: [], otherTeachers: [] };
    }

    const wantedSkills = normalizeSkills(user.skillsWanted);

    const filteredTeachers = teachers
      .filter((teacher) => {
        const isCurrentUser =
          String(teacher?._id) === String(user?._id) ||
          String(teacher?._id) === String(user?.id) ||
          teacher?.email === user?.email;

        return !isCurrentUser;
      })
      .map((teacher) => getMatchData(teacher, wantedSkills));

    const recommendedTeachers = filteredTeachers
      .filter((teacher) => teacher.matchCount > 0)
      .sort(
        (a, b) =>
          b.matchCount - a.matchCount ||
          (b.rating || 0) - (a.rating || 0) ||
          (b.reviewsCount || 0) - (a.reviewsCount || 0)
      );

    const recommendedIds = new Set(
      recommendedTeachers.map((teacher) => String(teacher._id))
    );

    const otherTeachers = filteredTeachers
      .filter((teacher) => !recommendedIds.has(String(teacher._id)))
      .sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0) ||
          (b.reviewsCount || 0) - (a.reviewsCount || 0)
      );

    return { recommendedTeachers, otherTeachers };
  }, [teachers, user]);

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const completionChecks = [
    user?.profileImage && user.profileImage.trim() !== "",
    user?.name && user.name.trim() !== "",
    user?.caption && user.caption.trim() !== "",
    user?.bio && user.bio.trim() !== "",
    getFilledArrayCount(user?.hobbies),
    getFilledArrayCount(user?.skillsOffered),
    getFilledArrayCount(user?.skillsWanted),
  ];

  const completedCount = completionChecks.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedCount / completionChecks.length) * 100
  );

  const { recommendedTeachers, otherTeachers } = teacherSections;

  const renderTeacherCard = (teacher) => (
    <div
      key={teacher._id}
      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50"
    >
      <div className="flex items-center gap-4">
        <img
          src={
            teacher?.profileImage && teacher.profileImage.trim() !== ""
              ? teacher.profileImage
              : "https://via.placeholder.com/120"
          }
          alt={teacher?.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {teacher?.name}
          </h3>

          <p className="text-sm text-gray-600">
            Offers:{" "}
            <span className="font-medium text-black">
              {teacher?.skillsOffered && teacher.skillsOffered.length > 0
                ? teacher.skillsOffered.join(", ")
                : "No skills added yet"}
            </span>
          </p>

          <p className="text-sm text-yellow-600 mt-1">
            ⭐ {teacher?.rating || 0}
          </p>
        </div>
      </div>

      {teacher.matchCount > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Matches Your Learning Goals
          </p>
          <div className="flex flex-wrap gap-2">
            {teacher.matchedSkills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="px-3 py-1 rounded-full bg-black text-white text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 mt-4 leading-relaxed">
        {teacher?.caption && teacher.caption.trim() !== ""
          ? teacher.caption
          : teacher?.bio && teacher.bio.trim() !== ""
          ? teacher.bio
          : "No description added yet"}
      </p>

      <div className="flex gap-3 mt-5">
        <Link to={`/profile/${teacher._id}`}>
          <button className="border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            View Profile
          </button>
        </Link>

        {(() => {
          const existingRequest = getRequestForTeacher(teacher._id);
          const status = existingRequest?.status;

          if (status === "pending") {
            return (
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed">
                Requested
              </button>
            );
          }

          if (status === "accepted") {
            return (
              <Link to="/chats">
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  Go to Chat
                </button>
              </Link>
            );
          }

          if (status === "rejected") {
            return (
              <button
                onClick={() => handleRequestSession(teacher._id)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Request Again
              </button>
            );
          }

          return (
            <button
              onClick={() => handleRequestSession(teacher._id)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Request Session
            </button>
          );
        })()}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <img
              src={
                user?.profileImage && user.profileImage.trim() !== ""
                  ? user.profileImage
                  : "https://via.placeholder.com/120"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border mb-4"
            />

            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>

            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

            <p className="mt-4 text-gray-600 text-sm">
              {user?.caption && user.caption.trim() !== ""
                ? user.caption
                : user?.bio && user.bio.trim() !== ""
                ? user.bio
                : "Add a short caption about yourself here."}
            </p>

            <div className="w-full mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Profile Completion
                </h3>
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

              <p className="text-xs text-gray-500 mt-3">
                {completionPercentage === 100
                  ? "Your profile looks complete and strong."
                  : "Complete your profile to get better matches and build trust."}
              </p>
            </div>

            <Link to="/edit-profile">
              <button className="mt-5 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition">
                Edit Profile
              </button>
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Hobbies</h3>
              <p className="text-sm text-gray-500 mt-1">
                {user?.hobbies && user.hobbies.length > 0
                  ? user.hobbies.join(", ")
                  : "No hobbies added yet"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Skills Offered
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {user?.skillsOffered && user.skillsOffered.length > 0
                  ? user.skillsOffered.join(", ")
                  : "No skills added yet"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Skills Wanted
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {user?.skillsWanted && user.skillsWanted.length > 0
                  ? user.skillsWanted.join(", ")
                  : "No skills added yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended for You
            </h2>

            <p className="text-gray-600 mt-2">
              Based on the skills you want to learn.
            </p>

            {recommendedTeachers.length === 0 ? (
              <p className="text-gray-500 mt-6">
                No skill-based matches yet. Complete your learning goals to get
                better recommendations.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {recommendedTeachers.map(renderTeacherCard)}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Other Teachers</h2>

            <p className="text-gray-600 mt-2">
              Browse more teachers and send requests for sessions.
            </p>

            {otherTeachers.length === 0 ? (
              <p className="text-gray-500 mt-6">
                No other teachers available yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {otherTeachers.map(renderTeacherCard)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
