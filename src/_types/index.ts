import * as http from "http";

export interface RPCRequest extends http.IncomingMessage {
  body?: any;
}

export interface RPCResponse extends http.ServerResponse {}

export type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) => void;

export type Tag = "earliest" | "finalized" | "safe" | "latest" | "pending";
