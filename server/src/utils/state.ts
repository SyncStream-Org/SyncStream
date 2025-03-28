interface UserState {
  roomID: string;
  docID?: string;
  streamID?: string;
  voiceID?: string;
}

type MediaType = 'doc' | 'stream' | 'voice';

class PresenceState {
  private globalPresence: Map<string, UserState>;

  constructor() {
    this.globalPresence = new Map<string, UserState>();
  }

  public addUserEntry(userID: string, roomID: string): void {
    this.globalPresence.set(userID, { roomID });
  }

  public getUserEntry(userID: string): UserState | undefined {
    return this.globalPresence.get(userID);
  }

  public removeUserEntry(userID: string): void {
    this.globalPresence.delete(userID);
  }

  public setUserMedia(userID: string, mediaType: MediaType, id: string): void {
    const userState = this.globalPresence.get(userID);
    if (userState) {
      userState[`${mediaType}ID`] = id;
    }
  }

  public clearUserMedia(userID: string, mediaType: MediaType): void {
    const userState = this.globalPresence.get(userID);
    if (userState) {
      delete userState[`${mediaType}ID`];
    }
  }
}

export default new PresenceState();