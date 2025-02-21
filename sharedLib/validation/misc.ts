// Misc type validation

export function isStringMessage(stringMessage: any): boolean {
  return !!stringMessage && typeof stringMessage.msg === "string";
}

export function isErrorMessage(errorMessage: any): boolean {
  return (
    !!errorMessage &&
    typeof errorMessage.msg === "string" &&
    typeof errorMessage.relevantData === "string"
  );
}
