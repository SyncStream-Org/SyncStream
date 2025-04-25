import { Request } from "express";
import { WebSocket } from "ws";

interface CallID {
  room: string;
  channel: string;
}

interface Call {
  leader: string | undefined;
  sockets: Map<string, WebSocket>;
}

// Map of callIDs to User websockets
const calls: Map<string, Call> = new Map();

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
    call.sockets.forEach((ws, username, map) => {
      if (username !== from) {
        console.log(`Sent to ${username}`);
        ws.send(JSON.stringify(message));
      }
    });
  } else {
    if (!call.sockets.has(to)) {
      console.error(`Tried to broadcast to a non existent user. ${to}`);
      return;
    }

    const ws = call.sockets.get(to);
    if (ws === undefined) throw Error("Unreachable");

    ws.send(JSON.stringify(message));
  }
};

export default function wsVideoStreams(ws: WebSocket, req: Request) {
  const username = req.query.userid as string;
  const callID = { channel: req.params.channel, room: req.params.roomID };
  const isServer = !((req.query.isClient as string) === "true");

  // Add to map
  const callID_str = JSON.stringify(callID);
  if (!calls.has(callID_str)) {
    calls.set(callID_str, { leader: undefined, sockets: new Map() });
  }

  const call = calls.get(callID_str);
  if (call === undefined) throw Error("Unreachable");

  // Check for leader
  if (call.leader === undefined && isServer) {
    call.leader = username;
    calls.set(callID_str, call);
  } else if (call.leader !== undefined && isServer) {
    ws.close(1008, "FUCK OFF");
    return;
  }

  if (call.sockets.has(username)) {
    console.error(
      `Tried to connect with a user that already is in call. ${callID_str} / ${username}`,
    );
    ws.close();
    return;
  }
  call.sockets.set(username, ws);

  console.log(
    `Client [${username}] in room [${callID.room}] has connected to video channel [${callID.channel}]`,
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(JSON.stringify(data));

      switch (data.type) {
        case "join": {
          broadcast(
            {
              type: "join",
              username: username,
              isServer: isServer,
            },
            callID,
            username,
          );
          break;
        }
        case "leave": {
          broadcast(
            {
              type: "leave",
              username: username,
              isServer: isServer,
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
              isServer: isServer,
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
              isServer: isServer,
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
              isServer: isServer,
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
    const call = calls.get(callID_str);
    if (call === undefined) throw Error("Unreachable");

    call.sockets.delete(username);

    if (isServer) {
      call.leader = undefined;
    }
    
    if (call.sockets.size !== 0) {
      calls.set(callID_str, call);
    } else {
      calls.delete(callID_str);
    }

    console.log(
      `Client [${username}] in room [${callID.room}] has disconnected from video channel [${callID.channel}]`,
    );
  });
}
