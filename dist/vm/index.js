"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = require("@ethereumjs/vm");
const common_1 = require("@ethereumjs/common");
class VM {
    constructor(_common) {
        if (_common) {
            this._common = _common;
        }
        else {
            this._common = new common_1.Common(VM.DEFAULTS);
        }
    }
    async start() {
        this._vm = await vm_1.VM.create({ common: this._common });
    }
    // These should always be updated to latest
    static get DEFAULTS() {
        return {
            workspace: "default",
            chain: common_1.Chain.Mainnet,
            hardfork: common_1.Hardfork.Merge,
        };
    }
}
exports.default = VM;
