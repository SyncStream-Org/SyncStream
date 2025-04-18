import { Types } from "..";

// Misc type validation

export function isStringMessage(stringMessage: any): stringMessage is Types.StringMessage {
  return !!stringMessage && typeof stringMessage.msg === "string";
}

export function isErrorMessage(errorMessage: any): boolean {
  return (
    !!errorMessage &&
    typeof errorMessage.msg === "string" &&
    typeof errorMessage.relevantData === "string"
  );
}
