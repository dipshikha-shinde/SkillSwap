import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notifications");
      }
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark notification as read");
      }

      fetchNotifications();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-2">
          Stay updated with replies and activity.
        </p>

        {notifications.length === 0 ? (
          <p className="mt-8 text-gray-500">No notifications yet.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`border rounded-xl p-4 ${
                  notification.isRead
                    ? "border-gray-200 bg-white"
                    : "border-black bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <img
                      src={
                        notification.sender?.profileImage?.trim()
                          ? notification.sender.profileImage
                          : "https://via.placeholder.com/50"
                      }
                      alt={notification.sender?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {notification.message}
                      </p>

                      {notification.post && (
                        <p className="text-sm text-gray-500 mt-1">
                          Topic: {notification.post.topic}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>

                      <div className="flex gap-3 mt-3">
                        <Link to="/community">
                          <button className="border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                            Open Community
                          </button>
                        </Link>

                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
