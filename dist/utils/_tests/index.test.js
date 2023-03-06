"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const __1 = require("../");
describe("utils", () => {
    const obj1 = {
        name: "obj1",
        attr1: "attr1",
        subObj: {
            name: "subObj1",
        },
    };
    const obj2 = {
        name: "obj2",
        attr2: "attr2",
        subObj: {
            name: "subObj2",
        },
    };
    it("mergeDeep", () => {
        const obj = (0, __1.mergeDeep)(obj1, obj2);
        assert_1.default.strictEqual(obj.name, obj2.name);
    });
});
