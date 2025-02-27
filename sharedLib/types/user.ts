export interface UserData {
  username: string;
  email?: string;
  password?: string;
  admin?: boolean;
  displayName?: string;
}

export interface RoomsUserData extends UserData {
  isMember: boolean;
}

export interface UserUpdateData { // Note: One must be defined for this to be valid
  email?: string;
  password?: string;
  displayName?: string;
}