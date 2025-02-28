// Used for basic communication
export interface StringMessage {
  msg: string;
}

export interface ErrorMessage {
  msg: string;
  relevantData: any;
}