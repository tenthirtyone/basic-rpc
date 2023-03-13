import { VM as EJS_VM } from "@ethereumjs/vm";
import { Blockchain } from "@ethereumjs/blockchain";
import { Block } from "@ethereumjs/block";
import {
  AccessListEIP2930Transaction,
  BlobEIP4844Transaction,
  Transaction,
  FeeMarketEIP1559Transaction,
  FeeMarketEIP1559TxData,
  JsonTx,
  JsonRpcTx,
} from "@ethereumjs/tx";
import { Common } from "@ethereumjs/common";
import { oneSecond } from "../utils";
import { Tag } from "../_types";
import { convertToBigInt } from "../utils";
import EthereumHDWallet from "../wallet";
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
  _wallet: EthereumHDWallet;
  _txs: any[] = [];

  get chainId() {
    return this._common.chainId;
  }

  get coinbase() {
    return this._coinbase;
  }

  get accounts() {
    return this._wallet.accounts;
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
    this._wallet = new EthereumHDWallet();
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

  sendTransaction(txData: JsonRpcTx) {
    const { from } = txData;
    const tx = this.createTransaction(txData);
    this._txs.push(tx);
    console.log(tx);
    return tx.hash();
  }

  // Define the createTransaction method
  createTransaction(
    txData: JsonRpcTx | FeeMarketEIP1559TxData | BlobEIP4844Transaction
  ):
    | Transaction
    | AccessListEIP2930Transaction
    | FeeMarketEIP1559Transaction
    | BlobEIP4844Transaction {
    let tx;

    if (txData.type === "0x1" || txData.type === undefined) {
      tx = new Transaction(txData as JsonTx, { common: this._common });
    } else if (txData.type === "0x2") {
      tx = new AccessListEIP2930Transaction(txData as FeeMarketEIP1559TxData, {
        common: this._common,
      });
    } else if (txData.type === "0x3") {
      tx = new FeeMarketEIP1559Transaction(txData as FeeMarketEIP1559TxData, {
        common: this._common,
      });
    } else if (txData.type === "0x4") {
      tx = new BlobEIP4844Transaction(txData as BlobEIP4844Transaction, {
        common: this._common,
      });
    } else {
      throw new Error(`Invalid transaction type: ${txData.type}`);
    }

    return tx;
  }

  queueTransaction(tx: FeeMarketEIP1559Transaction) {
    this._txs.push(tx);
    return tx;
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
