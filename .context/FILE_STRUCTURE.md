# Documaxxer — File Structure & Directory Tree

This document describes the codebase directory layout post-restructuring (Milestone 1). All modules, components, utilities, and routes are documented with their specific architectural responsibilities.

---

## 1. Directory Tree Overview

```text
e:\Github\Documaxxer\
├── .context/                       # Knowledge base & development context for AI & developers
├── app/                            # Next.js 15 App Router pages, routes, and root layout
├── components/                     # Reusable React components
│   ├── builder/                    # Core builder workspace components
│   │   ├── controls/               # Reusable specialized form input controls
│   │   ├── form/                   # Builder form wizard & section manager containers
│   │   └── preview/                # Live preview, scaled A4 rendering, and print portal
│   ├── landing/                    # Marketing & landing page presentation components
│   ├── layout/                     # Global shell layout components (Navbar)
│   ├── theme/                      # Light/dark theme controls
│   └── ui/                         # Base design system primitives (Button, Card)
├── context/                        # React Context providers and reducers
├── hooks/                          # Custom application hooks
├── lib/                            # Shared libraries, utilities, exports, and helpers
│   ├── documents/                  # Typography tokens, block builders, and document config
│   ├── export/                     # Native DOCX generation engine
│   ├── templates/                  # Built-in template registries and catalog
│   └── validation/                 # Validation utilities (phone, dates)
├── public/                         # Static assets, SVG icons, and hero photography
├── styles/                         # Global styling and Tailwind CSS v4 entry
└── types/                          # Global TypeScript interface and type declarations
```

---

## 2. Detailed File Descriptions

### `app/` — Application Routes
Next.js App Router root handling client routing, metadata, and HTML shell.

- [`app/layout.tsx`](file:///e:/Github/Documaxxer/app/layout.tsx): Root application layout. Injects font definitions, wraps children in [`ThemeProvider`](file:///e:/Github/Documaxxer/context/theme-context.tsx) and [`DocumentProvider`](file:///e:/Github/Documaxxer/context/document-context.tsx), and mounts the global navigation bar.
- [`app/page.tsx`](file:///e:/Github/Documaxxer/app/page.tsx): Home/landing page mounting [`Hero`](file:///e:/Github/Documaxxer/components/landing/hero.tsx) and [`HowItWorks`](file:///e:/Github/Documaxxer/components/landing/how-it-works.tsx).
- [`app/create/page.tsx`](file:///e:/Github/Documaxxer/app/create/page.tsx): Document type selector page (Resume vs Curriculum Vitae). Sets document type in state and routes to template selection.
- [`app/templates/page.tsx`](file:///e:/Github/Documaxxer/app/templates/page.tsx): Visual template catalog grid with query parameter filtering (`?type=resume|cv`). Allows previewing and selecting a template before entering the builder.
- [`app/builder/page.tsx`](file:///e:/Github/Documaxxer/app/builder/page.tsx): Primary split-screen document builder workspace. Mounts [`BuilderHeader`](file:///e:/Github/Documaxxer/components/builder/builder-header.tsx), [`DocumentFormContainer`](file:///e:/Github/Documaxxer/components/builder/form/document-form-container.tsx), and [`DocumentPreviewContainer`](file:///e:/Github/Documaxxer/components/builder/preview/document-preview-container.tsx).
- [`app/not-found.tsx`](file:///e:/Github/Documaxxer/app/not-found.tsx): Branded 404 error page.

---

### `components/` — UI Components

#### `components/builder/` — Builder Workspace
- [`builder-header.tsx`](file:///e:/Github/Documaxxer/components/builder/builder-header.tsx): Top navigation bar in the builder workspace with document title, quick reset, and status tags.
- [`template-picker.tsx`](file:///e:/Github/Documaxxer/components/builder/template-picker.tsx): Dropdown or pill selector allowing instant template switching during editing.
- [`placeholder-content.tsx`](file:///e:/Github/Documaxxer/components/builder/placeholder-content.tsx): Empty-state and stub presentation helper.
- [`statistics-panel.tsx`](file:///e:/Github/Documaxxer/components/builder/statistics-panel.tsx): *(Stub)* Panel for document analytics (word count, estimated pages, completion rate).
- [`tutorial-container.tsx`](file:///e:/Github/Documaxxer/components/builder/tutorial-container.tsx): *(Stub)* Container wrapper for onboarding walk-throughs.
- [`tutorial-screen.tsx`](file:///e:/Github/Documaxxer/components/builder/tutorial-screen.tsx): Complete 4-step interactive onboarding modal/screen *(currently orphaned, pending route attachment)*.

#### `components/builder/controls/` — Specialized Form Inputs
- [`bullet-list.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/bullet-list.tsx): Interactive multiline bullet point manager with add, remove, edit, and reorder capability.
- [`date-input.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/date-input.tsx): Partial date selector (Year + Month dropdowns) supporting ongoing ("Present / Currently working") states.
- [`editable-title.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/editable-title.tsx): Inline-editable section header allowing users to rename standard section headings.
- [`font-picker.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/font-picker.tsx): Dropdown selector for active document typography font family.
- [`form-controls.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/form-controls.tsx): Reusable primitive form fields: `Field`, `Textarea`, `EntryCard`, `AddButton`, and `TagInput`.
- [`link-list.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/link-list.tsx): Dynamic list manager for external URLs (LinkedIn, GitHub, Portfolio).
- [`phone-input.tsx`](file:///e:/Github/Documaxxer/components/builder/controls/phone-input.tsx): Country code selector + phone number input with Philippine defaults.

#### `components/builder/form/` — Wizard & Section Management
- [`document-form-container.tsx`](file:///e:/Github/Documaxxer/components/builder/form/document-form-container.tsx): Multi-step sequential wizard (Personal, Experience, Education, Skills, Additional) with step validation.
- [`optional-document-sections.tsx`](file:///e:/Github/Documaxxer/components/builder/form/optional-document-sections.tsx): Card grid enabling 15+ optional section types and HTML5 drag-and-drop reordering.

#### `components/builder/preview/` — Document Preview & Export UI
- [`document-preview.tsx`](file:///e:/Github/Documaxxer/components/builder/preview/document-preview.tsx): Real-time A4 preview engine containing `useDocumentPages()`, `A4Page` uniform scaler, and `DocumentAllPages` print portal.
- [`document-preview-container.tsx`](file:///e:/Github/Documaxxer/components/builder/preview/document-preview-container.tsx): Preview pane wrapper with template picker, font selector, modal expand toggle, and print portal mount.
- [`generate-button.tsx`](file:///e:/Github/Documaxxer/components/builder/preview/generate-button.tsx): Dual download trigger button supporting PDF (`window.print()`) and DOCX (`exportDocumentToDocx()`).

#### `components/landing/` — Marketing
- [`hero.tsx`](file:///e:/Github/Documaxxer/components/landing/hero.tsx): Hero banner with animated badge, document type quick-action cards, and value proposition.
- [`how-it-works.tsx`](file:///e:/Github/Documaxxer/components/landing/how-it-works.tsx): 3-step feature highlight explaining the workflow.

#### `components/layout/` & `components/theme/`
- [`layout/navbar.tsx`](file:///e:/Github/Documaxxer/components/layout/navbar.tsx): Global sticky navigation bar with Documaxxer logo, navigation links, and theme toggle.
- [`theme/theme-toggle.tsx`](file:///e:/Github/Documaxxer/components/theme/theme-toggle.tsx): Dark/Light mode button toggling HTML class.

#### `components/ui/` — Base Primitives
- [`button.tsx`](file:///e:/Github/Documaxxer/components/ui/button.tsx): Styled button with variants (default, secondary, ghost, outline) and sizes.
- [`card.tsx`](file:///e:/Github/Documaxxer/components/ui/card.tsx): Base card container with glassmorphic styling and borders.

---

### `context/` — State Management
- [`document-context.tsx`](file:///e:/Github/Documaxxer/context/document-context.tsx): `DocumentProvider` component, context hooks, and 500ms debounced `localStorage` autosave.
- [`document-reducer.ts`](file:///e:/Github/Documaxxer/context/document-reducer.ts): Comprehensive `documentReducer` managing initial state and 29 distinct document actions.
- [`theme-context.tsx`](file:///e:/Github/Documaxxer/context/theme-context.tsx): `ThemeProvider` managing light/dark preference persisted in `localStorage`.

---

### `hooks/` — Custom Hooks
- [`use-document.ts`](file:///e:/Github/Documaxxer/hooks/use-document.ts): Convenient alias exporting `useDocumentContext`.

---

### `lib/` — Business Logic & Utilities

#### `lib/documents/` — Core Document Engine
- [`document-typography.ts`](file:///e:/Github/Documaxxer/lib/documents/document-typography.ts): Single source of truth for typography tokens (point sizes, half-points for DOCX, CSS style objects).
- [`document-config.ts`](file:///e:/Github/Documaxxer/lib/documents/document-config.ts): Step configuration (`CORE_STEPS`) and step labels for the builder wizard.
- [`document-blocks.tsx`](file:///e:/Github/Documaxxer/lib/documents/document-blocks.tsx): Document layout engine: A4 dimensions, `TEMPLATE_THEMES`, `buildTemplateBlocks()`, and `paginateBlocks()`.
- [`statistics.ts`](file:///e:/Github/Documaxxer/lib/documents/statistics.ts): Word count calculation across all populated document sections.

#### `lib/export/`
- [`docx-export.ts`](file:///e:/Github/Documaxxer/lib/export/docx-export.ts): Full-fidelity native DOCX exporter using the `docx` library. Generates real OOXML paragraphs, tab stops, and bullet lists.

#### `lib/templates/`
- [`templates.ts`](file:///e:/Github/Documaxxer/lib/templates/templates.ts): Template registry defining the 6 built-in templates (3 Resume, 3 CV) and helper `getTemplate()`.

#### `lib/validation/`
- [`phone.ts`](file:///e:/Github/Documaxxer/lib/validation/phone.ts): Phone number format validation supporting Philippine mobile numbers and international numbers.

#### `lib/` root helpers
- [`constants.ts`](file:///e:/Github/Documaxxer/lib/constants.ts): Application constants (branding strings, defaults).
- [`countries.ts`](file:///e:/Github/Documaxxer/lib/countries.ts): International country dialing codes and flags with PH at top.
- [`fonts.ts`](file:///e:/Github/Documaxxer/lib/fonts.ts): 6 supported document fonts (`Arial`, `Calibri`, `Times New Roman`, `Georgia`, `Helvetica`, `Verdana`).
- [`format.ts`](file:///e:/Github/Documaxxer/lib/format.ts): Date range formatting, partial date parsing, and recency sorting utilities.
- [`suggestions.ts`](file:///e:/Github/Documaxxer/lib/suggestions.ts): Pre-populated suggestions for job roles, degrees, and common skills.
- [`years.ts`](file:///e:/Github/Documaxxer/lib/years.ts): Year ranges for date picker controls.

---

### `styles/`, `types/`, & `public/`
- [`styles/globals.css`](file:///e:/Github/Documaxxer/styles/globals.css): Tailwind CSS v4 imports, theme animations, and print `@media print` rules.
- [`types/document.ts`](file:///e:/Github/Documaxxer/types/document.ts): Authoritative TypeScript definitions for `DocumentData`, `DocumentState`, `Experience`, `Education`, and 15+ section schemas.
- `public/hero-resume.jpg`: High-resolution marketing hero image.
- `public/icon.svg`: App favicon and branding mark.
