import * as http from "http";
import Miner from "../miner";
import RPC from "./rpc";
import { Middleware, RPCRequest, RPCResponse } from "../_types";
import { authentication, logging, bodyParser } from "./middleware";
import createLogger from "../logger";

const requestLogger = createLogger("RPC Request");
const responseLogger = createLogger("RPC Response");
export default class API {
  private _miner: Miner;
  private _rpc: RPC;
  private _server: http.Server;
  private _middlewares: Middleware[] = [];

  constructor(miner: Miner) {
    this.use(logging);
    this.use(authentication);
    this.use(bodyParser);
    this._miner = miner;
    this._rpc = new RPC(this._miner);
    this._server = http.createServer((req: RPCRequest, res: RPCResponse) => {
      const handleRequest = async (index: number) => {
        if (index >= this._middlewares.length) {
          // If all middlewares have been executed, handle the request using the final request handler
          const { id, method, params } = req.body;
          requestLogger.info(`${method}(${params.join(",")})`);

          try {
            const result = await this._rpc.methods[method](...params);

            const payload = {
              jsonrpc: "2.0",
              id,
              result,
            };

            responseLogger.info(JSON.stringify(payload));
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
          } catch (e: any) {
            responseLogger.error(e.message);
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            res.end(`Error: ${e.message}`);
          }
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
