import User from '../models/users';
import Room from '../models/rooms';
import RoomUser from '../models/roomUsers';

import { RoomUserAttributes, RoomUserPermissions } from 'room-types';
import { RoomAttributes } from 'room-types';
import { UserAttributes } from 'user-types';

import * as auth from '../utils/auth';

class UserService {
  public async getUserByUsername(username: string): Promise<User | null> {
    const user = await User.findOne({ where: { username } });

    return user;
  }

  public async createUser(user: UserAttributes): Promise<User> {
    if (await this.getUserByUsername(user.username) != null) {
      throw new Error('User already exists');
    }

    const hashedPassword = await auth.hashPassword(user.password);
    user.password = hashedPassword;

    return await User.create(user);
  }

  public async deleteUser(user: User): Promise<void> {
    const rooms = await this.getUserRooms(user, false, true);

    // TODO: delete owned rooms once room service is implemented
    for (const room of rooms) {
      const roomUser = await this.getRoomUser(room.roomID!, user.username);
      if (roomUser) {
        await this.removeRoomUser(roomUser);
      }
    }

    await user.destroy();
  }

  public async updateUser(user: User, newPassword?: string, newDisplayName?: string): Promise<User> {
    const existingUser = await this.getUserByUsername(user.username);
    if (!existingUser) {
      throw new Error('User not found');
    }
    if (newPassword) {
      const hashedPassword = await auth.hashPassword(newPassword);
      user.password = hashedPassword;
    }
    if (newDisplayName) {
      user.displayName = newDisplayName;
    }

    return await user.save();
  }

  public async getUserRooms(user: User, isOwner?: boolean, isMember?: boolean): Promise<RoomAttributes[]> {
    isOwner = isOwner || false;
    isMember = isMember || false;
    
    const rooms: RoomAttributes[] = [];
    if (isOwner) {
      const ownedRooms = await Room.findAll({ where: { roomOwner: user.username } });
      rooms.push(...ownedRooms);
    }

    const joinedRoomLinks = await RoomUser.findAll({ where: { username: user.username, isMember: isMember } });
    const joinedRoomIDs = joinedRoomLinks.map((room: RoomUserAttributes) => room.roomID);
    const joinedRooms = await Room.findAll({ where: { roomID: { in: joinedRoomIDs } } });
    rooms.push(...joinedRooms);
    
    return rooms;
  }

  public async getRoomUser(roomID: number, username: string): Promise<RoomUser | null> {
    const room = await Room.findOne({ where: { roomID } });
    if (!room) {
      throw new Error('Room not found');
    }

    const roomUser = await RoomUser.findOne({ where: { roomID, username: username } });
    
    return roomUser;
  }

  public async createRoomUser(roomID: number, roomUser: RoomUserAttributes): Promise<RoomUser> {
    if (await this.getRoomUser(roomID, roomUser.username) != null) {
      throw new Error('User already in room');
    }

    return await RoomUser.create(roomUser);
  }

  public async removeRoomUser(roomUser: RoomUser): Promise<void> {
    return await roomUser.destroy();
  }

  public async updateRoomUser(roomUser: RoomUser, newPermissions?: RoomUserPermissions, newStatus?: boolean): Promise<RoomUser> {
    if (newPermissions) {
      roomUser.permissions = newPermissions;
    }
    if (newStatus) {
      roomUser.isMember = newStatus;
    }

    return await roomUser.save();
  }
}

export default new UserService();