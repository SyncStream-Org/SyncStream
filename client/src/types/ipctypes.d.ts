// All the IPC types

import { Language } from '../utilities/localize';

export interface SessionCache {
  serverURL: string;
  darkMode: boolean;
  language: Language;
  audioDeviceID?: string;
}
