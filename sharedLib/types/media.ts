export enum MediaType {
  Document = 'doc',
  Stream = 'stream',
  Voice = 'voice'
}

export interface MediaPermissions {
  canEdit: boolean;
}

export interface MediaData {
  mediaID?: string; // optional for creation, not for server responses
  mediaName: string;
  mediaType: string;
  permissions: MediaPermissions;
}

export interface MediaDataUpdate {
  // One must be set
  mediaName?: string;
  mediaType?: string;
  permissions?: MediaPermissions;
}