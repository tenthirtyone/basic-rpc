import * as http from "http";

export interface RPCRequest extends http.IncomingMessage {
  body?: any;
}

export interface RPCResponse extends http.ServerResponse {}

export type Middleware = {
  req: http.IncomingMessage | RPCRequest;
  res: http.ServerResponse | RPCResponse;
  next: () => void;
};
