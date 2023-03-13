import Miner from "../../miner";
import { JsonRpcTx } from "@ethereumjs/tx";
import {
  flattenObject,
  hexStringToBuffer,
  numberToHexString,
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
      eth_getUncleCountByBlockHash:
        this.eth_getUncleCountByBlockHash.bind(this),
      eth_getUncleCountByBlockNumber:
        this.eth_getUncleCountByBlockNumber.bind(this),
      eth_chainId: this.eth_chainId.bind(this),
      eth_syncing: this.eth_syncing.bind(this),
      eth_accounts: this.eth_accounts.bind(this),
      eth_blockNumber: this.eth_blockNumber.bind(this),

      eth_sendTransaction: this.eth_sendTransaction.bind(this),
      // evm
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

      return numberToHexString(block.transactions.length);
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_getBlockTransactionCountByNumber(blockNumber: string) {
    try {
      const block = await this._miner.getBlock(blockNumber);

      return numberToHexString(block.transactions.length);
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_getUncleCountByBlockHash(blockHash: string) {
    try {
      const hash = hexStringToBuffer(blockHash);
      const block = await this._miner.getBlock(hash);

      return numberToHexString(block.uncleHeaders.length);
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_getUncleCountByBlockNumber(blockNumber: string) {
    try {
      const block = await this._miner.getBlock(blockNumber);

      return numberToHexString(block.uncleHeaders.length);
    } catch (e: any) {
      logger.error(e.message);
    }
    return null;
  }

  async eth_chainId() {
    return this._miner.chainId;
  }

  eth_syncing() {
    return false;
  }

  eth_coinbase() {
    return this._miner.coinbase;
  }

  eth_accounts() {
    return this._miner.accounts;
  }

  eth_blockNumber() {
    return numberToHexString(this._miner._latestBlockNumber);
  }

  eth_call() {}

  eth_estimateGas() {}

  eth_createAccessList() {}

  eth_gasPrice() {}

  eth_maxPriorityFeePerGas() {}

  eth_feeHistory() {}

  eth_sendTransaction(txData: JsonRpcTx) {
    return this._miner.sendTransaction(txData);
  }

  // evm
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
