import * as Types from "../types"

export function isValidStringMessage(sm: Types.StringMessage): boolean {
    return typeof sm.msg === "string"
}

// TODO: make validation functions for all types