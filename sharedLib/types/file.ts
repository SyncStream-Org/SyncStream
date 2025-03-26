export interface FilePermissions {
  canEdit: boolean;
}

export interface FileData {
  fileId?: string; // optional for creation, not for server responses
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