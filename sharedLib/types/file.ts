export interface FilePermissions {
  canEdit: boolean;
}

export interface FileData {
  fileID?: string;
  roomID: string;
  fileName: string;
  fileExtension: string;
  permissions: FilePermissions;
}

export interface FileDataUpdate {
  fileID: string;
  roomID: string;
  fileName?: string;
  fileExtension?: string;
  permissions?: FilePermissions;
}