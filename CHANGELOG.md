# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-31
### Added
- Browser panel with bookmarks and recent history.
- Image capture (IMG/SVG/CANVAS/background) with quick insert.
- Python transcode workflow for large images.
- Original mode (PNG, no resize).
- JPG compression and max-side resize options.
- Progress spinner with percent.

## [1.0.1] - 2026-02-01
### Updated
- AI feature picker switched to square tile layout with centered icons and labels.
- Text assistant actions refined: insert button near generate, text result panel hidden for text mode.
- Text input/output layout adapts to narrow width (stacked vertically).
- Bookmark panel positioning improved for narrow windows.
### Fixed
- Context menu now remains accessible even when capture mode is off (insert is disabled until enabled).

## [1.0.2] - 2026-02-01
### Updated
- Feature picker tiles tightened to smaller squares with larger icons; V1/V2 badges removed.
- Feature panel now overlays without horizontal scrolling, and avoids covering the “立即生成” button.
- Text assistant layout adjusted: inputs taller, insert button sits above generate in text mode.

## [1.0.3] - 2026-02-01
### Updated
- AI results now render incrementally (first image shows immediately), with per-image progress preserved.
- History entry is always accessible from the result header (no need to generate first).
- Preview and history UX refined (prompt copy, improved z-index layering).
### Fixed
- History close (X/backdrop/ESC).
- History thumbnails no longer crop tall images (contain).
