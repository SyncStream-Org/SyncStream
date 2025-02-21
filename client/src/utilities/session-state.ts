// The complete session state. Also handles loading and unloading the session cache

import { SessionCache } from '../types/ipctypes';

export default class SessionState {
  private static instance: SessionState = new SessionState();

  public serverURL: string = '';

  public sessionToken: string = '';

  public static getInstance(): SessionState {
    return this.instance;
  }

  // Load session cache from disk
  public loadCache(this: SessionState): Promise<void> {
    return window.electron.ipcRenderer
      .invokeFunction('get-session-cache')
      .then((ret: any) => {
        const cache = ret as SessionCache;
        this.serverURL = cache.serverURL;
      });
  }

  // Save session cache to disk
  public async saveCache(this: SessionState): Promise<void> {
    return window.electron.ipcRenderer.invokeFunction('save-session-cache', {
      serverURL: this.serverURL,
    } as SessionCache);
  }
}
