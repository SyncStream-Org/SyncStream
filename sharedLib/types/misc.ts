// Used for basic communication
export interface StringMessage {
  msg: string;
}

export interface ErrorMessage {
  error: string;
  relevantData: any;
}