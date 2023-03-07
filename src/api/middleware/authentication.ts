import createLogger from "../../logger";
import { RPCRequest, RPCResponse } from "../../_types";

const logger = createLogger("authentication");

export function authentication(
  req: RPCRequest,
  res: RPCResponse,
  next: () => void
) {
  if (req.method === "POST") {
    next();
  } else {
    logger.info(`${req.method}-${req.url} request rejected with 400`);
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("Error - only post requests");
  }
}
