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
  export interface RoomMediaPermissions {
    canEdit: boolean;
  }

  export interface RoomMediaAttributes {
    mediaID: string;
    roomID: string;
    mediaName: string;
    mediaType: string;
    permissions: RoomMediaPermissions;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface RoomMediaCreationAttributes extends Omit<RoomMediaAttributes, 'mediaID'> {}
}