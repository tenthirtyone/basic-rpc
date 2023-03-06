import { VM as EJS_VM } from "@ethereumjs/vm";
import { Blockchain } from "@ethereumjs/blockchain";
import {
  Chain,
  Hardfork,
  Common,
  CommonOpts,
  ConsensusType,
} from "@ethereumjs/common";
import API from "./api";
import { rpc } from "./api/middleware";
import { mergeDeep } from "./utils";

const { Level } = require("level");
const { MemoryLevel } = require("memory-level");

type BasicRPCOptions = {
  workspace?: string;
  common: CommonOpts;
};

export default class BasicRPC {
  _options: BasicRPCOptions;
  _api: API = new API();
  _db: typeof Level;
  _common: Common;
  _blockchain: Blockchain | undefined;
  _evm: EJS_VM | undefined;

  constructor(options?: BasicRPCOptions) {
    this._options = mergeDeep(BasicRPC.DEFAULTS, options);
    this._common = new Common({ ...this._options.common });
    this._db = new MemoryLevel({ valueEncoding: "json" });
  }

  async start() {
    const validatePow =
      this._common.consensusType() === ConsensusType.ProofOfWork;

    this._blockchain = await Blockchain.create({
      common: this._common,
      db: this._db,
      validateConsensus: validatePow,
      validateBlocks: true,
    });

    this._evm = await EJS_VM.create({
      common: this._common,
      blockchain: this._blockchain,
    });
    this._api.use(rpc);
    this._api.start();
  }

  close() {
    this._db.close();
    this._api.stop();
  }

  async getBlock(number: number) {
    if (!this._blockchain) return number;

    return await this._blockchain.getBlock(number);
  }

  async genesisBlock() {
    if (!this._blockchain) return;
    return await this._blockchain.getBlock(0);
  }

  async mineBlock() {
    if (!this._evm || !this._blockchain) return;

    const pendingBlock = await this._evm.buildBlock({
      parentBlock: await this._blockchain.getBlock(0),
    });

    await pendingBlock.build();

    return pendingBlock;
  }

  static get DEFAULTS(): BasicRPCOptions {
    return {
      workspace: "default",
      common: {
        chain: Chain.Mainnet,
        hardfork: Hardfork.Merge,
        eips: [1559],
      },
    };
  }
}
