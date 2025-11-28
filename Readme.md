### Implementation
- We will be writing the code in 
   - In nodejs for the  `signaling` server. It will be the websocket(you can also use http) that support 3 types of messages : 
       - createOffer 
       - createAnswer
       - addIceCandidate
    - React + PeerConnectionObject on the frontend
       

### Assignment
- A sinle producer can produce to multiple people?
- Add room logic
- Add two way communication.
- Replace p2p logic with an SFU(mediasoup).

- The provided code sets up a basic WebRTC application with a sender and receiver component. The sender component initiates the WebRTC connection, requests camera access, and sends the media data to the receiver. The receiver component listens for incoming media data and renders it in a video element.

#### To extend this implementation, you can consider the following enhancements:

1. **Multiple Producers**:
    - Modify the signaling server to support multiple senders (producers) and multiple receivers.
    - Update the frontend components to handle multiple connections and media streams.
2. **Room Logic**:
    - Implement room functionality on the signaling server to allow users to join specific rooms.
    - Update the frontend components to allow users to create or join rooms.
3. **Two-Way Communication**:
    - Modify the signaling server to handle bi-directional communication between peers.
    - Update the frontend components to enable both sending and receiving media data.
4. **SFU (Selective Forwarding Unit) Integration**:
    - Instead of using a pure peer-to-peer approach, integrate an SFU server like Mediasoup.
    - Update the signaling server to communicate with the SFU server.
    - Modify the frontend components to connect to the SFU server and handle media data accordingly.

> By implementing these enhancements, you can create a more robust and feature-rich WebRTC application that supports multiple producers, room functionality, two-way communication, and scalable media handling with an SFU.
>