import * as ts from "typescript";

function extractFunctionSignatures(fileContent: string): string[] {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    fileContent,
    ts.ScriptTarget.ES2015,
    true
  );
  const functionSignatures: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
      const functionName = node.name
        ? node.name.getText(sourceFile)
        : "<anonymous>";
      const parameters = node.parameters
        .map((param) => param.getText(sourceFile))
        .join(", ");
      const signature = `${functionName}(${parameters})`;

      functionSignatures.push(signature);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return functionSignatures;
}

export default extractFunctionSignatures;
