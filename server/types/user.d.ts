declare module 'user-types' {
  export interface UserAttributes {
    username: string;
    password: string;
    admin: boolean;
    displayName: string;
    email: string;
    isPasswordAuto: boolean;
  }
}