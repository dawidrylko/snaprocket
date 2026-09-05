import test from "node:test";
import assert from "node:assert/strict";
import { captureScreenshot } from "../main.js";

const stubBrowser = (calls) => ({
  newPage: async () => ({
    setViewport: async (viewport) => calls.push({ call: "setViewport", viewport }),
    goto: async () => calls.push({ call: "goto" }),
    evaluate: async (fn) => {
      calls.push({ call: "evaluate", source: fn.toString() });
      return 1000;
    },
    screenshot: async (options) => calls.push({ call: "screenshot", fullPage: options.fullPage }),
    close: async () => calls.push({ call: "close" }),
  }),
});

test("a height limited capture returns to the top of the page before it shoots", async () => {
  const calls = [];
  await captureScreenshot(stubBrowser(calls), "https://example.com/", { width: 640 }, "out.png", 800, 0);

  const shotAt = calls.findIndex((entry) => entry.call === "screenshot");
  assert.notEqual(shotAt, -1, "no screenshot was taken");
  assert.equal(calls[shotAt].fullPage, false);

  const scrolledBack = calls
    .slice(0, shotAt)
    .some((entry) => entry.call === "evaluate" && entry.source.includes("scrollTo(0, 0)"));
  assert.ok(scrolledBack, "the page was never scrolled back to the top before the screenshot");
});

test("a whole page capture is taken with fullPage", async () => {
  const calls = [];
  await captureScreenshot(stubBrowser(calls), "https://example.com/", { width: 640 }, "out.png", null, 0);
  assert.equal(calls.find((entry) => entry.call === "screenshot").fullPage, true);
});
