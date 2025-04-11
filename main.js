#!/usr/bin/env node
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseArgs = () => {
  const args = process.argv.slice(2);
  const config = {
    baseUrl: null,
    paths: [],
    timeout: 100,
    output: process.cwd(),
    heightLimit: null,
    customResolutions: [],
    viewports: [],
  };
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "-h") {
      config.baseUrl = args[++i];
    } else if (arg === "-p") {
      i++;
      while (i < args.length && !args[i].startsWith("-")) {
        config.paths.push(args[i]);
        i++;
      }
      continue;
    } else if (arg === "-t") {
      config.timeout = parseInt(args[++i], 10) || 100;
    } else if (arg === "-o") {
      config.output = args[++i];
    } else if (arg === "-H") {
      config.heightLimit = parseInt(args[++i], 10);
    } else if (arg === "-c" || arg === "--custom") {
      config.customResolutions.push(args[++i]);
    } else if (arg === "-v") {
      i++;
      while (i < args.length && !args[i].startsWith("-")) {
        config.viewports.push(args[i].toLowerCase());
        i++;
      }
      continue;
    } else {
      i++;
    }
    i++;
  }
  if (!config.baseUrl || config.paths.length === 0) {
    console.error("\x1b[31m%s\x1b[0m", "Error: Base URL (-h) and paths (-p) are required.");
    process.exit(1);
  }
  return config;
};

const logInfo = (msg) => console.log("\x1b[32m%s\x1b[0m", msg);
const logError = (msg) => console.error("\x1b[31m%s\x1b[0m", msg);

const getDefaultViewports = () => ({
  s: { width: 640 },
  m: { width: 768 },
  l: { width: 1024 },
  xl: { width: 1440 },
});

const parseCustomViewport = (str) => {
  const parts = str.toLowerCase().split("x");
  if (parts.length !== 2) return null;
  const width = parseInt(parts[0], 10);
  const height = parseInt(parts[1], 10);
  if (isNaN(width) || isNaN(height)) return null;
  return { width, height };
};

const autoScroll = async (page, sleepDelay) => {
  let previousHeight = 0;
  while (true) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);

    for (let pos = previousHeight; pos < currentHeight; pos += 300) {
      await page.evaluate((scrollPos) => {
        window.scrollTo(0, scrollPos);
      }, pos);
      await sleep(sleepDelay);
    }

    const newHeight = await page.evaluate(() => document.body.scrollHeight);

    if (newHeight === currentHeight) {
      break;
    }

    previousHeight = currentHeight;
  }
};

const captureScreenshot = async (browser, fullUrl, viewport, outputFile, heightLimit, timeout) => {
  const page = await browser.newPage();
  if (heightLimit) {
    await page.setViewport({ width: viewport.width, height: heightLimit });
  } else if (viewport.height) {
    await page.setViewport(viewport);
  } else {
    await page.setViewport({ width: viewport.width, height: 800 });
  }
  try {
    await page.goto(fullUrl, { waitUntil: "networkidle0" });
    await autoScroll(page, timeout);
    await sleep(timeout);

    const options = { path: outputFile };
    options.fullPage = !heightLimit && !viewport.height;
    await page.screenshot(options);
    logInfo("Screenshot saved: " + outputFile);
  } catch (err) {
    logError("Failed to capture " + fullUrl + " - " + err.message);
  }
  await page.close();
};

const createOutputDirectory = (baseUrl, output) => {
  const outputBase = path.resolve(output, new URL(baseUrl).hostname);
  if (!fs.existsSync(outputBase)) {
    fs.mkdirSync(outputBase, { recursive: true });
  }
  return outputBase;
};

const getDigitsNeeded = (totalPaths) => Math.max(1, String(totalPaths).length);

const processPaths = async (browser, config, finalViewports, outputBase) => {
  const totalPaths = config.paths.length;
  const digitsNeeded = getDigitsNeeded(totalPaths);
  let pathIndex = 1;
  for (const p of config.paths) {
    const cleanPath = p.replace(/[^a-z0-9]/gi, "_").replace(/^_+|_+$/g, "") || "home";
    const index = pathIndex.toString().padStart(digitsNeeded, "0");
    for (const key in finalViewports) {
      const vp = finalViewports[key];
      const folder = path.join(outputBase, key);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      const outputFile = path.join(folder, index + "." + cleanPath + ".png");
      const fullUrl = config.baseUrl.endsWith("/")
        ? config.baseUrl.slice(0, -1) + p
        : config.baseUrl + p;
      await captureScreenshot(browser, fullUrl, vp, outputFile, config.heightLimit, config.timeout);
    }
    pathIndex++;
  }
};

const buildFinalViewports = (config, defaults) => {
  let finalViewports = {};
  if (config.viewports.length > 0) {
    for (const key of config.viewports) {
      if (defaults[key]) {
        finalViewports[key] = defaults[key];
      }
      if (key === "custom" && config.customResolutions.length > 0) {
        config.customResolutions.forEach((str, idx) => {
          const vp = parseCustomViewport(str);
          if (vp) {
            finalViewports[`custom_${idx + 1}`] = vp;
          }
        });
      }
    }
  } else {
    finalViewports = { ...defaults };
    if (config.customResolutions.length > 0) {
      config.customResolutions.forEach((str, idx) => {
        const vp = parseCustomViewport(str);
        if (vp) {
          finalViewports[`custom${idx + 1}`] = vp;
        }
      });
    }
  }
  return finalViewports;
};

const main = async () => {
  const config = parseArgs();
  const browser = await puppeteer.launch();
  const defaults = getDefaultViewports();
  const finalViewports = buildFinalViewports(config, defaults);
  const outputBase = createOutputDirectory(config.baseUrl, config.output);
  await processPaths(browser, config, finalViewports, outputBase);
  await browser.close();
};

main().catch((err) => {
  logError(err.toString());
  process.exit(1);
});
