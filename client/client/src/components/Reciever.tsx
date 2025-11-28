import { useEffect, useRef, useState } from "react";

const Receiver = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3005");

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    // Set up track event handler
    pc.ontrack = (event) => {
      console.log("Track received at receiver: ", event.streams[0]);
      if (event.streams && event.streams[0]) {
        setStream(event.streams[0]);
        
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          // Don't call play() here - wait for user interaction
        }
      }
    };

    // Set up ICE candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "new-ice-candidate",
            candidate: event.candidate,
          })
        );
      }
    };

    ws.onopen = () => {
      console.log("WebSocket connection established from receiver");
      ws.send(JSON.stringify({ type: "identify-as-receiver" }));
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message at receiver: ", message.type);

      if (message.type === "offer") {
        try {
          await pc.setRemoteDescription(message.sdp);
          console.log("Remote description set at receiver");

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          ws.send(JSON.stringify({
            type: "create-answer",
            sdp: pc.localDescription,
          }));
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      }

      // Fix ICE candidate timing issue
      if (message.type === "ice-candidate" && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(message.candidate);
          console.log("Added ICE candidate at receiver");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    };

    return () => {
      pc.close();
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  // Handle user interaction to start video
  const handleUserInteraction = async () => {
    setHasUserInteracted(true);
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        console.log("Video started successfully");
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  };

  return (
    <div onClick={handleUserInteraction} style={{ cursor: 'pointer', minHeight: '100vh' }}>
      <div>This is from receiver component</div>
      <div style={{ margin: '10px 0' }}>
        {!hasUserInteracted && (
          <div style={{ 
            background: '#ffeb3b', 
            padding: '10px', 
            borderRadius: '5px',
            margin: '10px 0'
          }}>
            🔔 Click anywhere to start video
          </div>
        )}
        <div>Connection state: {pcRef.current?.connectionState}</div>
        <div>Stream: {stream ? 'Available' : 'Waiting...'}</div>
      </div>
      
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted // Important: muted videos can autoplay
        style={{ 
          width: "400px", 
          height: "400px", 
          border: "2px solid green",
          backgroundColor: "#000",
          display: stream ? 'block' : 'none'
        }}
        onLoadedMetadata={() => console.log("Video metadata loaded")}
        onCanPlay={() => {
          console.log("Video can play");
          // Try to play if user has already interacted
          if (hasUserInteracted && videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        }}
      />
      
      {!stream && (
        <div style={{ 
          width: "400px", 
          height: "400px", 
          border: "2px dashed #ccc",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          Waiting for video stream...
        </div>
      )}
    </div>
  );
};

export default Receiver;  