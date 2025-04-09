import { Request } from "express";
import { WebSocket } from "ws";

interface Client {
  id: string;
  socket: WebSocket;
  channel: string;
}

const clients: Client[] = [];

// Broadcast a message to all clients in a specific channel
const broadcast = (message: any, senderId: string, channel: string) => {
  clients.forEach((client) => {
    if (client.channel === channel && client.id !== senderId) {
      client.socket.send(JSON.stringify(message));
    }
  });
};

export default function wsAudioCalls(ws: WebSocket, req: Request) {
  let clientId = "";
  let clientChannel = "";

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case "join": {
          // Register a client to a channel
          clientId = data.id;
          clientChannel = data.channel;

          clients.push({ id: clientId, socket: ws, channel: clientChannel });
          console.log(`Client ${clientId} joined channel ${clientChannel}`);
          break;
        }
        case "offer":
        case "answer":
        case "candidate": {
          // Broadcast signaling data to other clients in the same channel
          broadcast(
            {
              type: data.type,
              offer: data.offer,
              answer: data.answer,
              candidate: data.candidate,
              sender: clientId,
            },
            clientId,
            clientChannel,
          );
          break;
        }
        default:
          console.error("Unknown message type:", data.type);
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    // Remove the client on disconnection
    const index = clients.findIndex((client) => client.id === clientId);
    if (index !== -1) {
      clients.splice(index, 1);
      console.log(
        `Client ${clientId} disconnected from channel ${clientChannel}`,
      );
    }
  });
}
