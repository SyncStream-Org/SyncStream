import { Types } from 'syncstream-sharedlib';

interface UserState {
  roomID: string;
  docID?: string;
  streamID?: string;
  voiceID?: string;
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

  public setUserMedia(username: string, mediaType: Types.MediaType, id: string): void {
    const userState = this.globalPresence.get(username);
    if (userState) {
      userState[`${mediaType}ID`] = id;
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
}

export default new PresenceState();