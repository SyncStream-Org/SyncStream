// MISC
export interface StringMessage {
  msg: string;
}

// USER
export interface UserData {
  username: string;
  email?: string;
  password?: string;
  admin?: boolean;
  displayName?: string;
}

export interface UserUpdateData {
  email?: string;
  password?: string;
  displayName?: string;
}

// ROOM
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