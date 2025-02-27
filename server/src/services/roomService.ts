import Room from '../models/rooms';

import { RoomCreationAttributes } from 'room-types';
import RoomUser from 'src/models/roomUsers';

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

  public async listAllRooms(): Promise<Room[]> {
    const rooms = await Room.findAll();
    return rooms;
  }

  public async getAllRoomUsers(roomID: string): Promise<RoomUser[]> {
    return await RoomUser.findAll({ where:{ roomID:roomID } });
  }
}

export default new RoomService();