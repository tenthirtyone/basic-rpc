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
import Miner from "./miner";

import { mergeDeep, randomEthereumAddress } from "./utils";

const { Level } = require("level");
const { MemoryLevel } = require("memory-level");

type DbOpts = { valueEncoding: "json" };

type EthereumClientOptionals = {
  workspace?: string;
  common?: CommonOpts;
  db?: DbOpts;
};

type EthereumClientOptions = {
  workspace: string;
  common: CommonOpts;
  db?: DbOpts;
};

export default class EthereumClient {
  _options: EthereumClientOptions;
  _api: API | undefined;
  _miner: Miner | undefined;
  _db: typeof Level;
  _common: Common;
  _blockchain: Blockchain | undefined;
  _evm: EJS_VM | undefined;

  constructor(options?: EthereumClientOptionals) {
    this._options = mergeDeep(EthereumClient.DEFAULTS, options);
    this._common = new Common({ ...this._options.common });
    this._db = new MemoryLevel({ ...this._options.db });
  }

  async start() {
    this._blockchain = await Blockchain.create({
      common: this._common,
      db: this._db,
      validateConsensus:
        this._common.consensusType() === ConsensusType.ProofOfWork,
      validateBlocks: false,
    });

    this._evm = await EJS_VM.create({
      common: this._common,
      blockchain: this._blockchain,
    });

    this._miner = new Miner(
      this._common,
      this._blockchain,
      this._evm,
      this._db
    );

    this._api = new API(this._miner);

    await this._api.start();
  }

  close() {
    this._db.close();
    if (this._api) {
      this._api.stop();
    }
  }

  static get DEFAULTS(): EthereumClientOptions {
    return {
      workspace: "default",
      common: {
        chain: Chain.Mainnet,
        hardfork: Hardfork.Merge,
        eips: [1559],
      },
      db: { valueEncoding: "json" },
    };
  }
}

if (require.main === module) {
  const rpc = new EthereumClient();
  rpc.start();
} else {
  module.exports = EthereumClient;
}
