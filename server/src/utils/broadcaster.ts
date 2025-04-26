import { Types } from 'syncstream-sharedlib';
import { Response } from 'express';

class Broadcaster {
  private roomMap: Map<string, Response[]>;
  private userMap: Map<string, Response>;

  constructor() {
    this.roomMap = new Map<string, Response[]>();
    this.userMap = new Map<string, Response>();
  }

  public addRoomResponse(roomID: string, userRes: Response): void {
    // initialize key entry if it doesn't exist
    if (!this.roomMap.has(roomID)) {
      this.roomMap.set(roomID, [userRes]);
      return;
    }

    // append key entry is it does exist
    this.roomMap.get(roomID)?.push(userRes);
  }

  public removeRoomResponse(roomID: string, userRes: Response): void {
    const filteredSet = this.roomMap.get(roomID)!.filter(res => res !== userRes);
    
    // delete key if filtering out the userRes leaves an empty list (room is empty)
    if (filteredSet.length === 0) {
      this.roomMap.delete(roomID);
      return;
    }

    // roomID left with filteredSet 
    this.roomMap.set(
      roomID, filteredSet
    )
  }

  public pushUpdateToRoom(roomID: string, update: Types.RoomBroadcastUpdate): void {
    const userResList = this.roomMap.get(roomID);

    if (!userResList) {
      return;
    }
    
    for (const res of userResList) {
      res.write(`data: ${JSON.stringify(update)}\n\n`);
    }
  }

  public addUserResponse(userID: string, userRes: Response): void {
    this.userMap.set(userID, userRes);
  }

  public removeUserResponse(userID: string): void {
    this.userMap.delete(userID);
  }

  public pushUpdateToUsers(usernames: string[], update: Types.UserBroadcastUpdate): void {
    for (const username of usernames) {
      const userRes = this.userMap.get(username);
      if (userRes) {
        userRes.write(`data: ${JSON.stringify(update)}\n\n`);
      }
    }
  }
}

export default new Broadcaster();