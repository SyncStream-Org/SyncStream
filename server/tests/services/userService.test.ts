import UserService from '../../src/services/userService';
import * as auth from '../../src/utils/auth';
import User from '../../src/models/users';
import Room from '../../src/models/rooms';
import RoomUser from '../../src/models/roomUsers';


jest.mock('../../src/models/users');
jest.mock('../../src/models/rooms');
jest.mock('../../src/models/roomUsers');
jest.mock('../../src/utils/auth');

describe('UserService', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      username: 'testuser',
      password: 'password123',
    } as User;
    jest.restoreAllMocks();
  });

  const mockRooms = [{ roomID: 1 }, { roomID: 2 }];
  const mockRoomUsers = [{ roomID: 3 }, { roomID: 4 }];
  const mockRoomsJoined = [{ roomID: 4 }, { roomID: 4 }];

  /* Tests for getUserByUsername */

  it('getUserByUsername - should return user if found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(true as unknown as User);
    const result = await UserService.getUserByUsername(mockUser.username);

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: mockUser.username } });
    expect(result).toBe(true);
  });

  it('getUserByUsername - should return null if user not found', async () => {    
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const result = await UserService.getUserByUsername(mockUser.username);

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: mockUser.username } });
    expect(result).toBe(null);
  });

  /* Tests for createUser */

  it('createUser - should create a new user with hashed password', async () => {
    const originalPassword = mockUser.password;
    const mockHashedPassword = 'hashedpassword123';

    jest.spyOn(auth, 'hashPassword').mockResolvedValue(mockHashedPassword);
    jest.spyOn(User, 'create').mockResolvedValue(true);

    const result = await UserService.createUser(mockUser);

    expect(auth.hashPassword).toHaveBeenCalledWith(originalPassword);
    expect(result).toBe(true);
    expect(User.create).toHaveBeenCalledWith({
      ...mockUser,
      password: mockHashedPassword,
    });
  });

  it('createUser - should throw an error if user already exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser as User);

    const result = UserService.createUser(mockUser);

    await expect(result).rejects.toThrow('User already exists');
    expect(User.findOne).toHaveBeenCalledWith({ where: { username: mockUser.username } });
  });

  /* Tests for deleteUser */

  it('deleteUser - should delete user and their room memberships', async () => {
    mockUser.destroy = jest.fn();

    jest.spyOn(UserService, 'getUserRooms').mockResolvedValue(mockRooms as Room[]);
    jest.spyOn(UserService, 'getRoomUser').mockResolvedValue(mockUser as unknown as RoomUser);
    jest.spyOn(UserService, 'removeRoomUser').mockResolvedValue(undefined);

    await UserService.deleteUser(mockUser as unknown as User);

    expect(UserService.getUserRooms).toHaveBeenCalledWith(mockUser, false, true);
    expect(UserService.getRoomUser).toHaveBeenCalledTimes(mockRooms.length);
    expect(UserService.removeRoomUser).toHaveBeenCalledTimes(mockRooms.length);
    expect(mockUser.destroy).toHaveBeenCalled();
  });

  it('deleteUser - should delete the user even if they have no rooms', async () => {
    mockUser.destroy = jest.fn();

    jest.spyOn(UserService, 'getUserRooms').mockResolvedValue([] as Room[]);

    await UserService.deleteUser(mockUser as unknown as User);

    expect(UserService.getUserRooms).toHaveBeenCalledWith(mockUser, false, true);
    expect(mockUser.destroy).toHaveBeenCalled();
  });

  it('deleteUser - should throw an error if user not found', async () => {
    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(null);

    const result = UserService.deleteUser(mockUser as unknown as User);

    await expect(result).rejects.toThrow('User not found');
    expect(UserService.getUserByUsername).toHaveBeenCalledWith(mockUser.username);
  });

  /* Tests for updateUser */

  it('updateUser - should update user password individually', async () => {
    mockUser.save = jest.fn();

    const newPassword = 'newpassword';
    const mockHashedPassword = 'hashednewpassword';

    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(mockUser as unknown as User);
    jest.spyOn(auth, 'hashPassword').mockResolvedValue(mockHashedPassword);

    await UserService.updateUser(mockUser as unknown as User, newPassword);

    expect(auth.hashPassword).toHaveBeenCalledWith(newPassword);
    expect(mockUser.password).toBe(mockHashedPassword);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('updateUser - should update user display name individually', async () => {
    mockUser.save = jest.fn();
    const newDisplayName = 'New Display Name';

    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(mockUser as unknown as User);

    await UserService.updateUser(mockUser as unknown as User, undefined, newDisplayName);

    expect(mockUser.displayName).toBe(newDisplayName);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('updateUser - should update both password and display name', async () => {
    mockUser.save = jest.fn();

    const newPassword = 'newpassword';
    const newDisplayName = 'New Display Name';
    const mockHashedPassword = 'hashednewpassword';

    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(mockUser as unknown as User);
    jest.spyOn(auth, 'hashPassword').mockResolvedValue(mockHashedPassword);

    await UserService.updateUser(mockUser as unknown as User, newPassword, newDisplayName);

    expect(auth.hashPassword).toHaveBeenCalledWith(newPassword);
    expect(mockUser.password).toBe(mockHashedPassword);
    expect(mockUser.displayName).toBe(newDisplayName);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('updateUser - should throw an error if user not found', async () => {
    mockUser.username = 'nonexistentuser';
    const newPassword = 'newpassword';
    const newDisplayName = 'New Display Name';

    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(null);
    const result = UserService.updateUser(mockUser as unknown as User, newPassword, newDisplayName);

    await expect(result).rejects.toThrow('User not found');
    expect(UserService.getUserByUsername).toHaveBeenCalledWith(mockUser.username);
  });

  /* Tests for getUserRooms */

  it('getUserRooms - should return owned rooms', async () => {
    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(mockUser as unknown as User);
    jest.spyOn(Room, 'findAll').mockResolvedValue(mockRooms as Room[]);

    const result = await UserService.getUserRooms(mockUser as unknown as User, true, false);

    expect(Room.findAll).toHaveBeenCalledWith({ where: { roomOwner: mockUser.username } });
    expect(result).toEqual(mockRooms);
  });

  it('getUserRooms - should return joined rooms', async () => {
    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(mockUser as unknown as User);
    jest.spyOn(RoomUser, 'findAll').mockResolvedValue(mockRoomUsers as RoomUser[]);
    jest.spyOn(Room, 'findAll').mockResolvedValue(mockRoomsJoined as Room[]);

    const result = await UserService.getUserRooms(mockUser as unknown as User, false, true);
    
    expect(RoomUser.findAll).toHaveBeenCalledWith({ where: { username: mockUser.username, isMember: true } });
    expect(Room.findAll).toHaveBeenCalledWith({ where: { roomID: { in: mockRoomUsers.map((room) => room.roomID) } } });
    expect(result).toEqual(mockRoomsJoined);
  });

  it('getUserRooms - should return both owned and joined rooms', async () => {
    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(mockUser as unknown as User);
    jest.spyOn(Room, 'findAll').mockResolvedValueOnce(mockRooms as Room[]);
    jest.spyOn(RoomUser, 'findAll').mockResolvedValue(mockRoomUsers as RoomUser[]);
    jest.spyOn(Room, 'findAll').mockResolvedValueOnce(mockRoomsJoined as Room[]);

    const result = await UserService.getUserRooms(mockUser as unknown as User, true, true);

    expect(Room.findAll).toHaveBeenNthCalledWith(1, { where: { roomOwner: mockUser.username } });
    expect(RoomUser.findAll).toHaveBeenCalledWith({ where: { username: mockUser.username, isMember: true } });
    expect(Room.findAll).toHaveBeenNthCalledWith(2, { where: { roomID: { in: mockRoomUsers.map((room) => room.roomID) } } });
    expect(result).toEqual([...mockRooms, ...mockRoomsJoined]);
  });

  it('getUserRooms - should throw an error if user not found', async () => {
    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(null);

    const result = UserService.getUserRooms(mockUser as unknown as User, true, true);
    
    await expect(result).rejects.toThrow('User not found');
    expect(UserService.getUserByUsername).toHaveBeenCalledWith(mockUser.username);
  });
});