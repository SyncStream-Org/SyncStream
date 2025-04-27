import * as MediaTypes from '../types/media';

export function isMediaType(mediaType: any): mediaType is MediaTypes.MediaType {
  // Check if mediaType is one of the defined MediaType enum values
  return (
    typeof mediaType === 'string' &&
    (mediaType === MediaTypes.MediaType.Document ||
     mediaType === MediaTypes.MediaType.Stream ||
     mediaType === MediaTypes.MediaType.Voice)
  );
}

export function isMediaDataCreation(mediaData: any):
  mediaData is Omit<MediaTypes.MediaData, 'mediaID'> {
  return (
    !!mediaData &&
    typeof mediaData.mediaName === "string" &&
    typeof mediaData.mediaType === "string" &&
    typeof mediaData.permissions === "object" &&
    typeof mediaData.permissions.canEdit === "boolean"
  );
}

export function isMediaData(mediaData: any): 
  mediaData is MediaTypes.MediaData {
  return (
    !!mediaData &&
    typeof mediaData.mediaID === "string" &&
    typeof mediaData.mediaName === "string" &&
    typeof mediaData.mediaType === "string" &&
    typeof mediaData.permissions === "object" &&
    typeof mediaData.permissions.canEdit === "boolean"
  );
}

export function isMediaDataUpdate(mediaDataUpdate: any): 
  mediaDataUpdate is MediaTypes.MediaDataUpdate {
  return (
    !!mediaDataUpdate &&
    (typeof mediaDataUpdate.mediaName === "string" ||
    (typeof mediaDataUpdate.mediaType === "string" && isMediaType(mediaDataUpdate.mediaType)) ||
    (typeof mediaDataUpdate.permissions === "object" && typeof mediaDataUpdate.permissions.canEdit === "boolean"))
  );
}