import { Types } from 'syncstream-sharedlib';

interface UserState {
  roomID: string;
  docID?: string;
  streamID?: string;
  voiceID?: string;
  isServer?: boolean;
}

class PresenceState {
  private globalPresence: Map<string, UserState>;

  constructor() {
    this.globalPresence = new Map<string, UserState>();
  }

  public addUserEntry(username: string, roomID: string): void {
    this.globalPresence.set(username, { roomID });
  }

  public getUserEntry(username: string): UserState | undefined {
    return this.globalPresence.get(username);
  }

  public removeUserEntry(username: string): void {
    this.globalPresence.delete(username);
  }

  public setUserMedia(username: string, mediaType: Types.MediaType, id: string, isServer?: boolean): void {
    const userState = this.globalPresence.get(username);
    if (userState) {
      userState[`${mediaType}ID`] = id;
      userState.isServer = isServer;
    }
  }

  public getUserMedia(username: string, mediaType: Types.MediaType): string | null {
    const userState = this.globalPresence.get(username);
    if (userState) {
      return userState[`${mediaType}ID`] || null;
    }
    return null;
  }
  
  public clearUserMedia(username: string, mediaType: Types.MediaType): void {
    const userState = this.globalPresence.get(username);
    if (userState) {
      delete userState[`${mediaType}ID`];
    }
  }

  public getPresenceForRoom(roomID: string): Types.MediaPresenceData[] {
    // filter out users that are not in the room
    const roomPresence = Array.from(this.globalPresence.entries())
      .filter(([_, userState]) => userState.roomID === roomID)
      .map(([username, userState]) => ({ username, ...userState }));
    // create a map of media IDs, with a list of users that have that media
    const mediaMap = new Map<string, Omit<Types.MediaPresenceData, "mediaID">>();
    roomPresence.forEach(({ username, docID, streamID, voiceID, isServer }) => {
      const mediaIDs = [docID, streamID, voiceID].filter(Boolean) as string[];
      mediaIDs.forEach((mediaID) => {
        if (!mediaMap.has(mediaID)) {
          mediaMap.set(mediaID, { users: [], isServerSet: isServer });
        }
        mediaMap.get(mediaID)!.users.push(username);
        mediaMap.get(mediaID)!.isServerSet = isServer || mediaMap.get(mediaID)!.isServerSet;
      });
    });
    // convert the map to an array of Types.MediaPresenceData
    const presence: Types.MediaPresenceData[] = Array.from(mediaMap.entries()).map(([mediaID, { users, isServerSet }]) => ({
      mediaID,
      users,
      isServerSet,
    }));
    return presence;
  }

  public checkIfServer(mediaID: string): boolean {
    Array.from(this.globalPresence.values()).forEach((userState) => {
      if (userState.streamID === mediaID && userState.isServer) {
        return true;
      }
    });
    return false;
  }
}

export default new PresenceState();