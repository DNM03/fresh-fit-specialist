import React, { useEffect, useState, useRef } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  LayoutGrid,
  Settings,
  Users,
  MessageSquare,
  Share2,
  MoreVertical,
} from "lucide-react";

interface StreamInfo {
  streamID: string;
  extraInfo?: string;
}

interface RemoteStreams {
  [streamID: string]: MediaStream;
}

const VideoCallPage: React.FC = () => {
  const [zegoEngine, setZegoEngine] = useState<ZegoExpressEngine | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreams>({});
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [roomID, setRoomID] = useState<string>("");
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>(
    {}
  );
  const [showChat, setShowChat] = useState<boolean>(false);

  // Create a stable streamID when component mounts
  const [localStreamID, setLocalStreamID] = useState<string>("");

  const appID: number = parseInt(import.meta.env.VITE_ZEGOCLOUD_APP_ID);

  const userID: string = `expert1`;
  const userName: string = "Dr. Smith";

  // Add a separate ref for the PiP video
  const localPipVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const zg = new ZegoExpressEngine(
      appID,
      import.meta.env.VITE_ZEGOCLOUD_SERVER_URL
    );
    setZegoEngine(zg);

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        zg.destroyStream(localStream);
      }

      Object.keys(remoteStreams).forEach((streamID) => {
        zg.stopPlayingStream(streamID);
      });

      if (isInRoom) {
        zg.logoutRoom(roomID);
      }

      Object.values(remoteVideoRefs.current).forEach((el) => {
        if (el) el.srcObject = null;
      });
    };
  }, []);

  useEffect(() => {
    if (!zegoEngine) return;

    const handleStreamUpdate = async (
      _roomID: string,
      updateType: "ADD" | "DELETE",
      streamList: StreamInfo[]
    ) => {
      console.log("Stream update:", updateType, streamList);

      if (updateType === "ADD") {
        for (const stream of streamList) {
          try {
            // Don't subscribe to our own stream
            if (stream.streamID === localStreamID) continue;

            console.log("Playing remote stream:", stream.streamID);
            const remoteStream = await zegoEngine.startPlayingStream(
              stream.streamID
            );

            setRemoteStreams((prev) => ({
              ...prev,
              [stream.streamID]: remoteStream,
            }));
          } catch (error) {
            console.error("Failed to play remote stream:", error);
          }
        }
      } else if (updateType === "DELETE") {
        for (const stream of streamList) {
          console.log("Stopping remote stream:", stream.streamID);
          zegoEngine.stopPlayingStream(stream.streamID);

          setRemoteStreams((prev) => {
            const updated = { ...prev };
            delete updated[stream.streamID];
            return updated;
          });
        }
      }
    };

    zegoEngine.on("roomStreamUpdate", handleStreamUpdate);

    return () => {
      zegoEngine.off("roomStreamUpdate", handleStreamUpdate);
    };
  }, [zegoEngine, localStreamID]);

  useEffect(() => {
    console.log("Remote streams updated:", remoteStreams);
    console.log("pip video ref:", localPipVideoRef.current);
    console.log("local video ref:", localVideoRef.current);
    Object.values(remoteVideoRefs.current).forEach((el) => {
      if (el) el.srcObject = null;
    });

    Object.entries(remoteStreams).forEach(([streamID, stream]) => {
      const videoElement = remoteVideoRefs.current[streamID];
      if (videoElement && stream) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  //   // Get token from your backend/service
  //   const getToken = async (): Promise<string> => {
  //     // In a real implementation, you would fetch this from your backend
  //     // This is a placeholder function that simulates getting a token
  //     return new Promise<string>((resolve) => {
  //       // Simulating API call delay
  //       setTimeout(() => {
  //         // In production, replace this with an actual API call
  //         resolve("your-token-will-be-here");
  //       }, 500);
  //     });
  //   };

  // Add this at component level and update it when room changes
  useEffect(() => {
    if (roomID && userID) {
      const newStreamID = `${roomID}_${userID}_${Date.now()}`;
      setLocalStreamID(newStreamID);
      console.log("Setting local stream ID:", newStreamID);
    }
  }, [roomID, userID]);

  const startCall = async (): Promise<void> => {
    if (!zegoEngine || !roomID.trim()) return;
    try {
      setIsLoading(true);

      // Generate a consistent stream ID first
      const newStreamID = `${roomID}_${userID}_${Date.now()}`;
      setLocalStreamID(newStreamID);

      // This is a placeholder token. In a real application, you should fetch this from your backend.
      const token = import.meta.env.VITE_ZEGOCLOUD_TEMP_TOKEN;

      await zegoEngine.loginRoom(roomID, token, { userID, userName });
      setIsInRoom(true);

      console.log("Creating local stream");
      const stream = await zegoEngine.createStream({
        camera: {
          audio: true,
          video: true,
        },
      });

      // Set the stream to state
      setLocalStream(stream);

      // Wait briefly for React to update refs before setting srcObject
      setTimeout(() => {
        // Double-check refs exist and set stream
        if (localVideoRef.current) {
          console.log("Setting main video ref");
          localVideoRef.current.srcObject = stream;
        }

        if (localPipVideoRef.current) {
          console.log("Setting PIP video ref");
          localPipVideoRef.current.srcObject = stream;
        }
      }, 100);

      // Use the same streamID we just set
      console.log("Publishing with stream ID:", newStreamID);
      await zegoEngine.startPublishingStream(newStreamID, stream);
      console.log("Stream published successfully");

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsLoading(false);
    }
  };

  const endCall = async (): Promise<void> => {
    if (!zegoEngine || !isInRoom) return;

    console.log("end call", localStream, remoteStreams);

    try {
      if (localStream) {
        zegoEngine.stopPublishingStream(localStreamID);
        zegoEngine.destroyStream(localStream);
        setLocalStream(null);
      }

      Object.keys(remoteStreams).forEach((streamID) => {
        zegoEngine.stopPlayingStream(streamID);
      });
      setRemoteStreams({});

      zegoEngine.logoutRoom(roomID);
      setIsInRoom(false);
    } catch (error) {
      console.error("Failed to end call:", error);
    }
  };

  const toggleMicrophone = async (): Promise<void> => {
    if (!localStream) return;

    try {
      const newMicState = !isMicOn;
      zegoEngine?.muteMicrophone(!newMicState);
      setIsMicOn(newMicState);
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
    }
  };

  const toggleCamera = async (): Promise<void> => {
    if (!localStream) return;

    try {
      const newState = !isCameraOn;
      zegoEngine?.mutePublishStreamVideo(localStream as MediaStream, !newState);
      setIsCameraOn(newState);
    } catch (error) {
      console.error("Failed to toggle camera:", error);
    }
  };
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const renderLayout = () => {
    const remoteStreamArray = Object.entries(remoteStreams);
    const hasRemoteStreams = remoteStreamArray.length > 0;

    // Debug logs
    console.log("Rendering layout", {
      hasRemoteStreams,
      localStream,
      localPipRef: !!localPipVideoRef.current,
    });

    return (
      <div className="flex flex-1">
        {/* Main video area */}
        <div className="relative flex-1">
          {hasRemoteStreams ? (
            // Remote streams exist - show them as main
            remoteStreamArray.map(([streamID, _stream]) => (
              <div
                key={streamID}
                className="h-[calc(100vh-6rem)] w-full relative"
              >
                <video
                  ref={(el) => {
                    if (el) {
                      remoteVideoRefs.current[streamID] = el;
                      // Immediately set the srcObject if we have the stream
                      const remoteStream = remoteStreams[streamID];
                      if (remoteStream) {
                        el.srcObject = remoteStream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  <span>Patient</span>
                </div>
              </div>
            ))
          ) : (
            // No remote streams - show local stream as main
            <div className="h-[calc(100vh-6rem)] w-full relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                {!isMicOn && <MicOff size={16} className="text-red-500" />}
                <span>You (Doctor)</span>
              </div>
            </div>
          )}

          {/* Always render the PIP but conditionally set visibility */}
          <div
            className={`absolute top-4 right-4 w-64 h-40 shadow-lg rounded-lg overflow-hidden border-2 border-white/20 ${
              hasRemoteStreams && localStream ? "block" : "hidden"
            }`}
          >
            <video
              ref={localPipVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {!isMicOn && <MicOff size={12} className="text-red-500" />}
              <span>You</span>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Chat content */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen text-primary">
      <div className="h-14  flex items-center justify-between px-4 ">
        <div className="flex items-center gap-3">
          <h1 className="font-medium text-lg">Doctor Video Console</h1>
          {isInRoom && (
            <div className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-primary">Room: {roomID}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-primary">
            <Users size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <Settings size={18} />
          </Button>
        </div>
      </div>

      {!isInRoom ? (
        <div className="flex flex-col items-center justify-center flex-1  p-6">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-6 text-center">
              Join Consultation
            </h2>
            <Card>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room ID
                  </label>
                  <Input
                    className="w-full bg-white-700 border-primary text-primary"
                    placeholder="Enter room ID"
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-primary hover:bg-green-700"
                  disabled={isLoading || !roomID.trim()}
                  onClick={startCall}
                >
                  {isLoading ? "Connecting..." : "Start Consultation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          {renderLayout()}

          <div className="h-20  flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-primary">
                <LayoutGrid size={20} />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={isMicOn ? "outline" : "destructive"}
                size="icon"
                className={`rounded-full h-12 w-12 ${
                  isMicOn ? "bg-primary  border-primary text-white" : ""
                }`}
                onClick={toggleMicrophone}
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </Button>

              <Button
                variant={isCameraOn ? "outline" : "destructive"}
                size="icon"
                className={`rounded-full h-12 w-12 ${
                  isCameraOn ? "bg-primary  border-primary text-white" : ""
                }`}
                onClick={toggleCamera}
              >
                {isCameraOn ? <Video /> : <VideoOff />}
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={endCall}
              >
                <PhoneOff />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`text-primary  ${
                  showChat ? "bg-primary text-white" : ""
                }`}
                onClick={toggleChat}
              >
                <MessageSquare size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary">
                <Share2 size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary">
                <MoreVertical size={20} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCallPage;
