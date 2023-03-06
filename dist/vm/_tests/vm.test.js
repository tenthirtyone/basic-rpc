"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe("vm engine", () => {
    let vm;
    beforeEach(async () => {
        vm = new index_1.default();
    });
    afterEach(() => {
        vm = null;
    });
    it("turns on", () => {
        vm.start();
    });
});
