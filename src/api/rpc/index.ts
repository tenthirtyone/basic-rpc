import { Blockchain } from "@ethereumjs/blockchain";
import { convertToBigInt, flattenObject } from "../../utils";

interface RPCMethod {
  [key: string]: any;
}

export default class RPC {
  _blockchain: Blockchain;
  methods: RPCMethod;

  constructor(blockchain: Blockchain) {
    this._blockchain = blockchain;
    this.methods = {
      eth_getBlockByNumber: this.eth_getBlockByNumber.bind(this),
      eth_getBlockByHash: this.eth_getBlockByHash.bind(this),
    };
  }

  async eth_getBlockByNumber({ blockNumber }: { blockNumber: string }) {
    return flattenObject(
      (await this._blockchain.getBlock(convertToBigInt(blockNumber))).toJSON()
    );
  }
  async eth_getBlockByHash(hash: Buffer) {
    return await this._blockchain.getBlock(hash);
  }
}
