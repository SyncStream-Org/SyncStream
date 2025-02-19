export interface StringMessage {
  msg: string;
}

export interface UserAttributes {
  username: string;
  password: string;
  admin: boolean;
  displayName: string;
  email: string;
}

export interface RoomAttributes {
  roomID?: number;
  roomName: string;
  roomOwner: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RoomCreationAttributes extends Omit<RoomAttributes, 'roomID'> {}  

// TODO: define permissions
export interface RoomUserPermissions {
  canEdit: boolean;
}

export interface RoomUserAttributes {
  username: string;
  roomID: number;
  permissions: RoomUserPermissions;
  isMember: boolean;
}

// TODO: define permissions
export interface RoomFilePermissions {
  canEdit: boolean;
}

export interface RoomFileAttributes {
  roomID: number;
  fileName: string;
  fileExtension: string;
  permissions: RoomFilePermissions;
}