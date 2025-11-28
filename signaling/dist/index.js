"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({
    port: 3005
});
console.log(`Signaling seerver started at port no 3005`);
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on("error", (error) => {
        console.error("Websocket error: ", error);
    });
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        console.log("Received message: ", message);
        // identify sender and receiver
        // identify-as-sender
        if (message.type === 'identify-as-sender') {
            senderSocket = ws;
            console.log("Sender identified");
            return;
        }
        // identify-as-receiver
        if (message.type === 'identify-as-receiver') {
            receiverSocket = ws;
            console.log("Receiver identified");
            return;
        }
        //create offer message
        //create answer message
        //create ice candidate message
        // you can use either switch case or if else 
        if (message.type === 'create-offer') {
            if (receiverSocket) {
                console.log("Forwarding offer to receiver");
                receiverSocket.send(JSON.stringify({
                    type: 'offer',
                    sdp: message.sdp // sender ka sdp
                }));
            }
            else {
                console.warn('No receiver connected to forward offer');
            }
            return;
        }
        else if (message.type === 'create-answer') {
            {
                if (senderSocket) {
                    console.log("Forwarding answer to sender");
                    senderSocket.send(JSON.stringify({
                        type: 'answer',
                        sdp: message.sdp // reciever ka sdp
                    }));
                }
                else {
                    console.warn('No sender connected to forward answer');
                }
                return;
            }
        }
        else if (message.type === 'new-ice-candidate') {
            const targetSocket = ws === senderSocket ? receiverSocket : senderSocket; // if sender is there then forward to receiver else forward to sender
            if (targetSocket) {
                console.log("Forwarding ice candidate to the other peer");
                targetSocket.send(JSON.stringify({
                    type: 'ice-candidate',
                    candidate: message.candidate,
                }));
            }
            else {
                console.warn('No target connected to forward ice candidate');
            }
            return;
        }
    });
});
