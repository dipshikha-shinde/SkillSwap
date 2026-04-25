import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { FaVideo } from "react-icons/fa";

function Chats() {
  const videoClient = useStreamVideoClient();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(savedUser || null);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setCurrentUser(null);
    }
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/messages/my-chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch chats");
      }

      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/messages/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch messages");
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const openChat = async (request) => {
    setSelectedRequest(request);
    await fetchMessages(request._id);
  };

  const getCurrentUserId = () => {
    return currentUser?.id || currentUser?._id;
  };

  const getOtherUser = (request) => {
    if (!currentUser || !request) return null;

    const currentUserId = getCurrentUserId();

    return request.sender?._id === currentUserId
      ? request.receiver
      : request.sender;
  };

  const handleStartVideoCall = async () => {
    console.log("selectedRequest:", selectedRequest);
    console.log("currentUser:", currentUser);
    console.log("videoClient:", videoClient);
    try {
      if (!selectedRequest) {
        toast.error("Select a chat first");
        return;
      }

      if (!currentUser) {
        toast.error("User not loaded yet");
        return;
      }

      if (!videoClient) {
        toast.error("Video client not ready yet");
        return;
      }

      const otherUser = getOtherUser(selectedRequest);

      if (!otherUser?._id) {
        toast.error("Could not find the other user");
        return;
      }

      const callId = crypto.randomUUID().trim();
      const call = videoClient.call("default", callId);

      await call.getOrCreate({
        ring: true,
        video: true,
        data: {
          custom: { type: "video" },
          members: [
            { user_id: String(getCurrentUserId()) },
            { user_id: String(otherUser._id) },
          ],
        },
      });

      toast.success("Calling...");
      navigate(`/call/${callId}`);
    } catch (error) {
      console.error("START VIDEO CALL ERROR:", error);
      toast.error("Failed to start video call");
    }
  };
  const handleStartVoiceCall = async () => {
    console.log("selectedRequest:", selectedRequest);
    console.log("currentUser:", currentUser);
    console.log("videoClient:", videoClient);
    try {
      if (!selectedRequest) {
        toast.error("Select a chat first");
        return;
      }

      if (!currentUser) {
        toast.error("User not loaded yet");
        return;
      }

      if (!videoClient) {
        toast.error("Video client not ready yet");
        return;
      }

      const otherUser = getOtherUser(selectedRequest);

      if (!otherUser?._id) {
        toast.error("Could not find the other user");
        return;
      }

      const callId = crypto.randomUUID().trim();
      const call = videoClient.call("default", callId);

      await call.getOrCreate({
        ring: true,
        video: false,
        data: {
          custom: { type: "audio" },
          members: [
            { user_id: String(getCurrentUserId()) },
            { user_id: String(otherUser._id) },
          ],
        },
      });

      toast.success("Calling...");
      navigate(`/call/${callId}`);
    } catch (error) {
      console.error("START VOICE CALL ERROR:", error);
      toast.error("Failed to start voice call");
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() || !selectedRequest || !currentUser) return;

    try {
      const token = localStorage.getItem("token");
      const otherUser = getOtherUser(selectedRequest);

      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          receiverId: otherUser._id,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setText("");
      fetchMessages(selectedRequest._id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
          <h2 className="text-2xl font-bold text-gray-900">Chats</h2>

          <p className="text-sm text-gray-500 mt-1">
            Accepted requests appear here.
          </p>

          <div className="mt-6 space-y-3">
            {chats.length === 0 ? (
              <p className="text-gray-500">No chats available yet.</p>
            ) : (
              chats.map((chat) => {
                const otherUser = getOtherUser(chat);

                return (
                  <button
                    key={chat._id}
                    onClick={() => openChat(chat)}
                    className={`w-full text-left border rounded-xl p-4 transition ${
                      selectedRequest?._id === chat._id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          otherUser?.profileImage?.trim()
                            ? otherUser.profileImage
                            : "/images/default-avatar.png"
                        }
                        alt={otherUser?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {otherUser?.name}
                        </p>
                        <p className="text-sm text-gray-500">{chat.status}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col h-[75vh]">
          {!selectedRequest ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging.
            </div>
          ) : (
            <>
              <div className="border-b pb-4 mb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {getOtherUser(selectedRequest)?.name}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet.</p>
                ) : (
                  messages.map((message) => {
                    const isMine =
                      currentUser && message.sender?._id === getCurrentUserId();

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            isMine
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
