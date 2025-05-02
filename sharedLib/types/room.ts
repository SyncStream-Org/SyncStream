import { MediaData, MediaType } from './media';

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

// one or both
export interface RoomUpdateData {
    newRoomName?: string;
    newOwnerID?: string;
}

export interface RoomUserUpdateData {
    username: string;
    isMember: boolean;
}

export interface PresenceData {
    username: string;
    mediaID: string;
    isServer?: boolean;
}

export interface UserPresenceData {
    roomID: string;
    username: string;
}

export type UpdateType = 'create' | 'update' | 'delete';

export interface RoomBroadcastUpdate {
  endpoint: 'room' | 'media' | 'user' | 'presence'; // lets the client know what is being updated
  type: UpdateType;    
  data: MediaData | RoomUpdateData | RoomUserUpdateData | PresenceData;
}

export interface UserBroadcastUpdate {
    endpoint: 'room' | 'presence';
    type: UpdateType;
    data: RoomData | UserPresenceData;
}

export interface RoomPresenceData {
    roomID: string;
    users: string[];
}