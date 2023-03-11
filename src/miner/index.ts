import { VM as EJS_VM } from "@ethereumjs/vm";
import { Blockchain } from "@ethereumjs/blockchain";
import { Block } from "@ethereumjs/block";
import { Common } from "@ethereumjs/common";
import { oneSecond } from "../utils";
import { Tag } from "../_types";
import { convertToBigInt } from "../utils";
const { Level } = require("level");

export default class Miner {
  _coinbase: Buffer;
  _common: Common;
  _blockchain: Blockchain;
  _db: typeof Level;
  _mining: boolean = false;
  _evm: EJS_VM;
  _miningInterval = oneSecond;
  _miningLoop: NodeJS.Timer | undefined;
  _latestBlockNumber: bigint = 0n;

  get chainId() {
    return this._common.chainId;
  }

  get coinbase() {
    return "0x";
  }

  constructor(
    coinbase: Buffer,
    common: Common,
    blockchain: Blockchain,
    evm: EJS_VM,
    db: typeof Level
  ) {
    this._coinbase = coinbase;
    this._common = common;
    this._blockchain = blockchain;
    this._evm = evm;
    this._db = db;
  }

  minerStart() {
    this._mining = true;
    this._miningLoop = setInterval(() => {
      this.mineBlock();
    }, this._miningInterval);
    return this._mining;
  }

  minerStop() {
    clearInterval(this._miningLoop);
    this._mining = false;
    return this._mining;
  }

  async mineBlock() {
    const blockBuilder = await this._evm.buildBlock({
      parentBlock: await this._blockchain.getCanonicalHeadBlock(),
      headerData: {
        coinbase: this._coinbase,
      },
    });

    // TODO add transactions from tx pool.

    this._latestBlockNumber++;

    return await blockBuilder.build();
  }

  async getPendingBlock() {
    const tempEVM = await this._evm.copy();
    const blockBuilder = await tempEVM.buildBlock({
      parentBlock: await this._blockchain.getCanonicalHeadBlock(),
    });

    // TODO add transactions from tx pool.

    const block = await blockBuilder.build();

    return block;
  }

  async getBlock(
    blockNumber: Buffer | bigint | number | string | Tag
  ): Promise<Block> {
    if (
      typeof blockNumber === "bigint" ||
      typeof blockNumber === "number" ||
      Buffer.isBuffer(blockNumber)
    ) {
      return await this._blockchain.getBlock(blockNumber);
    } else if (blockNumber.substring(0, 2) === "0x") {
      return await this._blockchain.getBlock(convertToBigInt(blockNumber));
    } else if (blockNumber === "pending") {
      return await this.getPendingBlock();
    } else {
      return await this._blockchain.getBlock(this.getBlockNumber(blockNumber));
    }
  }

  getBlockNumber(blockNumber: string | Tag): bigint {
    if (blockNumber.substring(0, 2) === "0x") {
      return convertToBigInt(blockNumber);
    } else {
      switch (blockNumber) {
        case "earliest":
          return 0n;

        case "finalized":
          return this._latestBlockNumber;

        case "safe":
          return BigInt(Math.max(0, Number(this._latestBlockNumber) - 12));

        case "latest":
          return this._latestBlockNumber;

        case "pending":
          return this._latestBlockNumber + 1n;

        default:
          throw new Error(`Invalid block number: ${blockNumber}`);
      }
    }
  }
}
