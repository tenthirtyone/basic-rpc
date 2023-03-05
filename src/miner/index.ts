import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { Block } from "@ethereumjs/block";
import { Transaction } from "@ethereumjs/tx";
import VM from "../vm";
import { oneSecond } from "../utils";

export default class Miner {
  private _INTERVAL = 12 * oneSecond;
  private _MINING_LOOP: any;
  private _mining = false;
  private _VM: any;
  private _config: any;
  private _common: any;
  private _txQueue = [];

  constructor(config?: any) {
    this._config = {
      ...Miner.DEFAULTS,
      ...config,
    };

    const { common } = this._config;

    this._common = new Common(common);
    this._VM = new VM(common);
  }

  mineBlock() {
    return new Block();
  }

  start() {
    this._mining = true;
    this._MINING_LOOP = setInterval(() => {
      if (this._mining) {
        // mine
      }
    }, this._INTERVAL);
  }

  stop() {
    this._mining = false;
    clearInterval(this._MINING_LOOP);
  }

  addTransaction(tx: any) {
    // @ts-ignore
    this._txQueue.push();
  }

  createTransaction(txData: any) {
    return Transaction.fromTxData(txData);
  }

  static get DEFAULTS() {
    return {
      common: {
        chain: Chain.Mainnet,
        hardfork: Hardfork.Merge,
      },
    };
  }
}
