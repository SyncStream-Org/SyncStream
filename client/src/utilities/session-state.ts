// The complete session state. Also handles loading and unloading the session cache

import { Types } from 'syncstream-sharedlib';
import { SessionCache } from '../types/ipctypes';
import Localize from './localize';

export default class SessionState {
  // logic variables
  private static instance: SessionState = new SessionState();

  private hasLoaded: boolean = false;

  // cached variables
  private darkMode: boolean = false;

  public serverURL: string = '';

  public audioDeviceID: string | undefined = undefined;

  // non-cached variables
  public sessionToken: string = '';

  public currentUser: Types.UserData = { username: '' }; // Current user (NO PASS)

  public static getInstance(): SessionState {
    return this.instance;
  }

  // Load session cache from disk
  public loadCache(this: SessionState): Promise<void> {
    // Ignore call if already loaded
    if (this.hasLoaded) {
      return new Promise((resolve) => {
        resolve();
      });
    }

    // Set as loaded and load
    this.hasLoaded = true;
    return window.electron.ipcRenderer
      .invokeFunction('get-session-cache')
      .then((ret: any) => {
        // Grab relevant values for session state
        const cache = ret as SessionCache;
        this.serverURL = cache.serverURL;
        this.darkMode = cache.darkMode;
        this.audioDeviceID = cache.audioDeviceID;

        // Load cached language into localize singleton
        Localize.getInstance().currentLanguage = cache.language;
      });
  }

  // Save session cache to disk
  public async saveCache(this: SessionState): Promise<void> {
    return window.electron.ipcRenderer.invokeFunction('save-session-cache', {
      serverURL: this.serverURL,
      darkMode: this.darkMode,
      audioDeviceID: this.audioDeviceID,
      language: Localize.getInstance().currentLanguage,
    } as SessionCache);
  }

  // Get dark mode
  public getDarkMode(this: SessionState) {
    return this.darkMode;
  }

  // Set dark mode, WARNING: This does not actually change dark mode for the page, only updates for the cache
  public updateDarkMode(this: SessionState, newMode: boolean) {
    this.darkMode = newMode;
  }
}
