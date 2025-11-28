import { useEffect, useState } from "react";

const Sender = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
    // const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3005");

    ws.onopen = () => {
      setWs(ws);
      console.log("WebSocket connection established from sender");
      ws.send(
        JSON.stringify({
          type: "identify-as-sender",
        })
      );
    };
    
  }, []);

  async function startSendingVideo() {
    if (!ws) return;

    //create an rtc peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    //negogiation process
    pc.onnegotiationneeded = async () => {
      console.log("Negotiation needed event triggered");
      const offer = await pc.createOffer(); // we have created sdp offer
      await pc.setLocalDescription(offer); // set the local description
      //send the offer to the signaling server via websocket
      ws.send(
        JSON.stringify({
          type: "create-offer",
          sdp: pc.localDescription,
        })
      );
    };

    //set iceCanidates and send then to signaling server via websocket
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate: ", event.candidate);
        ws.send(
          JSON.stringify({
            type: "new-ice-candidate",
            candidate: event.candidate,
          })
        );
      }
    };

    // listen for answer from the signaling server
    ws!.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message at sender: ", message);
      if (message.type === "answer") {
        //set the remote description
        await pc.setRemoteDescription(message.sdp);
        console.log("Remote description set at sender");
      }
      //if we receive new ice candidate from the receiver{trcikle}
      if (message.type === "ice-candidate") {
        try {
          await pc.addIceCandidate(message.candidate);
          console.log("Added new ICE candidate at sender: ", message.candidate);
        } catch (error) {
          console.error("Error adding received ICE candidate", error);
        }
      }
    };

    //get the video stream from the user's camera
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });
    const stream=await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    })
    //add the tracks to the peer connection
    // pc.addTrack(stream.getVideoTracks()[0], stream);
    // pc.addTrack(stream.getAudioTracks()[0], stream);
    // Or alternatively, you can add all tracks like <this:></this:>
    stream.getTracks().forEach((track) => {
      console.log("Adding track: ", track);
      pc.addTrack(track, stream);
    });
  }

  return (
    <div>
      this is from sender component
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  );
};

export default Sender;
