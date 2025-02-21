export interface UserData {
  username: string;
  email?: string;
  password?: string;
  admin?: boolean;
  displayName?: string;
}

export interface UserUpdateData {
  email?: string;
  password?: string;
  displayName?: string;
}