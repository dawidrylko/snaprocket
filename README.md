# 🚀 Snaprocket

**Snaprocket** is a fast CLI tool for capturing screenshots of web pages using Puppeteer with multiple viewports and custom configurations. It is designed to be simple, flexible, and highly configurable, making it perfect for developers and testers who need quick visual feedback of websites.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/snaprocket.svg)](https://www.npmjs.com/package/snaprocket)

## ✨ Features

- **Fast Screenshot Capture:** Leverages Puppeteer to quickly capture screenshots of web pages.
- **Multiple Viewports:** Supports default viewports ("s", "m", "l", "xl") and user-defined custom resolutions.
- **Custom Configurations:** Easily configure timeouts, height limits, and output directories.
- **Flexible Usage:** Capture full-page or constrained screenshots based on your needs.

## 📥 Installation

Requires **Node.js 22.12.0 or newer**, the floor set by Puppeteer 25.

You can install **Snaprocket** using your favorite package manager: npm, Yarn, or pnpm.

### Global Installation

- **Using npm:**

  ```bash
  npm install -g snaprocket
  ```

- **Using Yarn:**

  ```bash
  yarn global add snaprocket
  ```

- **Using pnpm:**

  ```bash
  pnpm install -g snaprocket
  ```

### Local Installation (Development Dependency)

- **Using npm:**

  ```bash
  npm install --save-dev snaprocket
  ```

- **Using Yarn:**

  ```bash
  yarn add --dev snaprocket
  ```

- **Using pnpm:**

  ```bash
  pnpm add -D snaprocket
  ```

## 💻 Usage

Run **snaprocket** from the command line with the following syntax:

```bash
snaprocket -h <baseURL> -p <paths> [-t <timeout>] [-o <output_directory>] [-H <height>] [-c <width>x<height>]... [-v <viewports>...] [-a <chrome_flag>]...
```

### Command-line Arguments

- **`-h`**: **Base URL** (required) - The starting URL for capturing screenshots.
- **`-p`**: **Paths** (required) - One or more URL paths to capture. Provide each path as a space-separated list.
- **`-t`**: **Timeout** - Delay (in milliseconds) held after each auto-scroll step and again before the screenshot is taken (default: `100`). Raise it for pages that load content lazily.
- **`-o`**: **Output Directory** - Directory where screenshots will be saved. Defaults to the current working directory. Screenshots are organized into sub-folders by domain and viewport.
- **`-H`**: **Height Limit** - If provided, only captures up to the specified height (in pixels). If omitted, the entire page is captured.
- **`-c`** or **`--custom`**: **Custom Resolution(s)** - Specify custom resolution(s) in the format `WIDTHxHEIGHT`. This flag can be repeated to add multiple resolutions.
- **`-a`** or **`--args`**: **Chrome Launch Flag** - Pass a single flag straight to the Chrome process. Repeat the option to pass several. Needed wherever Chrome cannot use its own sandbox, such as inside a container or a CI runner, where launching without `--no-sandbox` crashes on startup.
- **`-v`**: **Viewports** - Define which viewports to generate. Acceptable values are `s`, `m`, `l`, `xl`, and `custom` (to include all custom resolutions defined with `-c`). If omitted, screenshots are generated for all default viewports and any custom resolutions.

### Examples

#### 1. Full-page screenshots for default viewports

Capture screenshots for the homepage, blog, bio, and contact pages:

```bash
snaprocket -h https://dawidrylko.com -p / /blog /bio /contact
```

#### 2. Screenshots with a height limit for selected viewports

Capture screenshots with a height limit of 800 pixels for the "s" (small) and "xl" (extra-large) viewports:

```bash
snaprocket -h https://dawidrylko.com -p / /blog -H 800 -v s xl
```

#### 3. Screenshots with custom resolutions

Generate screenshots using two custom resolutions (800x600 and 1200x800). The `-v custom` flag ensures that only the specified custom viewports are processed:

```bash
snaprocket -h https://dawidrylko.com -p / -v custom -c 800x600 -c 1200x800
```

#### 4. Screenshots from inside a container

Chrome refuses to start under its own sandbox in most container images, so pass the flags that turn it off:

```bash
snaprocket -h https://dawidrylko.com -p / -a --no-sandbox -a --disable-setuid-sandbox
```

## 📂 Directory Structure

After execution, screenshots will be organized in the output directory as shown below:

```
📁 output_directory/
  └── dawidrylko.com/
      ├── s/
      ├── m/
      ├── l/
      └── xl/
```

_Note:_ If custom viewports are used, an additional folder (e.g. `custom/`) will be created containing screenshots for each custom resolution.

## 🚢 Releasing

Releases are automated. Pushing a `vX.Y.Z` tag runs `.github/workflows/release.yml`, which verifies the tag against `version` in `package.json`, audits, packs, publishes to npm and creates the GitHub Release.

It uses npm trusted publishing over OIDC, so there is no `NPM_TOKEN` to store or rotate. This needs a one time setup on npmjs.com: in the package settings, add a trusted publisher for `dawidrylko/snaprocket` with the workflow file `release.yml`.

To cut a release:

```bash
npm version patch   # or minor / major, which commits and tags
git push --follow-tags
```

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

Developed and maintained by [Dawid Ryłko](https://dawidrylko.com).
