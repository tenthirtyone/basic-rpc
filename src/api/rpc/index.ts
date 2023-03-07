import Miner from "../../miner";
import { convertToBigInt, flattenObject } from "../../utils";

interface RPCMethod {
  [key: string]: any;
}

export default class RPC {
  _miner: Miner;
  methods: RPCMethod;

  constructor(miner: Miner) {
    this._miner = miner;
    this.methods = {
      eth_getBlockByNumber: this.eth_getBlockByNumber.bind(this),
    };
  }

  async eth_getBlockByNumber(blockNumber: string) {
    try {
      const block = await this._miner._blockchain.getBlock(
        convertToBigInt(blockNumber)
      );

      return block.toJSON();
    } catch (e) {
      // TODO
    }
    return null;
  }
}
