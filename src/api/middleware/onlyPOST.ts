import { RPCRequest, RPCResponse } from "./_types";
const debug = require("debug")("basicRPC:onlyPOST");

export function onlyPOST(req: RPCRequest, res: RPCResponse, next: () => void) {
  if (req.method === "POST") {
    debug(req.method);
    next();
  } else {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Error - only post requests");
  }
}
