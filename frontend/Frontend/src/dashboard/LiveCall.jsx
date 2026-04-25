import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  StreamCall,
  useStreamVideoClient,
  PaginatedGridLayout,
  StreamTheme,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  ReactionsButton,
  SpeakingWhileMutedNotification,
  CallingState,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

function LiveCallInner({ call }) {
  const navigate = useNavigate();

  useEffect(() => {
    const joinCall = async () => {
      try {
        await call.join();
      } catch (error) {
        const msg = String(error?.message || "").toLowerCase();
        if (!msg.includes("already")) {
          console.error("Join failed:", error);
        }
      }
    };

    joinCall();

    return () => {
      call.leave().catch(() => {});
    };
  }, [call]);

  useEffect(() => {
    const unsubscribe = call.state.callingState$.subscribe((state) => {
      if (state === CallingState.LEFT) {
        navigate("/chats", { replace: true });
      }
    });

    return () => {
      unsubscribe.unsubscribe?.();
    };
  }, [call, navigate]);

  const handleLeaveForBoth = async () => {
    try {
      await call.endCall();
      navigate("/chats", { replace: true });
    } catch (error) {
      console.error("End call failed:", error);
      try {
        await call.leave();
      } catch {}
      navigate("/chats", { replace: true });
    }
  };

  const isAudioCall = call?.state?.custom?.type === "audio";

  return (
    <StreamTheme>
      <div className="fixed inset-0 bg-black flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center">
          {isAudioCall ? (
            <div className="text-center text-white">
              <div className="w-28 h-28 rounded-full bg-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold">Voice Call</h2>
              <p className="text-gray-300 mt-2">Audio-only call in progress</p>
            </div>
          ) : (
            <PaginatedGridLayout />
          )}
        </div>

        <div className="bg-black px-4 py-4 flex justify-center items-center gap-4 flex-wrap">
          <SpeakingWhileMutedNotification>
            <ToggleAudioPublishingButton />
          </SpeakingWhileMutedNotification>

          {!isAudioCall && <ToggleVideoPublishingButton />}

          {!isAudioCall && <ScreenShareButton />}

          <ReactionsButton />

          <button
            onClick={handleLeaveForBoth}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Leave Call
          </button>
        </div>
      </div>
    </StreamTheme>
  );
}

function LiveCall() {
  const { callId: rawCallId } = useParams();
  const callId = String(rawCallId || "").trim();
  const client = useStreamVideoClient();

  const call = useMemo(() => {
    if (!client || !callId) return null;
    return client.call("default", callId);
  }, [client, callId]);

  if (!client || !call) {
    return (
      <div className="fixed inset-0 bg-black text-white p-6">
        Loading call...
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <LiveCallInner call={call} />
    </StreamCall>
  );
}

export default LiveCall;
