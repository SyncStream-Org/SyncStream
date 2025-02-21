import * as Types from "../types"

export function isValidStringMessage(sm: Types.StringMessage): boolean {
    return !!sm && typeof sm.msg === "string"
}

export function isUserDataAuth(userData: any): userData is { username:string, password:string } {
    return !!userData && typeof userData.username === "string"
            && typeof userData.password === "string"
}

export function isUserDataCreate(userData: any): userData is { username:string, email:string, password:string, admin:boolean, displayName:string } {
    return !!userData 
            && typeof userData.username === "string"
            && typeof userData.email === "string"
            && typeof userData.password === "string"
            && typeof userData.admin === "boolean"
            && typeof userData.displayName === "string"
}

export function isUserUpdateDate(userUpdateData: any): boolean {
    return !!userUpdateData &&
            (
                typeof userUpdateData.email === "string" ||
                typeof userUpdateData.password === "string" ||
                typeof userUpdateData.displayName === "string"
            )
}

export function isValidRoomPermissions(roomPermissions: any): boolean {
    return true; // TODO: this interface is under discussion
}

export function isValidInviteData(inviteData: any): boolean {
    return !!inviteData && typeof inviteData.username === "string";
}
// TODO: make validation functions for all types