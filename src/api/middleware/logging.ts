import createLogger from "../../logger";
import { RPCRequest, RPCResponse } from "../../_types";

const logger = createLogger("api");

export function logging(req: RPCRequest, res: RPCResponse, next: () => void) {
  logger.info(`${req.method}-${req.url} `);
  next();
}
