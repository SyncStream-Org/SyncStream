// User Type validation

export function isUserDataAuth(
  userData: any
): userData is { username: string; password: string } {
  return (
    !!userData &&
    typeof userData.username === "string" &&
    typeof userData.password === "string"
  );
}

export function isUserUpdateDate(userUpdateData: any): boolean {
  return (
    !!userUpdateData &&
    (typeof userUpdateData.email === "string" ||
      typeof userUpdateData.password === "string" ||
      typeof userUpdateData.displayName === "string")
  );
}

// TODO: make validation functions for all types