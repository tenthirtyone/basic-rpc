import { RPCRequest, RPCResponse } from "./_types";
const debug = require("debug")("basicRPC:logger");

export function logger(req: RPCRequest, res: RPCResponse, next: () => void) {
  debug(`${req.method}-${req.url} `);
  next();
}
