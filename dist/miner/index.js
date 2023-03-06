"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@ethereumjs/common");
const block_1 = require("@ethereumjs/block");
const tx_1 = require("@ethereumjs/tx");
const vm_1 = __importDefault(require("../vm"));
const utils_1 = require("../utils");
class Miner {
    constructor(config) {
        this._INTERVAL = 12 * utils_1.oneSecond;
        this._mining = false;
        this._txQueue = [];
        this._config = {
            ...Miner.DEFAULTS,
            ...config,
        };
        const { common } = this._config;
        this._common = new common_1.Common(common);
        this._VM = new vm_1.default(common);
    }
    mineBlock() {
        return new block_1.Block();
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
    addTransaction(tx) {
        // @ts-ignore
        this._txQueue.push();
    }
    createTransaction(txData) {
        return tx_1.Transaction.fromTxData(txData);
    }
    static get DEFAULTS() {
        return {
            common: {
                chain: common_1.Chain.Mainnet,
                hardfork: common_1.Hardfork.Merge,
            },
        };
    }
}
exports.default = Miner;
