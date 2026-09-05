# snaprocket

snaprocket is a command line tool that captures full-page screenshots of a website at several viewport widths in one run. It is built for developers and testers who want a quick visual record of a site across breakpoints, locally or in CI.

[![npm version](https://img.shields.io/npm/v/snaprocket.svg)](https://www.npmjs.com/package/snaprocket)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Give it a base URL and a list of paths. It drives Chrome through Puppeteer and scrolls each page to the bottom, so lazy content loads before the shot. Then it writes one PNG per path per viewport into a folder tree.

## Requirements

Node.js 22.12.0 or newer. That floor comes from Puppeteer 25, the only dependency. Installing snaprocket also downloads a Chrome build, which Puppeteer manages for you.

## Install

```bash
npm install -g snaprocket
```

The equivalents are `yarn global add snaprocket` and `pnpm add -g snaprocket`. To keep it to one project, install it as a dev dependency with `npm install --save-dev snaprocket` and call it from a package script.

## Quickstart

```bash
snaprocket -h https://dawidrylko.com -p / /blog /bio /contact
```

Four paths at four default widths gives sixteen screenshots. They land in `./dawidrylko.com/` in the current directory.

## Options

| Flag | Value | Default | Description |
| --- | --- | --- | --- |
| `-h` | URL | required | Base URL that every path is appended to. |
| `-p` | one or more paths | required | Paths to capture, space separated. |
| `-t` | milliseconds | `100` | Pause held after each scroll step, and again before the shot. Raise it for pages that load content lazily. |
| `-o` | directory | current directory | Where the output tree is written. |
| `-H` | pixels | whole page | Fix the viewport to this height instead of capturing the whole page. See [known limitations](#known-limitations). |
| `-c`, `--custom` | `WIDTHxHEIGHT`, repeatable | none | Add a viewport at an exact size. |
| `-a`, `--args` | Chrome flag, repeatable | none | Pass one flag straight to the Chrome process. |
| `-v` | `s`, `m`, `l`, `xl`, `custom` | all of them | Restrict the run to the named viewports. |

The default viewports are `s` at 640 px wide, `m` at 768, `l` at 1024 and `xl` at 1440. They set the width only, so the height follows the page unless `-H` says otherwise. Passing `-v custom` selects every resolution given with `-c`.

## Examples

### Whole pages at every default width

```bash
snaprocket -h https://dawidrylko.com -p / /blog /bio /contact
```

### A fixed height of 800 pixels, at two widths

```bash
snaprocket -h https://dawidrylko.com -p / /blog -H 800 -v s xl
```

### Custom resolutions and nothing else

```bash
snaprocket -h https://dawidrylko.com -p / -v custom -c 800x600 -c 1200x800
```

### A page that loads more content as you scroll

Raise the pause so the page has time to fetch each batch:

```bash
snaprocket -h https://dawidrylko.com -p /blog -t 600
```

### Inside a container or a CI runner

Chrome cannot use its own sandbox in most container images and crashes on startup. Pass the flags that turn it off:

```bash
snaprocket -h https://dawidrylko.com -p / -a --no-sandbox -a --disable-setuid-sandbox
```

## Output

Screenshots go under the output directory, in a folder named after the host, then one folder per viewport:

```
dawidrylko.com/
  s/
    1.home.png
    2.blog.png
  m/
  l/
  xl/
```

Each file is named `<index>.<path>.png`. The index follows the order of `-p`, zero padded to the width of the longest number. The path is slugified, and the root path becomes `home`.

Custom resolutions get one folder each rather than a shared one. The names differ by how the run was started: `custom1` and `custom2` when `-v` is omitted, `custom_1` and `custom_2` when `-v custom` selects them.

## Known limitations

snaprocket scrolls every page to the bottom before it shoots, and it never scrolls back up. So a run that fixes the viewport height, with `-H` or with a `-c` resolution, captures the foot of the page rather than the top. Only a whole-page run is unaffected.

A `-v` value that matches no viewport produces no screenshots, and the run still exits successfully. `-v custom` with no `-c` behaves the same way. Check the exit of a CI job by counting the files it wrote, not by its status.

## Releasing

Releases run from a pushed tag. `.github/workflows/release.yml` checks the tag against `version` in `package.json`, audits the dependencies, packs the tarball, publishes to npm and opens a GitHub Release.

```bash
npm version patch
git push --follow-tags
```

Use `minor` or `major` in place of `patch` as the change requires. `npm version` writes the new version, commits it and creates the tag.

Publishing uses npm trusted publishing over OIDC, so there is no `NPM_TOKEN` to store or rotate. It needs one setup step on npmjs.com: in the package settings, add a trusted publisher for `dawidrylko/snaprocket` with the workflow file `release.yml`.

Past releases are listed in [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. See [LICENSE](./LICENSE).

## Author

[Dawid Ryłko](https://dawidrylko.com)
