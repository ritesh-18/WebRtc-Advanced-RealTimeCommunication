import { useEffect } from "react";

const Reciever = () => {
   useEffect(()=>{
      const ws=new WebSocket('ws://localhost:3005');
      ws.onopen=()=>{
        console.log("WebSocket connection established from reciever");
        ws.send(JSON.stringify({
          type:'identify-as-receiver'
        }))
      }
      //at any time we get the message from the signaling server we need to handle it 
      ws.onmessage=async(event)=>{
        const message=JSON.parse(event.data);
        console.log("Received message at reciever: ", message);
        // if the message is of type offer then we need to create an answer
        if(message.type==='offer'){
              // create an rtpc connectionm
              const pc = new RTCPeerConnection();
              // set the remote descripition
              await pc.setRemoteDescription(message.sdp);
              //create an answer
              const answer=await pc.createAnswer();
              
              await pc.setLocalDescription(answer);
              //send the answer back to the signaling server via websocket
              ws.send(JSON.stringify({
                type:'create-answer',
                sdp:pc.localDescription
              }))
        }


      }
  
    },[])
  return (
    <div>
      this is from reciever component
    </div>
  )
}

export default Reciever

