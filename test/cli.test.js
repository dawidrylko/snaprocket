import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../main.js", import.meta.url));

const run = (command) => {
  try {
    const stdout = execFileSync(command, [], { encoding: "utf8", stdio: "pipe" });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? "", stderr: error.stderr ?? "" };
  }
};

test("running the CLI without options reports the ones it needs", () => {
  const result = run(cli);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Base URL/);
});

test("the CLI still runs when it is reached through a symlinked bin", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "snaprocket-bin-"));
  const link = path.join(directory, "snaprocket");
  symlinkSync(cli, link);

  const result = run(link);
  assert.notEqual(result.status, 0, "a global install invokes the bin through a symlink, and it did nothing");
  assert.match(result.stderr, /Base URL/);
});
