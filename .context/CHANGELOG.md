# Documaxxer — Changelog

All notable changes to the Documaxxer architecture, data models, components, and documentation are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- **Milestone 3**: Authentication system with session persistence and route protection.
- **Milestone 4**: Database persistence layer with relational models.
- **Milestone 5**: User workspace dashboard for saved documents and custom templates.
- **Milestone 6**: Universal Template Builder allowing visual schema design.

---

## [0.4.0] — 2026-10-31

### Export completion & bug fixes

#### Added
- Shared layout module (`lib/documents/document-layout.ts`) used by preview, PDF and DOCX for section order, visible entries, letters and export file names.
- DOCX export for cover, authorization and excuse letters (classic / modern / minimal styles); all 20 resume/CV sections; template header alignment; two-column sidebar as a table; real hyperlinks.
- Visual template editor: load/edit saved templates (`?template=<id>`), save as copy, new, resize handles (E/S/SE), layers panel, keyboard nudge/delete/duplicate, zoom, page delete, page background and custom size, image/logo upload, rendering for every block type.
- Visual template export to PDF (per-page `@page` sizes) and editable DOCX (floating positioned tables and images).
- Database autosave for saved documents with a save-status badge, flush on page close, and "Save to my documents" for signed-in users editing a local draft.
- Log out, session-aware Dashboard/Log in links, dashboard template management (open/delete visual templates), profile phone field.
- Export controls and preview on screens below the `xl` breakpoint.

#### Fixed
- Pagination could loop forever (frozen tab) when a block was taller than a page or when the measuring container was hidden on small screens.
- PDF pagination collapsed to one page when the preview pane was hidden; pagination now re-measures when the font or header changes.
- Saving visual templates always failed (`business-document` rejected by the API).
- Signed-out users could not start a document from the templates page.
- Edits to documents opened from the dashboard were never saved back to the database.
- Dashboard "PDF" overwrote the local draft; template links ignored the selected template.
- Recipient title field in letters never kept its value; recipient organization was not shown.
- Older/partial drafts in localStorage or the database could crash the builder (now normalized on load).
- Document creation accepted unknown or other users' template ids.
- Object URLs were revoked before downloads started in some browsers.
- DOCX layout drifted up to ~70pt from the preview: line heights now match the preview's CSS line-height, bullet indents match, sidebar entries stack like the preview, Word's default table cell margins are removed, and kerning is enabled (Word now within ~4pt of the preview).
- The two-column preview sidebar showed stray "•" separators at line ends; contact details are now one per line.

## [0.3.0] — 2026-09-05

### Milestone 2 — Formalize Document Engine & Data Model

#### Added
- **Template Schema Types ([`types/template.ts`](file:///e:/Github/Documaxxer/types/template.ts))**:
  - `TemplateFieldType`: Supported input control types (`text`, `textarea`, `email`, `phone`, `date`, `url`, `number`, `select`, `multiselect`, `list`, `rich-text`).
  - `TemplateField`: Declarative field-level schema defining ID, key mapping to `DocumentData`, label, type, validation requirements, placeholder, and `profileMapping` for M8 autofill.
  - `TemplateSection`: Section-level schema mapping to `SectionId`, with title, display order, required flag, repeatable entries toggle, layout column placement, and child fields.
  - `TemplateLayout`: Layout configuration specifying column structure (`1` or `2`), header alignment (`left` or `center`), and optional sidebar ratio.
  - `TemplateDefinition`: Full document schema specification distinguishing built-in vs custom templates, owner user ID, ordered sections, layout, and font overrides.
- **Saved Document Model ([`types/saved-document.ts`](file:///e:/Github/Documaxxer/types/saved-document.ts))**:
  - `SavedDocument`: Data model representing an instantiated document, encapsulating `id`, `name`, `documentType`, `templateId`, `content` (`DocumentData`), `selectedFontId`, `ownerId`, timestamps, and an optional `templateSnapshot` for immutable layout preservation.
- **Data-Driven Template Definitions ([`lib/templates/templates.ts`](file:///e:/Github/Documaxxer/lib/templates/templates.ts))**:
  - `TEMPLATE_DEFINITIONS`: Complete schema dictionary mapping all 6 built-in templates (`ats-classic`, `modern-tech`, `executive`, `academic`, `research`, `professional`) to full `TemplateDefinition` schema objects.
  - `getTemplateDefinition()`: Lookup function retrieving the schema definition for any template ID with safe fallback to `DEFAULT_TEMPLATE_ID` (`ats-classic`).
- **Architectural Foundation**: Fully decouples document structure (templates) from user data instances (saved documents), establishing the foundation for Auth (M3), Database (M4), Dashboard (M5), and Universal Template Builder (M6).

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
