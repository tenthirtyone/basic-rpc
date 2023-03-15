import { RPCRequest, RPCResponse } from "../../_types";
import createLogger from "../../logger";

const logger = createLogger("bodyParser");

export const bodyParser = (
  req: RPCRequest,
  res: RPCResponse,
  next: () => void
) => {
  const data: Buffer[] = [];

  req.on("data", (chunk) => {
    data.push(chunk);
  });

  req.on("end", async () => {
    const rawBody = Buffer.concat(data).toString();
    try {
      req.body = JSON.parse(Buffer.concat(data).toString());
      logger.info(`POST body: ${rawBody}`);
      next();
    } catch (e: any) {
      logger.error(e.message);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/text");
      res.end(e.message);
    }
  });
};
