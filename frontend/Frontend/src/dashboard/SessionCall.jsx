import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmbeddedCall } from "@stream-io/video-react-sdk/embedded";
import "@stream-io/video-react-sdk/dist/css/embedded.css";
import { API_BASE_URL } from "../config";

function SessionCall() {
  const { sessionId } = useParams();
  const [callData, setCallData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const setupCall = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/api/video/token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to get video token");
        }

        setCallData({
          apiKey: data.apiKey,
          token: data.token,
          user: {
            type: "authenticated",
            id: data.user.id,
            name: data.user.name,
            image: data.user.image || "",
          },
        });
      } catch (err) {
        setError(err.message);
      }
    };

    setupCall();
  }, [sessionId]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!callData) {
    return <div className="p-6">Joining call...</div>;
  }

  return (
    <div className="min-h-screen h-screen">
      <EmbeddedCall
        apiKey={callData.apiKey}
        token={callData.token}
        user={callData.user}
        callType="default"
        callId={`session-${sessionId}`}
      />
    </div>
  );
}

export default SessionCall;
