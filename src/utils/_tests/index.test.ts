import assert from "assert";
import { mergeDeep } from "../";

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
});
