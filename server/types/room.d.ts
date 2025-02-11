declare module 'room-types' {
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
}