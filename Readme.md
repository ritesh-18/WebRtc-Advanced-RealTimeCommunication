### Implementation
- We will be writing the code in 
   - In nodejs for the  `signaling` server. It will be the websocket(you can also use http) that support 3 types of messages : 
       - createOffer 
       - createAnswer
       - addIceCandidate
    - React + PeerConnectionObject on the frontend
       