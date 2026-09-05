# Changelog

All notable changes to snaprocket are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- This changelog, plus issue templates for bug reports and feature requests.
- A known limitations section in the README. It covers the fixed-height capture and the viewport selection that silently matches nothing.

### Changed

- Rewrote the README around a quickstart and a table of options.
- Documented the default viewport widths, the output file naming and the folder each custom resolution gets. None of it was written down before.
- Corrected the description of `-H`. It claimed to capture the top of the page, which is not what the code does.
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

[Unreleased]: https://github.com/dawidrylko/snaprocket/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dawidrylko/snaprocket/compare/0.0.2...v0.1.0
[0.0.2]: https://github.com/dawidrylko/snaprocket/compare/0.0.1...0.0.2
[0.0.1]: https://github.com/dawidrylko/snaprocket/releases/tag/0.0.1
