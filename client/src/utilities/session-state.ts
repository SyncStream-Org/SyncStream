// The complete session state. Also handles loading and unloading the session cache

import { SessionCache } from '../types/ipctypes';

class SessionState {
  public serverURL: string = '';

  public sessionToken: string = '';

  public loadCache(this: SessionState) {
    // Load session state from memory on window load (only once)
    window.electron.ipcRenderer
      .invokeFunction('get-session-cache')
      .then((ret: any) => {
        const cache = ret as SessionCache;
        this.serverURL = ret.serverURL;
      });
  }

  public async saveCache(this: SessionState): Promise<void> {
    // Load session state from memory on window load (only once)
    return window.electron.ipcRenderer.invokeFunction('save-session-cache', {
      serverURL: this.serverURL,
    } as SessionCache);
  }
}

export default new SessionState();
