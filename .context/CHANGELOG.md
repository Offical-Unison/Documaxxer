# Documaxxer — Changelog

All notable changes to the Documaxxer architecture, data models, components, and documentation are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- **Milestone 2**: Formalize Document Engine & Schema (separate TemplateDefinition from SavedDocument).
- **Milestone 3**: Authentication system with session persistence and route protection.
- **Milestone 4**: Database persistence layer with relational models.
- **Milestone 5**: User workspace dashboard for saved documents and custom templates.

---

## [0.2.0] — 2026-09-04

### Milestone 1 — Project Structure Cleanup & Knowledge Base Establishment
- **Status**: In Progress / Initial Restructuring Baseline

#### Added
- **Knowledge Base (`.context/`)**: Created authoritative developer and AI agent documentation suite:
  - [`README.md`](file:///e:/Github/Documaxxer/.context/README.md) — Onboarding protocol, reading order, and rules.
  - [`PROJECT.md`](file:///e:/Github/Documaxxer/.context/PROJECT.md) — Vision, branding, target audience, and tech stack.
  - [`ARCHITECTURE.md`](file:///e:/Github/Documaxxer/.context/ARCHITECTURE.md) — System components, data flow, and rendering pipeline.
  - [`FILE_STRUCTURE.md`](file:///e:/Github/Documaxxer/.context/FILE_STRUCTURE.md) — Post-restructuring directory tree and file responsibilities.
  - [`CURRENT_STATE.md`](file:///e:/Github/Documaxxer/.context/CURRENT_STATE.md) — Implementation status matrix, completion %, and technical debt.
  - [`MILESTONES.md`](file:///e:/Github/Documaxxer/.context/MILESTONES.md) — Master roadmap (M0–M15) with checklists and acceptance criteria.
  - [`DOCUMENT_MODEL.md`](file:///e:/Github/Documaxxer/.context/DOCUMENT_MODEL.md) — State interfaces, section schemas, and all 29 reducer actions.
  - [`TEMPLATE_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/TEMPLATE_SYSTEM.md) — Template catalog, theme definitions, and pagination algorithms.
  - [`EXPORT_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/EXPORT_SYSTEM.md) — Native DOCX generation, print PDF rules, and unit conversions.
  - [`TYPOGRAPHY.md`](file:///e:/Github/Documaxxer/.context/TYPOGRAPHY.md) — Shared typography tokens, half-point scaling, and font stacks.
  - [`DESIGN_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/DESIGN_SYSTEM.md) — Dual design philosophy (App Shell vs Document Canvas).
  - [`DEVELOPMENT_RULES.md`](file:///e:/Github/Documaxxer/.context/DEVELOPMENT_RULES.md) — Engineering invariants, coding standards, and preservation rules.
  - [`DECISIONS.md`](file:///e:/Github/Documaxxer/.context/DECISIONS.md) — Architecture Decision Records ADR-001 through ADR-008.
  - [`CHANGELOG.md`](file:///e:/Github/Documaxxer/.context/CHANGELOG.md) — Initial changelog tracking project milestones.

#### Changed
- Organized builder components into structured subdirectories:
  - `components/builder/controls/` for specialized form input components.
  - `components/builder/form/` for wizard and dynamic section managers.
  - `components/builder/preview/` for live preview, scaled page renderer, and print portal.
- Organized shared libraries into domain subdirectories:
  - `lib/documents/` for typography tokens, document configuration, block generators, and statistics.
  - `lib/export/` for native DOCX generation.
  - `lib/templates/` for template registry and catalog.
  - `lib/validation/` for phone and input validation.

#### Fixed
- Standardized `.gitignore` rules to exclude Next.js build artifacts (`.next/`), dependencies (`node_modules/`), and environment secrets (`.env*`).

---

## [0.1.0] — Initial Codebase Baseline

### Milestone 0 — Project Audit
- Complete inspection of initial MVP codebase.
- Verified existing working functionality:
  - Client-side Resume and Curriculum Vitae builder.
  - 6 built-in templates (`ats-classic`, `modern-tech`, `executive`, `academic`, `research`, `professional`).
  - Real-time live preview with greedy pagination and orphan-header protection.
  - Native editable Word export via `docx` library.
  - Clean PDF export via browser print (`window.print()`).
  - 6 cross-platform font families with typography tokens.
  - 500ms debounced `localStorage` autosave.
  - 15+ dynamic optional sections with HTML5 drag-and-drop reordering.
  - Philippine-focused defaults (`+63`, local phone formatting, local examples).
  - Dark and light mode theme support via Tailwind CSS v4.
