import { VM as EJS_VM } from "@ethereumjs/vm";
import { Blockchain } from "@ethereumjs/blockchain";
import { Block } from "@ethereumjs/block";
import {
  AccessListEIP2930Transaction,
  AccessListEIP2930TxData,
  BlobEIP4844Transaction,
  BlobEIP4844TxData,
  FeeMarketEIP1559Transaction,
  FeeMarketEIP1559TxData,
  JsonTx,
  JsonRpcTx,
  Transaction,
} from "@ethereumjs/tx";
import {
  Account,
  Address,
  privateToPublic,
  publicToAddress,
} from "@ethereumjs/util";
import { Common } from "@ethereumjs/common";
import { oneSecond, generatePrivateKey } from "../utils";
import { Tag } from "../_types";

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
  _txs: any[] = [];
  _keys: any[] = [];

  get chainId() {
    return this._common.chainId;
  }

  get coinbase() {
    return this._coinbase;
  }

  get accounts() {
    return [];
  }

  constructor(
    common: Common,
    blockchain: Blockchain,
    evm: EJS_VM,
    db: typeof Level
  ) {
    this._common = common;
    this._blockchain = blockchain;
    this._evm = evm;
    this._db = db;

    this.createAccounts(10n, BigInt(1000 * 1e18));
    this._keys.forEach((keys) => {
      //console.log(keys.address.toString("hex"));
    });
    this._coinbase = this._keys[0].address.toBuffer();
  }

  createAccounts(n: bigint, amount: bigint) {
    while (n--) {
      this.createAccount(amount);
    }
  }

  createAccount(amount: bigint) {
    const newAccount = new Account(0n, 0n);
    const newKey = this._createKey();

    newAccount.balance = amount;

    this._keys.push(newKey);
    this._evm.stateManager.putAccount(newKey.address, newAccount);

    return newAccount;
  }

  private _createKey() {
    const privateKey = generatePrivateKey();
    const publicKey = privateToPublic(privateKey);
    return {
      privateKey,
      publicKey,
      address: new Address(publicToAddress(publicKey)),
    };
  }

  async fundAccount(address: string, amount: bigint) {
    const addr = Address.fromString(address);
    let account = await this._evm.stateManager.getAccount(addr);

    if (account) {
      account.balance += amount;
    } else {
      account = new Account(0n, amount);
    }

    await this._evm.stateManager.putAccount(addr, account);

    return account.balance;
  }

  async getBalance(address: string) {
    const account = await this._evm.stateManager.getAccount(
      Address.fromString(address)
    );
    return account ? account.balance : 0n;
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
        gasLimit: 30e10,
      },
    });

    await Promise.all(
      this._txs.map(async (tx) => {
        return await blockBuilder.addTransaction(tx);
      })
    );

    this._latestBlockNumber++;

    return await blockBuilder.build();
  }

  // send a transaction from the coinbase account
  async sendTransaction(txData: FeeMarketEIP1559TxData) {
    const from = new Address(this._coinbase).toString();

    const accountIndex = this._keys.findIndex((keys) => {
      return keys.address.toString().toUpperCase() === from.toUpperCase();
    });

    if (accountIndex < 0) throw new Error(`privateKey for ${from} not found`);

    const keys = this._keys[accountIndex];
    const account = await this._evm.stateManager.getAccount(keys.address);

    // todo, default values for maxFeePerGas, gasLimit, maxPriorityFeePerGas
    if (!txData.nonce) txData.nonce = account.nonce;

    const tx = this.createTransaction(txData);

    const signedTx = tx.sign(this._keys[accountIndex].privateKey);

    this._txs.push(signedTx);
    return signedTx.hash();
  }

  createTransaction(
    txData:
      | JsonRpcTx
      | AccessListEIP2930TxData
      | FeeMarketEIP1559TxData
      | BlobEIP4844Transaction
  ):
    | Transaction
    | AccessListEIP2930Transaction
    | FeeMarketEIP1559Transaction
    | BlobEIP4844Transaction {
    let tx;

    if (txData.type === "0x0") {
      tx = Transaction.fromTxData(txData as JsonTx, { common: this._common });
    } else if (txData.type === "0x1") {
      tx = AccessListEIP2930Transaction.fromTxData(
        txData as AccessListEIP2930TxData,
        {
          common: this._common,
        }
      );
    } else if (txData.type === "0x2" || txData.type === undefined) {
      tx = FeeMarketEIP1559Transaction.fromTxData(
        txData as FeeMarketEIP1559TxData,
        {
          common: this._common,
        }
      );
    } else if (txData.type === "0x5") {
      tx = BlobEIP4844Transaction.fromTxData(txData as BlobEIP4844TxData, {
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
      headerData: {
        coinbase: this._coinbase,
        gasLimit: 30e10,
      },
    });

    await Promise.all(
      this._txs.map(async (tx) => {
        return await blockBuilder.addTransaction(tx);
      })
    );

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
      return await this._blockchain.getBlock(BigInt(blockNumber));
    } else if (blockNumber === "pending") {
      return await this.getPendingBlock();
    } else {
      return await this._blockchain.getBlock(this.getBlockNumber(blockNumber));
    }
  }

  getBlockNumber(blockNumber: string | Tag): bigint {
    if (blockNumber.substring(0, 2) === "0x") {
      return BigInt(blockNumber);
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
