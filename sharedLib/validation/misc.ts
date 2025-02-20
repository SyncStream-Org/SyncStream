// Misc type validation

export function isValidStringMessage(sm: any): boolean {
  return !!sm && typeof sm.msg === "string"
}
