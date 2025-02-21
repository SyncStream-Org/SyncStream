// Room type validation

export function isRoomPermissions(roomPermissions: any): boolean {
  return (
    !!roomPermissions &&
    typeof roomPermissions.admin === "boolean" &&
    typeof roomPermissions.canInviteUser === "boolean" &&
    typeof roomPermissions.canRemoveUser === "boolean"
  );
}

export function isInviteDataMinimum(inviteData: any): boolean {
  return !!inviteData && typeof inviteData.username === "string";
}

export function isInviteDataFull(inviteData: any): boolean {
  return (
    !!inviteData &&
    typeof inviteData.username === "string" &&
    isRoomPermissions(inviteData.roomPermissions)
  );
}


export function isRoomDataMinimum(roomData: any): boolean {
  return !!roomData && typeof roomData.username === "string";
}

export function isRoomDataFull(roomData: any): boolean {
  return (
    !!roomData &&
    typeof roomData.username === "string" &&
    typeof roomData.roomOwner === "string" &&
    typeof roomData.roomID === "number"
  );
}

export function isValidUserRoomData(userRoomData: any): boolean {
  return (
    !!userRoomData &&
    isRoomDataMinimum(userRoomData.roomData) &&
    isRoomPermissions(userRoomData.userPermissions)
  );
}

