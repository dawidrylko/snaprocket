# Changelog

All notable changes to snaprocket are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-06

### Added

- Tests, run with `pnpm test` on the Node test runner. They cover argument parsing, viewport selection and the capture sequence, and need no browser.
- A CI workflow running those tests on every pull request. The release workflow runs them too, before it publishes.
- Both test steps now fail a run that discovered no tests. `node --test` exits 0 when it finds none, so a commit that moved or deleted the suite would have gone green on an empty run.
- This changelog, plus issue templates for bug reports and feature requests.
- A known limitations section in the README, for the viewport selection that can silently match nothing.

### Fixed

- A capture with `-H`, or with a `-c` resolution, showed the foot of the page instead of the top. The auto-scroll ran before every shot and never scrolled back, so the viewport sat at the bottom of the document.
- Custom resolution folders were named `custom_1` and `custom_2` under `-v custom`, but `custom1` and `custom2` without `-v`. They are now `custom1` and `custom2` either way.
- An unknown option consumed the argument after it. `snaprocket -x -h URL -p /` lost the base URL and then reported it as missing. Unknown options are now named on stderr and skipped.

### Changed

- Raised the Node.js floor to the Node 26 line, with development and CI on 26.8.1. Puppeteer 25 would still run on 22.12.0, so this is the project's own floor.
- Dropped the npm pin from the release workflow. Node 26 ships npm 11.19.0, which is newer than the pinned 11.18.0 and already supports trusted publishing.
- Rewrote the README around a quickstart and a table of options.
- Documented the default viewport widths, the output file naming and the folder each custom resolution gets. None of it was written down before.
- Narrowed the npm keywords and the package description to what the tool actually does.
- Ignored npm pack output, debug logs and `.DS_Store`.

## [0.1.0] - 2026-09-05

### Added

- `-a`, `--args` passes a flag straight to the Chrome process, so runs work where Chrome cannot use its own sandbox. Repeat the option for several flags.
- Release workflow: a pushed `vX.Y.Z` tag verifies the version, audits, publishes to npm over OIDC trusted publishing and opens a GitHub Release.

### Changed

- Declared a Node.js 22.12.0 floor, the version Puppeteer 25 requires.

## [0.0.2] - 2025-04-11

### Added

- Auto-scrolling before capture, so pages that load content on scroll are captured whole.

## [0.0.1] - 2025-04-11

### Added

- First release. Full-page screenshots at four default viewport widths and at custom resolutions, with a height limit, a configurable pause and a chosen output directory.

[Unreleased]: https://github.com/dawidrylko/snaprocket/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/dawidrylko/snaprocket/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/dawidrylko/snaprocket/compare/0.0.2...v0.1.0
[0.0.2]: https://github.com/dawidrylko/snaprocket/compare/0.0.1...0.0.2
[0.0.1]: https://github.com/dawidrylko/snaprocket/releases/tag/0.0.1
