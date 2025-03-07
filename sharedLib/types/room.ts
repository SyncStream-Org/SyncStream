export interface RoomPermissions {
  admin: boolean; // NOTE: all permissions an owner has, EXCEPT deleting the room
  canInviteUser: boolean;
  canRemoveUser: boolean;
}

export interface InviteData {
  username: string;
  permissions?: RoomPermissions;
}

export interface RoomData {
  roomName: string;
  roomOwner?: string;
  roomID?: string;
  isMember?: boolean;
}

export interface UserRoomData {
  roomData: RoomData; // NOTE: UserRoomData never requires more than minimum RoomData
  userPermissions: RoomPermissions;
}