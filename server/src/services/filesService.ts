import RoomFile from '../models/roomFiles';
import { Types } from 'syncstream-sharedlib';

import { RoomFileCreationAttributes, RoomFilePermissions, RoomFileAttributes } from 'room-types';

class FileService {
  public async getFileFromRoom(roomID: string, fileName: string): Promise<RoomFile | null> {
    const file = await RoomFile.findOne({ where: { roomID:roomID, fileName:fileName } });
    return file;
  }

  public async getFileByFileID(fileID: string): Promise<RoomFile | null> {
    const file = await RoomFile.findOne({ where: { fileID:fileID } });
    return file;
  }

  public async createRoomFile(fileData: RoomFileCreationAttributes): Promise<RoomFile> {
    const file = await RoomFile.create(fileData);
    return file;
  }

  public async deleteRoomFile(file: RoomFile): Promise<void> {
    await file.destroy();
  }

  public async listAllFiles(): Promise<RoomFile[]> {
    const files = await RoomFile.findAll();
    return files;
  }

  public async listAllFilesForRoom(roomID: string): Promise<RoomFile[]> {
    const files = await RoomFile.findAll({ where: { roomID:roomID } });
    return files;
  }

  public async updateRoomFile(file: RoomFile, update: Types.FileDataUpdate): Promise<RoomFile> {
    if (update.fileName) {
      file.fileName = update.fileName;
    }
    if (update.fileExtension) {
      file.fileExtension = update.fileExtension;
    }
    if (update.permissions) {
      file.permissions = update.permissions;
    }

    return await file.save();
  }
}

export default new FileService();