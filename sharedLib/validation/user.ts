// User Type validation

export function isUserDataMinimum(userData: any): boolean {
  return (
    !!userData &&
    typeof userData.username === "string" &&
    typeof userData.password === "string"
  );
}

export function isUserDataAuth(userData: any): boolean {
  return (
    !!userData &&
    typeof userData.username === "string" &&
    typeof userData.password === "string"
  );
}

export function isUserDataFull(userData: any): boolean {
  return (
    !!userData &&
    typeof userData.username === "string" &&
    typeof userData.email === "string" &&
    typeof userData.password === "string" &&
    typeof userData.admin === "boolean" &&
    typeof userData.displayName === "string"
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
