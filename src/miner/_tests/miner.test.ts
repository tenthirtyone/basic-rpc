import Miner from "../index";
import { Account } from "@ethereumjs/util";

describe("miner", () => {
  let miner: any;
  let a = new Account(0n, 10n);
  beforeEach(() => {
    // miner = new Miner();
  });
  afterEach(() => {
    miner = null;
  });
});
