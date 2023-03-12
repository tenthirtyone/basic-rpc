import assert from "assert";
import DevHDWallet from "../";

describe("DevHDWallet", () => {
  const wallet = new DevHDWallet();
  it("seedphrase", () => {
    console.log(wallet.seedPhrase);
  });
  it("createNAccounts");
});
