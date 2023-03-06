// @ts-nocheck
import assert from "assert";
import BasicRPC from "../";

describe("Basic RPC", () => {
  let basicrpc: BasicRPC;

  beforeEach(async () => {
    basicrpc = new BasicRPC();
    await basicrpc.start();
  });

  afterEach(async () => {
    await basicrpc.close();
  });

  it("has a genesis block", async () => {
    const genesisBlock = await basicrpc.genesisBlock();

    assert.strictEqual(genesisBlock.header.number, 0n);
  });

  it("exists", async () => {
    await basicrpc.start();
    console.log(await basicrpc.mineBlock());
    console.log(await basicrpc._blockchain.getBlock(1));
  });
});
