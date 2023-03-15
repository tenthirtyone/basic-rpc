import * as assert from "assert";
import { RPCRequest, RPCResponse } from "../../../_types";
import { bodyParser } from "../bodyParser";

describe("bodyParser middleware", () => {
  let req: RPCRequest;
  let res: RPCResponse;
  let next: () => void;

  beforeEach(() => {
    req = {
      method: "",
      url: "",
      headers: {},
      on: (_: string, cb: (chunk: any) => void) => {
        cb(Buffer.from(""));
      },
    };
    res = {
      statusCode: 0,
      headers: {},
      end: () => {},
      setHeader: () => {},
    };
    next = () => {};
  });

  it("should parse the body of a POST request and set it to req.body", (done) => {
    req.method = "POST";
    req.on = (_: string, cb: (chunk: any) => void) => {
      cb(Buffer.from('{ "name": "Alice" }'));
    };
    next = () => {
      assert.strictEqual(req.body.name, "Alice");
      done();
    };
    bodyParser(req, res, next);
  });

  it("should set status code and end the response with error message if the body is not a valid JSON", (done) => {
    req.method = "POST";
    req.on = (_: string, cb: (chunk: any) => void) => {
      cb(Buffer.from("not a JSON"));
    };
    res.end = (data: any) => {
      assert.strictEqual(res.statusCode, 500);
      assert.strictEqual(res.headers["Content-Type"], "text/plain");
      assert.strictEqual(data, "Error parsing post body");
      done();
    };
    bodyParser(req, res, next);
  });

  it("should call next() for non-POST requests", (done) => {
    req.method = "GET";
    next = () => {
      done();
    };
    bodyParser(req, res, next);
  });
});
