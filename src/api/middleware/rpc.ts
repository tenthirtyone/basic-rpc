import { RPCRequest, RPCResponse } from "./_types";
import { Blockchain } from "@ethereumjs/blockchain";
import { convertToBigInt } from "../../utils";

const debug = require("debug")("basicRPC:rpc");

export const rpc = (blockchain: Blockchain) => {
  const jsonrpc: RPC = new RPC(blockchain);
  return async (req: RPCRequest, res: RPCResponse, next: () => void) => {
    try {
      const { method, params } = req.body;

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(await jsonrpc[method](...params));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Error");
    }
  };
};

//todo attach ref to app on req, move this to its own file,
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
  async eth_getBlockByHash(hash: string) {
    //return JSON.stringify(await this._blockchain.getBlock(hash));
  }
}
