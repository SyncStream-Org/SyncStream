import User from "../models/users";
import Room from "../models/rooms";
import RoomUser from "../models/roomUsers";
import { Types } from "syncstream-sharedlib";

import { RoomUserAttributes, RoomUserPermissions } from "room-types";
import { UserAttributes } from "user-types";

import * as auth from "../utils/auth";

class UserService {
  public async getUserByUsername(username: string): Promise<User | null> {
    const user = await User.findOne({ where: { username } });

    return user;
  }

  public async createUser(user: UserAttributes): Promise<User> {
    if ((await this.getUserByUsername(user.username)) != null) {
      throw new Error("createUser: User already exists");
    }

    const hashedPassword = await auth.hashPassword(user.password);
    user.password = hashedPassword;

    return await User.create(user);
  }

  public async deleteUser(user: User): Promise<void> {
    if ((await this.getUserByUsername(user.username)) == null) {
      throw new Error("deleteUser: User not found");
    }

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

  public async updateUser(user: User, update: Types.UserUpdateData): Promise<User> {
    if ((await this.getUserByUsername(user.username)) == null) {
      throw new Error("updateUser: User not found");
    }

    if (update.password) {
      user.password = await auth.hashPassword(update.password);
    }
    if (update.displayName) {
      user.displayName = update.displayName;
    }
    if (update.email) {
      user.email = update.email;
    }

    return await user.save();
  }

  public async getUserRooms(
    user: User,
    isOwner?: boolean,
    isMember?: boolean,
  ): Promise<Room[]> {
    if ((await this.getUserByUsername(user.username)) == null) {
      throw new Error("getUserRooms: User not found");
    }

    isOwner = isOwner || false;
    isMember = isMember || false;

    const rooms: Room[] = [];
    if (isOwner) {
      const ownedRooms = await Room.findAll({
        where: { roomOwner: user.username },
      });
      if (ownedRooms) {
        rooms.push(...ownedRooms);
      }
    }

    const joinedRoomLinks = await RoomUser.findAll({
      where: { username: user.username, isMember: isMember },
    });
    if (joinedRoomLinks && joinedRoomLinks.length > 0) {
      const joinedRoomIDs = joinedRoomLinks.map(
        (room: RoomUser) => room.roomID,
      );
      const joinedRooms = await Room.findAll({
        where: { roomID: { in: joinedRoomIDs } },
      });
      if (joinedRooms) {
        rooms.push(...joinedRooms);
      }
    }

    return rooms;
  }

  public async getRoomUser(
    roomID: string,
    username: string,
  ): Promise<RoomUser | null> {
    if ((await Room.findOne({ where: { roomID: roomID } })) == null) {
      throw new Error("getRoomUser: Room not found");
    }

    const roomUser = await RoomUser.findOne({
      where: { roomID, username: username },
    });

    return roomUser;
  }

  public async createRoomUser(
    roomID: string,
    roomUser: RoomUserAttributes,
  ): Promise<RoomUser> {
    if ((await this.getRoomUser(roomID, roomUser.username)) != null) {
      throw new Error("createRoomUser: User already in room");
    }

    return await RoomUser.create(roomUser);
  }

  public async removeRoomUser(roomUser: RoomUser): Promise<void> {
    if ((await this.getRoomUser(roomUser.roomID, roomUser.username)) == null) {
      throw new Error("removeRoomUser: User not in room");
    }
    return await roomUser.destroy();
  }

  public async updateRoomUser(
    roomUser: RoomUser,
    newPermissions?: RoomUserPermissions,
    newStatus?: boolean,
  ): Promise<RoomUser> {
    if ((await this.getRoomUser(roomUser.roomID, roomUser.username)) == null) {
      throw new Error("updateRoomUser: User not in room");
    }

    if (newPermissions !== undefined) {
      roomUser.permissions = newPermissions;
    }
    if (newStatus !== undefined) {
      roomUser.isMember = newStatus;
    }

    return await roomUser.save();
  }

  public async listAllUsers(): Promise<User[]> {
    return await User.findAll();
  }
}

export default new UserService();
