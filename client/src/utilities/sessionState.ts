// Loads and saves the session cache into browser memory

import { SessionState } from '../types/ipctypes';

class StateManager {
  // Update session state by sending to main for saving to disk
  private update(this: StateManager) {
    window.electron.ipcRenderer.sendMessage('save-session-state', {
      serverURL: this.serverURL,
    });
  }

  // Updates all values based on SessionState
  public fullUpdate(this: StateManager, state: SessionState) {
    this.serverURL = state.serverURL;
  }

  // ServerURL
  private serverURL: string | undefined;

  public getServerURL(this: StateManager): string | undefined {
    return this.serverURL;
  }

  public setServerURL(this: StateManager, newURL: string) {
    this.serverURL = newURL;
    this.update();
  }
}

export default new StateManager();
