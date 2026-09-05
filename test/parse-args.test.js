import test from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../main.js";

test("an unknown option does not swallow the argument after it", () => {
  const config = parseArgs(["-x", "-h", "https://example.com", "-p", "/"]);
  assert.equal(config.baseUrl, "https://example.com");
  assert.deepEqual(config.paths, ["/"]);
});

test("required options are read in the documented order", () => {
  const config = parseArgs(["-h", "https://example.com", "-p", "/", "/blog"]);
  assert.equal(config.baseUrl, "https://example.com");
  assert.deepEqual(config.paths, ["/", "/blog"]);
  assert.equal(config.timeout, 100);
});

test("repeatable options collect every occurrence", () => {
  const config = parseArgs([
    "-h", "https://example.com", "-p", "/",
    "-c", "800x600", "-c", "1200x800",
    "-a", "--no-sandbox", "-a", "--disable-setuid-sandbox",
  ]);
  assert.deepEqual(config.customResolutions, ["800x600", "1200x800"]);
  assert.deepEqual(config.launchArgs, ["--no-sandbox", "--disable-setuid-sandbox"]);
});
