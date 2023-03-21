import * as fs from "fs";
import extractFunctionSignatures from "./extractSignatures";

function logFunctionSignatures(tsFilePath: string): void {
  fs.readFile(tsFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const functionSignatures = extractFunctionSignatures(data);

    console.log(`Function signatures in ${tsFilePath}:`);
    functionSignatures.forEach((signature) => console.log(signature));
  });
}

// Replace 'example.ts' with the path to the TypeScript file you want to extract the function signatures from.
logFunctionSignatures(
  "/home/hayek/proj/basic-rpc/node_modules/@ethereumjs/common/src/common.ts"
);
