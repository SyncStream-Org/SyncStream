import { Room } from '../models';

import { RoomCreationAttributes } from 'room-types';
import { RoomUser } from '../models';

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

  public async getRoomByName(roomName: string): Promise<Room | null> {
    const room = await Room.findOne({ where: { roomName: roomName } });
    return room;
  }

  public async updateRoomOwner(room: Room, userID: string): Promise<Room> {
    room.roomOwner = userID;
    return await room.save()
  }

  public async updateRoomName(room: Room, roomName: string): Promise<Room> {
    room.roomName = roomName;
    return await room.save()
  }
}

export default new RoomService();