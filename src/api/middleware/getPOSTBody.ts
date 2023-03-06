import { RPCRequest, RPCResponse } from "./_types";
const debug = require("debug")("basicRPC:getPOSTBody");

export const getPOSTBody = (
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
      const postBody = JSON.parse(body);
      debug(postBody);
      req.body = postBody;
      next();
    } catch (e: any) {
      debug(e.message);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Error parsing post body");
    }
  });
};
