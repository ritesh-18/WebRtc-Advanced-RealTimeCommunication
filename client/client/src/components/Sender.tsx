import { useEffect ,useState } from "react"

const Sender = () => {
  const [ws, setWs]=useState<WebSocket|null>(null);
  useEffect(()=>{
    const ws=new WebSocket('ws://localhost:3005');
    
    ws.onopen=()=>{
      setWs(ws);
      console.log("WebSocket connection established from sender");
      ws.send(JSON.stringify({
        type:'identify-as-sender'
      }))
    }

  },[])
 async function startSendingVideo(){
  //create an rtc peer connection
  const pc= new RTCPeerConnection();
  const offer = await pc.createOffer(); // we have created sdp offer
  await pc.setLocalDescription(offer); // set the local description
  
  //send the offer to the signaling server via websocket
  ws?.send(JSON.stringify({
    type:'create-offer',
    sdp:pc.localDescription
  }))
  // listen for answer from the signaling server
  ws!.onmessage=async(event)=>{
    const message= JSON.parse(event.data);
    console.log("Received message at sender: ", message);
    if(message.type==='answer'){
      //set the remote description
      await pc.setRemoteDescription(message.sdp);
      console.log("Remote description set at sender");
      }
  }
 }


  return (
    <div>
      this is from sender component
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  )
}

export default Sender
