export interface FilePermissions {
  canEdit: boolean;
}

export interface FileData {
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