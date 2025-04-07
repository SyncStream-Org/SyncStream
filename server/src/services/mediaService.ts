import { RoomMedia } from '../models';
import { Types } from 'syncstream-sharedlib';

import { RoomMediaCreationAttributes } from 'room-types';

class MediaService {
  public async getMediaFromRoom(roomID: string, mediaName: string): Promise<RoomMedia | null> {
    const media = await RoomMedia.findOne({ where: { roomID:roomID, mediaName:mediaName } });
    return media;
  }

  public async getMediaByID(mediaID: string): Promise<RoomMedia | null> {
    const media = await RoomMedia.findOne({ where: { mediaID:mediaID } });
    return media;
  }

  public async createRoomMedia(mediaData: RoomMediaCreationAttributes): Promise<RoomMedia> {
    const media = await RoomMedia.create(mediaData);
    return media;
  }

  public async deleteRoomMedia(media: RoomMedia): Promise<void> {
    await media.destroy();
  }

  public async listAllMedia(): Promise<RoomMedia[]> {
    const media = await RoomMedia.findAll();
    return media;
  }

  public async listAllMediaForRoom(roomID: string): Promise<RoomMedia[]> {
    const media = await RoomMedia.findAll({ where: { roomID:roomID } });
    return media;
  }

  public async updateRoomMedia(media: RoomMedia, update: Types.MediaDataUpdate): Promise<RoomMedia> {
    if (update.mediaName) {
      media.mediaName = update.mediaName;
    }
    if (update.mediaType) {
      media.mediaType = update.mediaType;
    }
    if (update.permissions) {
      media.permissions = update.permissions;
    }

    return await media.save();
  }
}

export default new MediaService();