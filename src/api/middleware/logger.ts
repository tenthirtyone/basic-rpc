import * as http from "http";
const debug = require("debug")("API");

export function logger(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) {
  debug(req.method);
  next();
}
