import * as FileTypes from '../types/file';

export function isFileData(fileData: any): 
  fileData is FileTypes.FileData {
  return (
    !!fileData &&
    typeof fileData.fileName === "string" &&
    typeof fileData.fileExtension === "string" &&
    typeof fileData.permissions === "object" &&
    typeof fileData.permissions.canEdit === "boolean"
  );
}

export function isFileDataUpdate(fileDataUpdate: any): 
  fileDataUpdate is FileTypes.FileDataUpdate {
  return (
    !!fileDataUpdate &&
    (typeof fileDataUpdate.fileName === "string" ||
    typeof fileDataUpdate.fileExtension === "string" ||
    (typeof fileDataUpdate.permissions === "object" && typeof fileDataUpdate.permissions.canEdit === "boolean"))
  );
}