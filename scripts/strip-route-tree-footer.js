import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeTreePath = path.resolve(__dirname, "../src/routeTree.gen.js");

export function stripRouteTreeCode(code) {
  return (
    code
      .replace(/\/\/ @ts-nocheck\r?\n\r?\n/g, "")
      .replace(/\r?\nimport type [\s\S]*$/g, "")
      .replace(/\r?\ndeclare module [\s\S]*$/g, "")
      .trimEnd() + "\n"
  );
}

export function stripRouteTreeFooter() {
  if (!fs.existsSync(routeTreePath)) return;

  const code = fs.readFileSync(routeTreePath, "utf8");
  const stripped = stripRouteTreeCode(code);

  if (stripped !== code) {
    fs.writeFileSync(routeTreePath, stripped);
  }
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  stripRouteTreeFooter();
}
