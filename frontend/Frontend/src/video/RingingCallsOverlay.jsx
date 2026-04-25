import { useEffect } from "react";
import { useCalls, CallingState } from "@stream-io/video-react-sdk";

function RingingCallsOverlay() {
  const calls = useCalls();

  const incomingCall = calls.find(
    (call) =>
      !call.isCreatedByMe && call.state.callingState === CallingState.RINGING
  );

  useEffect(() => {
    console.log("ALL CALLS:", calls);
    console.log("INCOMING CALL:", incomingCall);
  }, [calls, incomingCall]);

  useEffect(() => {
    if (!incomingCall) return;

    const audio = new Audio("/ringtone.mp3");
    audio.loop = true;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [incomingCall]);

  if (!incomingCall) return null;

  const handleAccept = async () => {
    try {
      window.location.assign(`/call/${String(incomingCall.id || "").trim()}`);
    } catch (error) {
      console.error("Accept call error:", error);
    }
  };

  const handleReject = async () => {
    try {
      await incomingCall.leave();
    } catch (error) {
      console.error("Reject call error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center">
        <img
          src="/default-avatar.png"
          alt="caller"
          className="w-20 h-20 rounded-full mx-auto object-cover"
        />

        <h2 className="text-2xl font-bold text-gray-900 mt-4">Incoming Call</h2>

        <p className="text-gray-500 mt-2">Someone is calling you</p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleReject}
            className="px-5 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Reject
          </button>

          <button
            onClick={handleAccept}
            className="px-5 py-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default RingingCallsOverlay;
