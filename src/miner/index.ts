import { VM as EJS_VM } from "@ethereumjs/vm";
import { Blockchain } from "@ethereumjs/blockchain";
import { Common } from "@ethereumjs/common";
import { oneSecond } from "../utils";

const { Level } = require("level");

export default class Miner {
  _common: Common;
  _blockchain: Blockchain;
  _db: typeof Level;
  _mining: boolean = false;
  _evm: EJS_VM;
  _miningInterval = oneSecond;
  _miningLoop: NodeJS.Timer | undefined;

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
    });

    // TODO add transactions from tx pool.

    return await blockBuilder.build();
  }
}
