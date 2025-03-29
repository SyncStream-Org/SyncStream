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
      if (userState[`${mediaType}ID`]) {
        throw new Error('Media already set');
      }
      userState[`${mediaType}ID`] = id;
    }
  }

  public clearUserMedia(username: string, mediaType: Types.MediaType): void {
    const userState = this.globalPresence.get(username);
    if (userState) {
      delete userState[`${mediaType}ID`];
    }
  }
}

export default new PresenceState();