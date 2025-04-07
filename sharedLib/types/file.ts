export enum MediaType {
  Document = 'doc',
  Stream = 'stream',
  Voice = 'voice'
}

export interface FilePermissions {
  canEdit: boolean;
}

export interface FileData {
  fileID?: string; // optional for creation, not for server responses
  fileName: string;
  fileExtension: string;
  permissions: FilePermissions;
}

export interface FileDataUpdate {
  // One must be set
  fileName?: string;
  fileExtension?: string;
  permissions?: FilePermissions;
}