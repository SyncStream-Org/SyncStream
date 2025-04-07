import * as FileTypes from '../types/file';

export function isMediaType(mediaType: any): mediaType is FileTypes.MediaType {
  // Check if mediaType is one of the defined MediaType enum values
  return (
    typeof mediaType === 'string' &&
    (mediaType === FileTypes.MediaType.Document ||
     mediaType === FileTypes.MediaType.Stream ||
     mediaType === FileTypes.MediaType.Voice)
  );
}

export function isFileDataCreation(fileData: any):
  fileData is Omit<FileTypes.FileData, 'fileId'> {
  return (
    !!fileData &&
    typeof fileData.fileName === "string" &&
    typeof fileData.fileExtension === "string" &&
    typeof fileData.permissions === "object" &&
    typeof fileData.permissions.canEdit === "boolean"
  );
}

export function isFileData(fileData: any): 
  fileData is FileTypes.FileData {
  return (
    !!fileData &&
    typeof fileData.fileID === "string" &&
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