import { Request } from "express";
import { WebSocket } from "ws";

interface CallID {
  room: string;
  channel: string;
}

// Map of callIDs to User websockets
const calls: Map<string, Map<string, WebSocket>> = new Map();

// Broadcast a message to clients in a specific channel (if to is specified, only that client gets the message.)
const broadcast = (message: any, callID: CallID, from: string, to?: string) => {
  console.log(`Broadcasting on ${callID.channel} with ${message.type}`);

  const callID_str = JSON.stringify(callID);
  if (!calls.has(callID_str)) {
    console.error(`Tried to broadcast to a non existent call. ${callID_str}`);
    return;
  }
  const call = calls.get(callID_str);
  if (call === undefined) throw Error("Unreachable");

  if (to === undefined) {
    call.forEach((ws, username, map) => {
      if (username !== from) {
        ws.send(JSON.stringify(message));
      }
    });
  } else {
    if (!call.has(to)) {
      console.error(`Tried to broadcast to a non existent user. ${to}`);
      return;
    }

    const ws = call.get(to);
    if (ws === undefined) throw Error("Unreachable");

    ws.send(JSON.stringify(message));
  }
};

export default function wsAudioCalls(ws: WebSocket, req: Request) {
  const username = req.query.userid as string;
  const callID = { channel: req.params.channel, room: req.params.roomID };

  // Run sanity checks
  // if (callID.room does not exists) {
  //   console.error("Tried to join a channel in a room that does not exist.");
  //   ws.close();
  //   return;
  // }
  // if (callID.channel does not exists) {
  //   console.error("Tried to join a channel that does not exist.");
  //   ws.close();
  //   return;
  // }

  // Add to map
  const callID_str = JSON.stringify(callID);
  if (!calls.has(callID_str)) {
    calls.set(callID_str, new Map());
  }
  const call = calls.get(callID_str);
  if (call === undefined) throw Error("Unreachable");

  if (call.has(username)) {
    console.error(
      `Tried to connect with a user that already is in call. ${callID_str} / ${username}`,
    );
    ws.close();
    return;
  }
  call.set(username, ws);

  console.log(
    `Client [${username}] in room [${callID.room}] has connected to voice channel [${callID.channel}]`,
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case "join": {
          broadcast(
            {
              type: "join",
              username: username,
            },
            callID,
            username,
          );
          break;
        }
        case "offer": {
          broadcast(
            {
              type: "offer",
              sdp: data.sdp,
              username: username,
            },
            callID,
            username,
            data.to,
          );
          break;
        }
        case "answer": {
          broadcast(
            {
              type: "answer",
              sdp: data.sdp,
              username: username,
            },
            callID,
            username,
            data.to,
          );
          break;
        }
        case "candidate": {
          broadcast(
            {
              type: "candidate",
              candidate: data.candidate,
              username: username,
            },
            callID,
            username,
          );
          break;
        }
        default:
          console.error(
            "Unknown message type in voice call signalling server:",
            data.type,
          );
      }
    } catch (err) {
      console.error(
        "Error processing voice call signaling server message:",
        err,
      );
    }
  });

  ws.on("close", () => {
    // Remove the client on disconnection
    call.delete(username);
    console.log(
      `Client [${username}] in room [${callID.room}] has disconnected from voice channel [${callID.channel}]`,
    );
  });
}
