import Miner from "../../miner";
import {
  flattenObject,
  hexStringToBuffer,
  decimalToHexString,
} from "../../utils";
import createLogger from "../../logger";

const logger = createLogger("RPC");

interface RPCMethod {
  [key: string]: any;
}

export default class RPC {
  _miner: Miner;
  methods: RPCMethod;

  constructor(miner: Miner) {
    this._miner = miner;
    this.methods = {
      eth_getBlockByHash: this.eth_getBlockByHash.bind(this),
      eth_getBlockByNumber: this.eth_getBlockByNumber.bind(this),
      eth_getBlockTransactionCountByHash:
        this.eth_getBlockTransactionCountByHash.bind(this),
      eth_getBlockTransactionCountByNumber:
        this.eth_getBlockTransactionCountByNumber.bind(this),
      evm_mineBlock: this.evm_mineBlock.bind(this),
      evm_minerStart: this.evm_minerStart.bind(this),
      evm_minerStop: this.evm_minerStop.bind(this),
    };
  }

  async eth_getBlockByHash(blockHash: string) {
    try {
      const hash = hexStringToBuffer(blockHash);
      const block = await this._miner.getBlock(hash);
      return flattenObject(block.toJSON());
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_getBlockByNumber(blockNumber: string) {
    try {
      const block = await this._miner.getBlock(blockNumber);

      return flattenObject(block.toJSON());
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_getBlockTransactionCountByHash(blockHash: string) {
    try {
      const hash = hexStringToBuffer(blockHash);
      const block = await this._miner.getBlock(hash);

      return decimalToHexString(block.transactions.length);
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_getBlockTransactionCountByNumber(blockNumber: string) {
    try {
      const block = await this._miner.getBlock(blockNumber);

      return decimalToHexString(block.transactions.length);
    } catch (e: any) {
      logger.error(e.message);
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
