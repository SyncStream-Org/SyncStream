export interface RoomPermissions {
  msg: string;
  // TODO: Complete room permissions setup
}

export interface InviteData {
  username: string;
  permissions?: RoomPermissions;
}

export interface RoomData {
  roomName: string;
  roomOwner?: string;
  roomID?: number;
}

export interface UserRoomData {
  roomData: RoomData;
  userPermissions: RoomPermissions;
}