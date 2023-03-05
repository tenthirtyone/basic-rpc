import { VM as EJS_VM } from "@ethereumjs/vm";
import { Chain, Common, Hardfork } from "@ethereumjs/common";

export default class VM {
  private _vm: EJS_VM | undefined;
  private _common: any;
  constructor(_common?: any) {
    if (_common) {
      this._common = _common;
    } else {
      this._common = new Common(VM.DEFAULTS);
    }
  }

  async start() {
    this._vm = await EJS_VM.create({ common: this._common });
  }

  // These should always be updated to latest
  static get DEFAULTS() {
    return {
      workspace: "default",
      chain: Chain.Mainnet,
      hardfork: Hardfork.Merge,
    };
  }
}
