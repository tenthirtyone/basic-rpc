import * as http from "http";
import { Blockchain } from "@ethereumjs/blockchain";
import { convertToBigInt } from "../../utils";

export const rpc = (blockchain: Blockchain) => {
  const jsonrpc: RPC = new RPC(blockchain);
  return (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: () => void
  ) => {
    if (req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        console.log("Received POST body:", body);

        const postBody = JSON.parse(body);
        const { method, params } = postBody;
        console.log(method);

        try {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(await jsonrpc[method](...params));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.end("Error");
        }
      });
    } else {
      next();
    }
  };
};

class RPC {
  _blockchain: Blockchain;
  [key: string]: any;

  constructor(blockchain: Blockchain) {
    this._blockchain = blockchain;
  }

  async eth_getBlockByNumber(blockNumber: string) {
    return JSON.stringify(
      await this._blockchain.getBlock(convertToBigInt(blockNumber))
    );
  }
}
