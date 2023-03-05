import assert from "assert";
import BasicRPC from "../";

describe("Basic RPC", () => {
  let basicrpc: BasicRPC;

  beforeEach(() => {
    basicrpc = new BasicRPC();
  });

  it("exists", async () => {
    await basicrpc.start();
    console.log(await basicrpc.getBlock(0));
  });
});
