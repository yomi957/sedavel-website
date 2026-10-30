import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Use the lockfile-installed CLI; do not download a different release at deploy time.
const require = createRequire(import.meta.url);
const cli = join(dirname(require.resolve("@sanity/cli/package.json")), "bin/run.js");
const args = process.argv.slice(2);
if (!["build", "deploy"].includes(args[0])) throw new Error("Expected build or deploy");
const child = spawn(process.execPath, [cli, ...args], {
  stdio: "inherit",
  env: { ...process.env, SANITY_STUDIO_BASEPATH: "/" },
});
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
child.on("exit", code => { process.exitCode = code ?? 1; });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
