import { Types } from 'syncstream-sharedlib';
import { Response } from 'express';

class Broadcaster {
  private globalMap: Map<string, Response[]>;

  constructor() {
    this.globalMap = new Map<string, Response[]>();
  }

  public addUserResponse(roomID: string, userRes: Response): void {
    // initialize key entry if it doesn't exist
    if (!this.globalMap.has(roomID)) {
      this.globalMap.set(roomID, [userRes]);
      return;
    }

    // append key entry is it does exist
    this.globalMap.get(roomID)?.push(userRes);
  }

  public removeUserResponse(roomID: string, userRes: Response): void {
    const filteredSet = this.globalMap.get(roomID)!.filter(res => res !== userRes);
    
    // delete key if filtering out the userRes leaves an empty list (room is empty)
    if (filteredSet.length === 0) {
      this.globalMap.delete(roomID);
      return;
    }

    // roomID left with filteredSet 
    this.globalMap.set(
      roomID, filteredSet
    )
  }

  public pushUpdateToUsers(roomID: string, update: Types.BroadcastUpdate): void {
    const userResList = this.globalMap.get(roomID);

    // assertion, should never happen
    if (!userResList) {
      throw Error("userResList empty, should not happen");
    }

    for (const res of userResList) {
      res.write(`data: ${JSON.stringify(update)}\n\n`);
    }
  }
}

export default new Broadcaster();