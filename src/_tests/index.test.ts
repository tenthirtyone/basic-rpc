import assert from "assert";
import BasicRPC from "../";

import {
  Chain,
  Common,
  ConsensusAlgorithm,
  ConsensusType,
  Hardfork,
} from "@ethereumjs/common";

describe("Basic RPC", () => {
  let basicrpc: BasicRPC;
  const defaultChainName = "mainnet";

  describe("common", () => {
    beforeEach(async () => {
      basicrpc = new BasicRPC();
    });

    afterEach(async () => {
      await basicrpc.close();
    });
    it("should initialize to Ethereum mainnet", () => {
      const chainName = basicrpc._common.chainName();
      //const chainId = basicrpc._common.chainId();

      assert.strictEqual(chainName, defaultChainName);
      //assert.strictEqual(chainId, Chain.Mainnet); // bigint v decimal
    });
    it("should initialize to latest hardfork", () => {
      const hardfork = basicrpc._common.hardfork();

      assert.strictEqual(hardfork, Hardfork.Merge);
    });
    it("should initialize consensysType to pos", () => {
      const pos = basicrpc._common.consensusType();

      assert.strictEqual(pos, ConsensusType.ProofOfStake);
    });
    it("should accept custom common", () => {
      const common = {
        chain: Chain.Rinkeby,
        hardfork: Hardfork.London,
      };
      basicrpc = new BasicRPC({ common });
      assert.strictEqual(basicrpc._common.consensusType(), "poa");
      assert.strictEqual(basicrpc._common.chainName(), "rinkeby");
      assert.strictEqual(basicrpc._common.hardfork(), "london");
    });
  });
  describe("start", () => {
    beforeEach(async () => {
      basicrpc = new BasicRPC();
      await basicrpc.start();
    });

    afterEach(async () => {
      await basicrpc.close();
    });
    it("creates a blockchain", () => {
      assert.strictEqual(basicrpc._blockchain?._common, basicrpc._common);
    });
    it("creates an evm", () => {
      assert.strictEqual(basicrpc._evm?._common, basicrpc._common);
    });
    it("creates a miner", () => {
      assert.strictEqual(basicrpc._miner?._common, basicrpc._common);
    });
    it("creates an api", () => {
      assert.strictEqual(basicrpc._api?._miner, basicrpc._miner);
    });
    it("starts the api", async () => {
      assert.strictEqual(basicrpc._api?._started, true);
    });
  });
});
