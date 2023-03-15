import assert from "assert";
import { authentication } from "../authentication";
import { RPCRequest, RPCResponse } from "../../../_types";

describe("authentication middleware", () => {
  let req: RPCRequest, res: RPCResponse, next: () => void, responseBody: string;

  beforeEach(() => {
    responseBody = "";
    req = { method: "", url: "" } as RPCRequest;
    res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body: string) => {
        responseBody = body;
      },
    } as unknown as RPCResponse;
  });

  it("should call next() if request method is POST", () => {
    let calledNext = false;
    next = () => {
      calledNext = true;
    };
    req.method = "POST";

    authentication(req, res, next);
    assert.strictEqual(calledNext, true);
  });

  it("should set status code and end the response with error message if request method is not POST", () => {
    req.method = "GET";
    authentication(req, res, next);
    assert.strictEqual(responseBody, "Error - only post requests");
  });
});
