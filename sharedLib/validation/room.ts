// Room type validation

import { InviteData, RoomPermissions, RoomUpdateData } from "../types";

export function isRoomPermissions(roomPermissions: any): boolean {
    return (
        !!roomPermissions &&
        typeof roomPermissions.admin === "boolean" &&
        typeof roomPermissions.canInviteUser === "boolean" &&
        typeof roomPermissions.canRemoveUser === "boolean"
    );
}

export function isInviteDataMinimum(inviteData: any): inviteData is {
    username: string;
} {
    return !!inviteData && typeof inviteData.username === "string";
}

export function isInviteDataFull(inviteData: any): inviteData is {
    username: string;
    roomPermissions: RoomPermissions;
} {
    return (
        !!inviteData &&
        typeof inviteData.username === "string" &&
        isRoomPermissions(inviteData.roomPermissions)
    );
}

export function isRoomDataMinimum(roomData: any): roomData is {
    roomName: string;
} {
    return !!roomData && typeof roomData.roomName === "string";
}

export function isRoomDataNoUserData(roomData: any): roomData is {
    roomName: string;
    roomOwner: string;
    roomID: string;
} {
    return (
        !!roomData &&
        typeof roomData.roomName === "string" &&
        typeof roomData.roomOwner === "string" &&
        typeof roomData.roomID === "string"
    );
}

export function isRoomDataNoInviteStatus(roomData: any): roomData is {
    roomName: string;
    roomOwner: string;
    roomID: string;
    isMember: boolean;
} {
    return (
        !!roomData &&
        typeof roomData.roomName === "string" &&
        typeof roomData.roomOwner === "string" &&
        typeof roomData.roomID === "string" &&
        typeof roomData.isMember === "boolean"
    );
}

export function isRoomDataFull(roomData: any): roomData is {
    roomName: string;
    roomOwner: string;
    roomID: string;
    isMember: boolean;
    isInvited: boolean;
} {
    return (
        !!roomData &&
        typeof roomData.roomName === "string" &&
        typeof roomData.roomOwner === "string" &&
        typeof roomData.roomID === "string" &&
        typeof roomData.isMember === "boolean" &&
        typeof roomData.isInvited === "boolean"
    );
}

export function isUserRoomData(userRoomData: any): userRoomData is {
    roomData: {
        roomName: string;
    };
    userPermissions: RoomPermissions;
} {
    return (
        !!userRoomData &&
        isRoomDataMinimum(userRoomData.roomData) &&
        isRoomPermissions(userRoomData.userPermissions)
    );
}

export function isRoomUpdateData(
    roomUpdateData: any,
): roomUpdateData is RoomUpdateData {
    return (
        !!roomUpdateData &&
        (typeof roomUpdateData.newRoomName === "string" ||
            typeof roomUpdateData.newOwnerID === "string")
    );
}
