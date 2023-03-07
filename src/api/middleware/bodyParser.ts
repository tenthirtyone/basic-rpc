import { RPCRequest, RPCResponse } from "../../_types";
import createLogger from "../../logger";

const logger = createLogger("bodyParser");

export const bodyParser = (
  req: RPCRequest,
  res: RPCResponse,
  next: () => void
) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      logger.info(`POST body: ${body}`);
      req.body = JSON.parse(body);
    } catch (e: any) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Error parsing post body");
    }
    next();
  });
};
