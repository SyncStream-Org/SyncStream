export function isValidRoomPermissions(roomPermissions: any): boolean {
  return true; // TODO: this interface is under discussion
}

export function isValidInviteData(inviteData: any): boolean {
  return !!inviteData && typeof inviteData.username === "string";
}