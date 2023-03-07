import { Blockchain } from "@ethereumjs/blockchain";
import { convertToBigInt } from "../../utils";

export default class RPC {
  _blockchain: Blockchain;
  constructor(blockchain: Blockchain) {
    this._blockchain = blockchain;
  }

  async eth_getBlockByNumber({ blockNumber }: { blockNumber: string }) {
    return await this._blockchain.getBlock(convertToBigInt(blockNumber));
  }
  async eth_getBlockByHash(hash: Buffer) {
    return await this._blockchain.getBlock(hash);
  }
}
