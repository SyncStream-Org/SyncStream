import User from '../models/users';
import Room from '../models/rooms';
import RoomUser from '../models/roomUsers';

import { RoomUserAttributes } from 'room-types';
import { RoomAttributes } from 'room-types';
import { UserAttributes } from 'user-types';

import * as auth from '../utils/auth';

class UserService {
  public async createUser(user: UserAttributes): Promise<User> {
    const hashedPassword = await auth.hashPassword(user.password);
    user.password = hashedPassword;
    return await User.create(user);
  }

  public async authenticateUser(username: string, password: string): Promise<string> {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await auth.comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    return auth.generateToken(username);
  }

  public async validateToken(token: string): Promise<User> {
    const username = await auth.verifyToken(token);
    if (!username) {
      throw new Error('Invalid token');
    }
    const validatedUser = await User.findOne({ where: { username: username } });
    if (!validatedUser) {
      throw new Error('User not found');
    }
    return validatedUser;
  }

  public async getUserRooms(user: User, isOwner?: boolean, isMember?: boolean): Promise<RoomAttributes[]> {
    isOwner = isOwner || false;
    isMember = isMember || true;
    
    const rooms: RoomAttributes[] = [];
    if (isOwner) {
      const ownedRooms = await Room.findAll({ where: { roomOwner: user.username } });
      rooms.push(...ownedRooms);
    }

    const joinedRoomLinks = await RoomUser.findAll({ where: { username: user.username, isMember: isMember } });
    const joinedRoomIDs = joinedRoomLinks.map((room: RoomUserAttributes) => room.roomID);
    const joinedRooms = await Room.findAll({ where: { roomID: joinedRoomIDs } });
    rooms.push(...joinedRooms);
    
    return rooms;
  }


}

export default new UserService();