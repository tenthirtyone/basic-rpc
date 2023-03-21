import assert from "assert";
import EthereumClient from "../";

import {
  Chain,
  Common,
  ConsensusAlgorithm,
  ConsensusType,
  Hardfork,
} from "@ethereumjs/common";

describe("Basic RPC", () => {
  let ethereumClient: EthereumClient;
  const defaultChainName = "mainnet";

  describe("common", () => {
    beforeEach(async () => {
      ethereumClient = new EthereumClient();
    });

    afterEach(async () => {
      await ethereumClient.close();
    });
    it("should initialize to Ethereum mainnet", () => {
      const chainName = ethereumClient._common.chainName();
      //const chainId = ethereumClient._common.chainId();

      assert.strictEqual(chainName, defaultChainName);
      //assert.strictEqual(chainId, Chain.Mainnet); // bigint v decimal
    });
    it("should initialize to latest hardfork", () => {
      const hardfork = ethereumClient._common.hardfork();

      assert.strictEqual(hardfork, Hardfork.Merge);
    });
    it("should initialize consensysType to pos", () => {
      const pos = ethereumClient._common.consensusType();

      assert.strictEqual(pos, ConsensusType.ProofOfStake);
    });
    it("should accept custom common", () => {
      const common = {
        chain: Chain.Rinkeby,
        hardfork: Hardfork.London,
      };
      ethereumClient = new EthereumClient({ common });
      assert.strictEqual(ethereumClient._common.consensusType(), "poa");
      assert.strictEqual(ethereumClient._common.chainName(), "rinkeby");
      assert.strictEqual(ethereumClient._common.hardfork(), "london");
    });
  });
  describe("start", () => {
    beforeEach(async () => {
      ethereumClient = new EthereumClient();
      await ethereumClient.start();
    });

    afterEach(async () => {
      await ethereumClient.close();
    });
    it("creates a blockchain", () => {
      assert.strictEqual(
        ethereumClient._blockchain?._common,
        ethereumClient._common
      );
    });
    it("creates an evm", () => {
      assert.strictEqual(ethereumClient._evm?._common, ethereumClient._common);
    });
    it("creates a miner", () => {
      assert.strictEqual(
        ethereumClient._miner?._common,
        ethereumClient._common
      );
    });
    it("creates an api", () => {
      assert.strictEqual(ethereumClient._api?._miner, ethereumClient._miner);
    });
    it("starts the api", async () => {
      assert.strictEqual(ethereumClient._api?._started, true);
    });
  });
});
