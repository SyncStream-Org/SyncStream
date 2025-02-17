import Room from '../models/rooms';
import RoomFile from 'src/models/roomFiles';

import { RoomAttributes, RoomCreationAttributes, RoomFileAttributes, RoomFilePermissions } from 'room-types';

class RoomService {
  public async getRoomById(roomID: number): Promise<Room | null> {
    const room = await Room.findOne({ where: { roomID: roomID } });
    return room;
  }

  public async createRoom(roomData: RoomCreationAttributes): Promise<Room> {
    const room = await Room.create(roomData);
    return room;
  }

  public async deleteRoom(room: Room): Promise<void> {
    await room.destroy();
  }
}

export default new RoomService();