import Room from '../models/rooms';

import { RoomCreationAttributes } from 'room-types';

class RoomService {
  public async getRoomById(roomID: string): Promise<Room | null> {
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