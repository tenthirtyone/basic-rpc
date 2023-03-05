import { Blockchain } from "@ethereumjs/blockchain";
import { Chain, Common, CommonOpts } from "@ethereumjs/common";
import { mergeDeep } from "./utils";

const { Level } = require("level");
const gethDbPath = "./chaindata";
const db = new Level(gethDbPath);

type BasicRPCOptions = {
  workspace?: string;
  common: CommonOpts;
};

export default class BasicRPC {
  _options: BasicRPCOptions;
  _common: Common;
  _blockchain: Blockchain | undefined;

  constructor(options?: BasicRPCOptions) {
    this._options = mergeDeep(BasicRPC.DEFAULTS, options);
    this._common = new Common({ ...this._options.common });
    this.start();
  }

  async start() {
    this._blockchain = await Blockchain.create({ common: this._common, db });
  }

  async getBlock(number: number) {
    if (!this._blockchain) return number;

    return await this._blockchain.getBlock(number);
  }

  static get DEFAULTS(): BasicRPCOptions {
    return {
      workspace: "default",
      common: {
        chain: Chain.Mainnet,
      },
    };
  }
}