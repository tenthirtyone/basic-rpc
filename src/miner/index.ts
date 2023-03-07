import { VM as EJS_VM } from "@ethereumjs/vm";
import { Blockchain } from "@ethereumjs/blockchain";
import {
  Chain,
  Hardfork,
  Common,
  CommonOpts,
  ConsensusType,
} from "@ethereumjs/common";
import { Block } from "@ethereumjs/block";
import { Transaction } from "@ethereumjs/tx";
import { oneSecond } from "../utils";

const { Level } = require("level");
const { MemoryLevel } = require("memory-level");
export default class Miner {
  _common: Common;
  _blockchain: Blockchain;
  _db: typeof Level;
  //_pendingBlock: Block;
  _evm: EJS_VM;

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
}
