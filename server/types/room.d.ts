declare module 'room-types' {
  export interface RoomAttributes {
    roomID: string;
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
    roomID: string;
    permissions: RoomUserPermissions;
    isMember: boolean;
  }

  // TODO: define permissions
  export interface RoomFilePermissions {
    canEdit: boolean;
  }

  export interface RoomFileAttributes {
    fileID: string;
    roomID: string;
    fileName: string;
    fileExtension: string;
    permissions: RoomFilePermissions;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface RoomFileCreationAttributes extends Omit<RoomFileAttributes, 'fileID'> {}
}