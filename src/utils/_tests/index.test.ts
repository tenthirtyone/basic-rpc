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

  describe("mergeDeep", () => {
    it("merges two objects with non-overlapping properties", () => {
      const target = { foo: "foo" };
      const source = { bar: "bar" };
      const result = mergeDeep(target, source);
      assert.deepStrictEqual(result, { foo: "foo", bar: "bar" });
    });

    it("merges two objects with overlapping properties", () => {
      const target = { foo: "foo", bar: { baz: "baz" } };
      const source = { bar: { qux: "qux" } };
      const result = mergeDeep(target, source);
      assert.deepStrictEqual(result, {
        foo: "foo",
        bar: { baz: "baz", qux: "qux" },
      });
    });

    it("merges two objects with arrays", () => {
      const target = { foo: "foo", bar: ["baz"] };
      const source = { bar: ["qux"] };
      const result = mergeDeep(target, source);
      assert.deepStrictEqual(result, { foo: "foo", bar: ["qux"] });
    });

    it("returns target when source is undefined or null", () => {
      const target = { foo: "foo" };
      const result1 = mergeDeep(target, undefined);
      assert.deepStrictEqual(result1, { foo: "foo" });
      const result2 = mergeDeep(target, null);
      assert.deepStrictEqual(result2, { foo: "foo" });
    });
  });
});
