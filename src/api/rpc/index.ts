import { Blockchain } from "@ethereumjs/blockchain";
import { eth_getBlockByHash, eth_getBlockByNumber } from "./eth";

interface RPCMethod {
  [key: string]: any;
}

export default class RPC {
  _blockchain: Blockchain;
  methods: RPCMethod;

  constructor(blockchain: Blockchain) {
    this._blockchain = blockchain;
    this.methods = {
      eth_getBlockByNumber: eth_getBlockByNumber.bind(null, this._blockchain),
      eth_getBlockByHash: eth_getBlockByHash.bind(null, this._blockchain),
    };
  }
}
