import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const workerPath = resolve(projectRoot, "dist/server/index.js");
const manifestPath = resolve(projectRoot, "dist/.openai/hosting.json");

const [source, manifest] = await Promise.all([
  readFile(workerPath, "utf8"),
  readFile(manifestPath, "utf8"),
]);
JSON.parse(manifest);

// A data URL forces ESM parsing even though the generated output has no package.json.
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const workerModule = await import(moduleUrl);
assert.equal(
  typeof workerModule.default?.fetch,
  "function",
  `${pathToFileURL(workerPath)} must export default.fetch`,
);

// Las dos páginas deben incluir recursos bilingües y colores reales en el Site construido.
for (const asset of ["index.html", "entrenamiento.html", "vibrant-agents.css", "i18n.js", "mascot-expressions.css", "mascot-expressions.js"]) {
  assert(source.includes(JSON.stringify(asset) + ":"), "Missing production asset: " + asset);
}
assert(source.includes("/i18n.js"), "Missing ES/EN script in HTML");
assert(source.includes("/vibrant-agents.css"), "Missing vibrant mascot stylesheet in HTML");
assert(source.includes("factory.locale"), "Missing persisted language selection");
assert(source.includes("/mascot-expressions.js"), "Missing mascot controls in pages");
assert(source.includes("pet-dancing"), "Missing mascot movement styles");
assert(source.includes("pet-card:nth-child(6)"), "Missing complete six-character palette");
console.log("Artifact is valid ESM, exports default.fetch, and bundles bilingual UI and six vivid mascots");
