import { parseRequestBody } from "../bodyParser";
import assert from "assert";

describe("parseRequestBody", () => {
  it("should parse a valid JSON body", () => {
    const data = [Buffer.from(JSON.stringify({ foo: "bar" }))];

    const result = parseRequestBody(data);

    assert.deepStrictEqual(result, { foo: "bar" });
  });

  it("should throw an error if the body is not valid JSON", () => {
    const data = [Buffer.from("this is not JSON")];

    assert.throws(() => {
      parseRequestBody(data);
    });
  });
});
