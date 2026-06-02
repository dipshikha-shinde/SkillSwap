import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [formData, setFormData] = useState({
    requestId: "",
    title: "",
    date: "",
    time: "",
    mode: "online",
    meetingLink: "",
    notes: "",
  });

  const [reviewData, setReviewData] = useState({
    sessionId: "",
    teacherId: "",
    rating: 5,
    comment: "",
  });

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sessions");
      }

      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/messages/my-chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch accepted requests");
      }
      const savedUser = JSON.parse(localStorage.getItem("user"));

      const uniqueMap = new Map();

      (data || []).forEach((request) => {
        const otherUser =
          request.sender?._id === savedUser.id
            ? request.receiver
            : request.sender;

        if (otherUser && !uniqueMap.has(otherUser._id)) {
          uniqueMap.set(otherUser._id, request);
        }
      });

      setAcceptedRequests(Array.from(uniqueMap.values()));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchAcceptedRequests();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSchedule = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to schedule session");
      }

      setFormData({
        requestId: "",
        title: "",
        date: "",
        time: "",
        mode: "online",
        meetingLink: "",
        notes: "",
      });

      fetchSessions();

      toast.success("Session scheduled successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update session");
      }

      fetchSessions();
    } catch (error) {
      alert(error.message);
    }
  };

  const openReviewForm = (session) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    const otherParticipant = session.participants.find(
      (participant) => participant._id !== savedUser.id
    );

    setReviewData({
      sessionId: session._id,
      teacherId: otherParticipant?._id || "",
      rating: 5,
      comment: "",
    });
  };

  const handleReviewChange = (e) => {
    setReviewData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully");

      setReviewData({
        sessionId: "",
        teacherId: "",
        rating: 5,
        comment: "",
      });

      fetchSessions();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Session</h1>
          <p className="text-gray-500 mt-2">
            Create a session from an accepted request.
          </p>

          <form
            onSubmit={handleSchedule}
            className="grid md:grid-cols-2 gap-4 mt-6"
          >
            <select
              name="requestId"
              value={formData.requestId}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
              required
            >
              <option value="">Select accepted request</option>
              {acceptedRequests.map((request) => (
                <option key={request._id} value={request._id}>
                  {request.sender?.name} ↔ {request.receiver?.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="title"
              placeholder="Session title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
              required
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
              required
            />

            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            <input
              type="text"
              name="meetingLink"
              placeholder="Meeting link (optional)"
              value={formData.meetingLink}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-3"
              rows="4"
            />

            <button
              type="submit"
              className="md:col-span-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Schedule Session
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>

          {sessions.length === 0 ? (
            <p className="text-gray-500 mt-4">No sessions scheduled yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="border border-gray-200 rounded-xl p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {session.title || "Skill Session"}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    Date: {session.date}
                  </p>
                  <p className="text-sm text-gray-600">Time: {session.time}</p>
                  <p className="text-sm text-gray-600">Mode: {session.mode}</p>

                  {session.meetingLink && (
                    <p className="text-sm text-gray-600 break-all">
                      Link: {session.meetingLink}
                    </p>
                  )}

                  {session.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      Notes: {session.notes}
                    </p>
                  )}

                  <p className="text-sm mt-2 font-medium text-gray-700">
                    Status: {session.status}
                  </p>

                  {session.status === "scheduled" && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() =>
                          handleStatusUpdate(session._id, "completed")
                        }
                        className="bg-black text-white px-4 py-2 rounded-lg"
                      >
                        Task Completed
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(session._id, "cancelled")
                        }
                        className="border border-black text-black px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {session.status === "completed" && (
                    <div className="mt-4">
                      <button
                        onClick={() => openReviewForm(session)}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                      >
                        Rate & Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {reviewData.sessionId && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Rate This Session
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleReviewChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  rows="4"
                  placeholder="Write your review..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;
