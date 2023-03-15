import assert from "assert";
import Level from "level";

import { Blockchain } from "@ethereumjs/blockchain";
import { VM as EVM } from "@ethereumjs/vm";
import Miner from "../";

describe("Miner", function () {
  let miner: Miner;
  let blockchain: Blockchain;
  let db: typeof Level;
  let evm: EVM;

  beforeEach(async function () {
    // setup code here
  });

  afterEach(async function () {
    // teardown code here
  });

  it("should mine a block");

  it("should update pending transactions on block processing");

  it("should execute a pending transaction on block processing");

  it("should mine a block with multiple transactions");

  it("should return the correct block reward");

  it("should return the correct gas reward");

  it("should return the correct uncle reward");

  it("should validate a block before mining");

  it("should reject invalid transactions");

  it("should update the nonce on successful transaction");

  it("should update the balance on successful transaction");

  it("should update the gas used on successful transaction");

  it("should clear pending transactions after mining a block");
});
