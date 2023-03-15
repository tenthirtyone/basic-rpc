import assert from "assert";
import {
  mergeDeep,
  generatePrivateKey,
  isValidPrivateKey,
  flattenObject,
  hexStringToBuffer,
  randomEthereumAddress,
  bufferToHexString,
  bigintToHexString,
} from "../";

describe("utils", () => {
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
  describe("generatePrivateKey", () => {
    it("should return a 32-byte buffer", () => {
      const privateKey = generatePrivateKey();
      assert.strictEqual(privateKey.length, 32);
    });

    it("should return a different buffer on each call", () => {
      const privateKey1 = generatePrivateKey();
      const privateKey2 = generatePrivateKey();
      assert.notStrictEqual(privateKey1, privateKey2);
    });

    it("should generate a valid private key", () => {
      const privateKey = generatePrivateKey();
      assert.strictEqual(isValidPrivateKey(privateKey), true);
    });
  });
  describe("flattenObject", () => {
    it("should return an object with no nested objects", () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      const flattenedObj = flattenObject(obj);
      assert.deepStrictEqual(flattenedObj, { a: 1, "b.c": 2, "b.d.e": 3 });
    });

    it("should return an empty object if given an empty object", () => {
      const obj = {};
      const flattenedObj = flattenObject(obj);
      assert.deepStrictEqual(flattenedObj, {});
    });

    it("should return the same object if it has no nested objects", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const flattenedObj = flattenObject(obj);
      assert.deepStrictEqual(flattenedObj, obj);
    });

    it("should return an object with keys that have dot notation for nested keys", () => {
      const obj = { a: { b: { c: { d: 1 } } } };
      const flattenedObj = flattenObject(obj);
      assert.deepStrictEqual(flattenedObj, { "a.b.c.d": 1 });
    });
  });
  describe("bigintToHexString", () => {
    it("should convert a BigInt to a hex string", () => {
      const input = BigInt("10000000000000000000");
      const expectedOutput = "0x8ac7230489e80000";
      const actualOutput = bigintToHexString(input);
      assert.strictEqual(actualOutput, expectedOutput);
    });

    it("should handle 0n correctly", () => {
      const input = 0n;
      const expectedOutput = "0x0";
      const actualOutput = bigintToHexString(input);
      assert.strictEqual(actualOutput, expectedOutput);
    });
  });
  describe("hexStringToBuffer", () => {
    it("should convert a hex string to a buffer", () => {
      const hexString = "0x48656c6c6f20576f726c64";
      const expectedBuffer = Buffer.from("48656c6c6f20576f726c64", "hex");
      const buffer = hexStringToBuffer(hexString);
      assert.deepStrictEqual(buffer, expectedBuffer);
    });

    it("should remove the 0x prefix from the input string", () => {
      const hexString = "0x0123456789abcdef";
      const expectedBuffer = Buffer.from("0123456789abcdef", "hex");
      const buffer = hexStringToBuffer(hexString);
      assert.deepStrictEqual(buffer, expectedBuffer);
    });

    it("should throw an error if the hex string has an odd number of characters", () => {
      const hexString = "0x0123456789abcde";
      assert.throws(
        () => hexStringToBuffer(hexString),
        /Hex string must have an even number of characters/
      );
    });
  });
  describe("randomEthereumAddress", () => {
    it("should return a 20-byte buffer", () => {
      const address = randomEthereumAddress();
      assert.strictEqual(address.length, 20);
    });

    it("should return different addresses each time", () => {
      const address1 = randomEthereumAddress();
      const address2 = randomEthereumAddress();
      assert.notStrictEqual(address1.toString("hex"), address2.toString("hex"));
    });
  });
  describe("bufferToHexString", () => {
    it("should convert a Buffer to a hex string with 0x prefix", () => {
      const buffer = Buffer.from([0x00, 0x01, 0xab, 0xcd]);
      const expected = "0x0001abcd";
      const result = bufferToHexString(buffer);
      assert.strictEqual(result, expected);
    });
  });
});
