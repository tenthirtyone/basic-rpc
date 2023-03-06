"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe("miner", () => {
    let miner;
    beforeEach(() => {
        miner = new index_1.default();
    });
    afterEach(() => {
        miner = null;
    });
    it("exists", () => {
        //console.log(miner);
    });
    it("mines a block", () => {
        miner.mineBlock();
    });
});
