"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = require("@ethereumjs/vm");
const blockchain_1 = require("@ethereumjs/blockchain");
const common_1 = require("@ethereumjs/common");
const api_1 = __importDefault(require("./api"));
const middleware_1 = require("./api/middleware");
const utils_1 = require("./utils");
const { Level } = require("level");
const { MemoryLevel } = require("memory-level");
class BasicRPC {
    constructor(options) {
        this._api = new api_1.default();
        this._options = (0, utils_1.mergeDeep)(BasicRPC.DEFAULTS, options);
        this._common = new common_1.Common({ ...this._options.common });
        this._db = new MemoryLevel({ valueEncoding: "json" });
    }
    async start() {
        const validatePow = this._common.consensusType() === common_1.ConsensusType.ProofOfWork;
        this._blockchain = await blockchain_1.Blockchain.create({
            common: this._common,
            db: this._db,
            validateConsensus: validatePow,
            validateBlocks: true,
        });
        this._evm = await vm_1.VM.create({
            common: this._common,
            blockchain: this._blockchain,
        });
        this._api.use(middleware_1.rpc);
        this._api.start();
    }
    close() {
        this._db.close();
        this._api.stop();
    }
    async getBlock(number) {
        if (!this._blockchain)
            return number;
        return await this._blockchain.getBlock(number);
    }
    async genesisBlock() {
        if (!this._blockchain)
            return;
        return await this._blockchain.getBlock(0);
    }
    async mineBlock() {
        if (!this._evm || !this._blockchain)
            return;
        const pendingBlock = await this._evm.buildBlock({
            parentBlock: await this._blockchain.getBlock(0),
        });
        await pendingBlock.build();
        return pendingBlock;
    }
    static get DEFAULTS() {
        return {
            workspace: "default",
            common: {
                chain: common_1.Chain.Mainnet,
                hardfork: common_1.Hardfork.Merge,
                eips: [1559],
            },
        };
    }
}
exports.default = BasicRPC;
