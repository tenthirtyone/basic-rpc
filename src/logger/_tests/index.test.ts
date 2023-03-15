import assert from "assert";
import createLogger, { minLength16 } from "../";

describe("createLogger", () => {
  it("should create a logger with the given name", () => {
    const logger = createLogger("testName");
    assert.strictEqual(logger.fields.name, minLength16("testName"));
  });

  it("should use the 'info' level for non-test environments", () => {
    process.env.NODE_ENV = "production";
    const logger = createLogger("testName");
    assert.strictEqual(logger.level(), 30);
  });

  it("should use level '100' for test environments", () => {
    process.env.NODE_ENV = "test";
    const logger = createLogger("testName");
    assert.strictEqual(logger.level(), 100);
  });
});
