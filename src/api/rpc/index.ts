import Miner from "../../miner";
import { flattenObject } from "../../utils";

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
      evm_mineBlock: this.evm_mineBlock.bind(this),
      evm_minerStart: this.evm_minerStart.bind(this),
      evm_minerStop: this.evm_minerStop.bind(this),
    };
  }

  async eth_getBlockByNumber(blockNumber: string) {
    try {
      const block = await this._miner.getBlock(blockNumber);

      return flattenObject(block.toJSON());
    } catch (e) {
      // TODO
    }
    return null;
  }

  async evm_mineBlock() {
    const block = await this._miner.mineBlock();
    return flattenObject(block.toJSON());
  }

  evm_minerStart() {
    return this._miner.minerStart();
  }

  evm_minerStop() {
    return this._miner.minerStop();
  }
}
