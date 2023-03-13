import assert from "assert";
import { mergeDeep, numberToHexString } from "../";

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
    const obj = mergeDeep(obj1, obj2);

    assert.strictEqual(obj.name, obj2.name);
  });
  describe("numberToHexString", () => {
    it("converts a decimal to a 0x prefixed hex string", () => {
      const value = 16;
      assert.strictEqual(numberToHexString(value), "0x10");
    });
  });
});
