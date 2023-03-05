import assert from "assert";
import VM from "../index";

describe("vm engine", () => {
  let vm: any;

  beforeEach(async () => {
    vm = new VM();
  });
  afterEach(() => {
    vm = null;
  });

  it("turns on", () => {
    vm.start();
  });
});
