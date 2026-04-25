import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function Requests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/requests/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }
      const uniqueSentMap = new Map();
      (data.sent || []).forEach((request) => {
        const key = request.receiver?._id || request.receiver;
        if (key && !uniqueSentMap.has(key)) {
          uniqueSentMap.set(key, request);
        }
      });

      const uniqueReceivedMap = new Map();
      (data.received || []).forEach((request) => {
        const key = request.sender?._id || request.sender;
        if (key && !uniqueReceivedMap.has(key)) {
          uniqueReceivedMap.set(key, request);
        }
      });

      setSent(Array.from(uniqueSentMap.values()));
      setReceived(Array.from(uniqueReceivedMap.values()));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/requests/${requestId}`,
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
        throw new Error(data.message || "Failed to update request");
      }

      fetchRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Received Requests
          </h1>

          {received.length === 0 ? (
            <p className="mt-4 text-gray-500">No requests received yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {received.map((request) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {request.sender?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.message || "No message"}
                    </p>
                    <p className="text-sm mt-1 text-gray-600">
                      Status: {request.status}
                    </p>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(request._id, "accepted")
                        }
                        className="bg-black text-white px-4 py-2 rounded-lg"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(request._id, "rejected")
                        }
                        className="border border-black text-black px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900">Sent Requests</h1>

          {sent.length === 0 ? (
            <p className="mt-4 text-gray-500">No requests sent yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {sent.map((request) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <p className="font-semibold text-gray-900">
                    {request.receiver?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {request.message || "No message"}
                  </p>
                  <p className="text-sm mt-1 text-gray-600">
                    Status: {request.status}
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

export default Requests;
