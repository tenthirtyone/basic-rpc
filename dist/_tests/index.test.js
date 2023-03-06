"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const assert_1 = __importDefault(require("assert"));
const __1 = __importDefault(require("../"));
describe("Basic RPC", () => {
    let basicrpc;
    beforeEach(async () => {
        basicrpc = new __1.default();
        await basicrpc.start();
    });
    afterEach(async () => {
        await basicrpc.close();
    });
    it("has a genesis block", async () => {
        const genesisBlock = await basicrpc.genesisBlock();
        assert_1.default.strictEqual(genesisBlock.header.number, 0n);
    });
    it("mines a block", async () => {
        await basicrpc.mineBlock();
        const block = await basicrpc._blockchain.getBlock(1);
        assert_1.default.strictEqual(block.header.number, 1n);
    });
});
