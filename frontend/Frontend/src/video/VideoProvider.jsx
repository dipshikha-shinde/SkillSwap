import { useEffect, useState } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import RingingCallsOverlay from "./RingingCallsOverlay";

function VideoProvider({ children }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    const token = localStorage.getItem("streamToken");

    const user = {
      id: localStorage.getItem("userId"),
      name: localStorage.getItem("userName") || "User",
      image: "/default-avatar.png",
    };

    console.log("API KEY:", apiKey);
    console.log("TOKEN:", token);
    console.log("USER:", user);

    if (!apiKey || !token || !user.id) {
      console.warn(
        "Stream client not created because apiKey, token, or user.id is missing"
      );
      return;
    }

    const videoClient = new StreamVideoClient({
      apiKey,
      user,
      token,
    });

    setClient(videoClient);

    return () => {
      videoClient.disconnectUser().catch((err) => {
        console.error("Disconnect error:", err);
      });
    };
  }, []);

  if (!client) {
    return <>{children}</>;
  }

  return (
    <StreamVideo client={client}>
      <RingingCallsOverlay />
      {children}
    </StreamVideo>
  );
}

export default VideoProvider;
