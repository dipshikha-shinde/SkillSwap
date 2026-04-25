import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function Navbar() {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const openLogoutModal = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPendingRequestsCount(0);
    setUnreadChatsCount(0);
    setShowLogoutModal(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    let intervalId;

    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setPendingRequestsCount(0);
          setUnreadChatsCount(0);
          return;
        }

        const [requestsRes, chatsRes, notificationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/requests/pending-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/messages/unread-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const notificationsData = await notificationsRes.json();
        const requestsData = await requestsRes.json();
        const chatsData = await chatsRes.json();

        if (requestsRes.ok) {
          setPendingRequestsCount(requestsData.count || 0);
        }
        if (notificationsRes.ok) {
          setUnreadNotificationsCount(notificationsData.count || 0);
        }
        setUnreadNotificationsCount(0);
        0;
        if (chatsRes.ok) {
          setUnreadChatsCount(chatsData.count || 0);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isLoggedIn) {
      fetchCounts();
      intervalId = setInterval(fetchCounts, 5000);
    } else {
      setPendingRequestsCount(0);
      setUnreadChatsCount(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <div className="text-2xl font-bold text-black cursor-pointer">
              SkillSwap
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/exploreSkills"
                  className="hover:text-black transition"
                >
                  Explore Skills
                </Link>

                <a href="#how-it-works" className="hover:text-black transition">
                  How It Works
                </a>

                <a href="#about" className="hover:text-black transition">
                  About
                </a>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-black transition">
                  Dashboard
                </Link>

                <Link
                  to="/requests"
                  className="hover:text-black transition relative"
                >
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/chats"
                  className="hover:text-black transition relative"
                >
                  Chats
                  {unreadChatsCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center">
                      {unreadChatsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="hover:text-black transition relative"
                >
                  Notifications
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                <Link to="/sessions" className="hover:text-black transition">
                  Sessions
                </Link>

                <Link to="/community" className="hover:text-black transition">
                  Community
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <button className="text-gray-700 hover:text-black font-medium">
                    Login
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={openLogoutModal}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Logout
              </button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-5 text-gray-700 font-medium bg-white border-t border-gray-200">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/exploreSkills"
                  className="hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  Explore Skills
                </Link>

                <a
                  href="#how-it-works"
                  className="hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  How It Works
                </a>

                <a
                  href="#about"
                  className="hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  About
                </a>

                <hr />

                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="text-left hover:text-black">Login</button>
                </Link>

                <Link to="/signup" onClick={() => setOpen(false)}>
                  <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition w-fit">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/requests"
                  className="hover:text-black flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/chats"
                  className="hover:text-black flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  Chats
                  {unreadChatsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center">
                      {unreadChatsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="hover:text-black flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  Notifications
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/sessions"
                  className="hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  Sessions
                </Link>

                <Link
                  to="/community"
                  className="hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  Community
                </Link>

                <hr />

                <button
                  onClick={openLogoutModal}
                  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition w-fit"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Logout</h2>
            <p className="text-gray-600 mt-3">
              Are you sure you want to logout from SkillSwap?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelLogout}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
