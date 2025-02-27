import { mock } from 'node:test';
import Room from '../../src/models/rooms';
import RoomService from '../../src/services/roomService';

jest.mock('../../src/models/rooms');
jest.mock('../../src/models/roomFiles');

describe('RoomService', () => {
  let mockRoom: Room;
  beforeEach(() => {
    mockRoom = {
      roomID: 'mockID',
      roomName: 'Test Room',
      roomOwner: 'Test Owner',
    } as Room;
    jest.restoreAllMocks();
  });

  /* Tests for getRoomById */
  it('getRoomById should return room when found', async () => {
    (Room.findOne as jest.Mock).mockResolvedValue(mockRoom);

    const room = await RoomService.getRoomById(mockRoom.roomID);
    expect(room).toEqual(mockRoom);
    expect(Room.findOne).toHaveBeenCalledWith({ where: { roomID: mockRoom.roomID } });
  });

  it('getRoomById should return null when room not found', async () => {
    (Room.findOne as jest.Mock).mockResolvedValue(null);

    const room = await RoomService.getRoomById(mockRoom.roomID);
    expect(room).toBeNull();
    expect(Room.findOne).toHaveBeenCalledWith({ where: { roomID: mockRoom.roomID } });
  });

  /* Tests for createRoom */
  it('createRoom should create and return a new room', async () => {
    (Room.create as jest.Mock).mockResolvedValue(mockRoom);

    const roomData = {
      roomName: 'New Room',
      roomOwner: 'New Owner',
    };
    const room = await RoomService.createRoom(roomData);
    expect(room).toEqual(mockRoom);
    expect(Room.create).toHaveBeenCalledWith(roomData);
  });

  it('createRoom should throw an error if creation fails', async () => {
    (Room.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));

    const roomData = {
      roomName: 'New Room',
      roomOwner: 'New Owner',
    };
    await expect(RoomService.createRoom(roomData)).rejects.toThrow('Creation failed');
  });

  /* Tests for deleteRoom */

  it('deleteRoom should delete the room', async () => {
    mockRoom.destroy = jest.fn();

    await RoomService.deleteRoom(mockRoom);
    expect(mockRoom.destroy).toHaveBeenCalled();
  });

  it('deleteRoom should throw an error if deletion fails', async () => {
    mockRoom.destroy = jest.fn().mockRejectedValue(new Error('Deletion failed'));

    await expect(RoomService.deleteRoom(mockRoom)).rejects.toThrow('Deletion failed');
  });
});