# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-14

### Added
- **Professional Layouts**: Introduced `two-column`, `impact`, and `full-bg` layouts for slides.
- **Layered Configuration**: Implemented a hybrid syntax using `===` for slide separation and `---` for per-slide YAML configuration.
- **Dynamic Backgrounds**: Added support for both `bg` (solid color) and `bgImage` (full-screen background) via slide metadata.
- **WYSIWYG Scaling Preview**: A new preview system that scales the slide content proportionally (1200px virtual canvas), ensuring 100% visual consistency regardless of screen size.
- **Automatic Image Pre-processing**: Images are now automatically converted to Base64 before PPTX export to ensure compatibility and bypass CORS issues.
- **Enhanced Chat Mode**: Robust regex parsing and beautiful "Floating Bubbles" visual style for character dialogues.

### Changed
- **Slide Separator**: Migrated from `---` to `===` to prevent confusion with YAML frontmatter.
- **Business Aesthetics**: Redesigned default styles with white backgrounds, professional margins, and larger fonts.
- **Performance**: Optimized Vite build chunks to handle large libraries like `mermaid` and `pptxgenjs`.

### Fixed
- **Empty Slide Issue**: Fixed a logic bug where leading headings or separators would generate an unwanted empty first slide.
- **Build Errors**: Resolved esbuild syntax errors related to backtick escaping in template literals.

## [0.1.0] - 2026-01-14

### Evolution
- **Project Rebirth**: Transitioned from `BookPublisher MD2Docx` to `MD2PPT-Evolution`.
- **Core Engine**: Switched from `docx` (Word) to `pptxgenjs` (PowerPoint).
- **Default Content**: Updated examples to showcase slide decks, code blocks, and charts suitable for presentations.
- **Layouts**: Changed page sizes to standard slide aspect ratios (16:9, 4:3, etc.).
- **Infrastructure**: Cleaned up legacy DOCX code while preserving the robust split-view editor and AST parser.

## [Legacy Versions]

### [1.2.8] - 2026-01-09 (MD2Docx)
- Last version of the Word Document generator.