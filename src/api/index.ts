import * as http from "http";
import { Blockchain } from "@ethereumjs/blockchain";
import RPC from "./rpc";
import { Middleware, RPCRequest, RPCResponse } from "../_types";

export default class API {
  private _rpc: RPC;
  private _server: http.Server;
  private _middlewares: Middleware[] = [];

  constructor(blockchain: Blockchain) {
    this._rpc = new RPC(blockchain);
    this._server = http.createServer((req: RPCRequest, res: RPCResponse) => {
      const handleRequest = async (index: number) => {
        if (index >= this._middlewares.length) {
          // If all middlewares have been executed, handle the request using the final request handler
          const { method, params } = req.body;

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          //@ts-ignore
          res.end(JSON.stringify(await this._rpc[method](...params)));
        } else {
          // Otherwise, call the next middleware in the chain
          const middleware = this._middlewares[index];
          middleware(req, res, () => handleRequest(index + 1));
        }
      };

      handleRequest(0);
    });
  }

  use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }

  start(): void {
    this._server.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  }

  stop(): void {
    this._server.close();
  }
}
