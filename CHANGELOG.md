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

## [1.0.4] - 2026-02-01
### Updated
- History cards now include prompt panel (copy + polish entry) and a “打开” button to locate local files.
- Preview supports zoom/pan and maximization for large windows.
- History window can maximize/restore and follows panel resizing.
- Img2img export uses active-layer file export (no extra PS document).

## [1.0.5] - 2026-02-01
### Updated
- Feature picker tiles resized to smaller squares with larger centered icons.
- Ark console label now opens external browser via link click.
### Fixed
- CEP Node require fallback restored for file/copy operations.
- Clipboard copy on Windows now uses PowerShell STA to improve reliability.

## [1.0.6] - 2026-02-02
### Updated
- Result/album context menu width now auto-sizes to content.
- Result cards now support right-click actions (open/insert/replace/open folder/prompt).
- Preview toolbar includes prev/next navigation controls.
- Cache root normalized to Photoshop install `invalidParam\\NiuAssistCache`.
### Fixed
- History read fallback from meta when index is missing or relative paths break.
- Progress no longer stuck at 70% when cache path is unavailable.
