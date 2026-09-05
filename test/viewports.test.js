import test from "node:test";
import assert from "node:assert/strict";
import { buildFinalViewports, getDefaultViewports, parseCustomViewport } from "../main.js";

const customKeys = (viewports) => Object.keys(viewports).filter((key) => key.startsWith("custom"));

test("custom folders are named the same way whether or not -v is given", () => {
  const resolutions = ["800x600", "1200x800"];
  const selected = buildFinalViewports({ viewports: ["custom"], customResolutions: resolutions }, getDefaultViewports());
  const implied = buildFinalViewports({ viewports: [], customResolutions: resolutions }, getDefaultViewports());
  assert.deepEqual(customKeys(selected), ["custom1", "custom2"]);
  assert.deepEqual(customKeys(selected), customKeys(implied));
});

test("default viewports carry the documented widths", () => {
  assert.deepEqual(getDefaultViewports(), {
    s: { width: 640 },
    m: { width: 768 },
    l: { width: 1024 },
    xl: { width: 1440 },
  });
});

test("a malformed custom resolution is rejected", () => {
  assert.equal(parseCustomViewport("800"), null);
  assert.equal(parseCustomViewport("wide x tall"), null);
  assert.deepEqual(parseCustomViewport("800x600"), { width: 800, height: 600 });
});
