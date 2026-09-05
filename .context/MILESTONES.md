# Documaxxer — Master Milestone Roadmap (M0–M15)

This document is the authoritative progress tracker for the Documaxxer project. Every milestone specifies its core purpose, dependencies, detailed task checklists, acceptance criteria, current status, and completion percentage.

---

## Roadmap Summary

| Milestone | Title | Status | Completion | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **M0** | Project Audit & Current-Milestone Detection | **COMPLETE** | 100% | None |
| **M1** | Project Structure Cleanup | **COMPLETE** | 100% | M0 |
| **M2** | Formalize the Document Engine & Data Model | **COMPLETE** | 100% | M1 |
| **M3** | User Authentication | **COMPLETE** | 100% | M2 |
| **M4** | Database & Persistence Layer | **IN PROGRESS** | 35% | M3 |
| **M5** | User Workspace & Dashboard | **NOT STARTED** | 0% | M4 |
| **M6** | Universal Template Builder | **NOT STARTED** | 0% | M2, M5 |
| **M7** | Template → Saved Document Instantiation | **NOT STARTED** | 0% | M6 |
| **M8** | User Profile & Smart Autofill Suggestions | **NOT STARTED** | 0% | M5, M7 |
| **M9** | Database-Backed Document Autosave | **NOT STARTED** | 0% | M4, M7 |
| **M10** | True 1:1 Export Parity (Preview/PDF/DOCX) | **PARTIAL** | 65% | M2 |
| **M11** | Template Versioning & Snapshot Safety | **NOT STARTED** | 0% | M6, M7 |
| **M12** | Document Management Quality | **NOT STARTED** | 0% | M5, M9 |
| **M13** | Template Management Quality | **NOT STARTED** | 0% | M5, M6 |
| **M14** | UX Polish, Accessibility & Mobile Builder | **NOT STARTED** | 0% | M12, M13 |
| **M15** | Production Build & Comprehensive QA | **NOT STARTED** | 0% | M0–M14 |

---

## Milestone Details

### Milestone 0 — Project Audit & Current-Milestone Detection
- **Purpose**: Deep code inspection of existing codebase to establish baseline reality and prevent duplicate rewrites.
- **Dependencies**: None.
- **Status**: `COMPLETE` (100%)
- **Tasks**:
  - [x] Inspect package dependencies, scripts, and Next.js 15 / React 19 configuration.
  - [x] Analyze existing client-side `DocumentProvider` and `useReducer` architecture.
  - [x] Audit the 6 built-in templates (`ats-classic`, `modern-tech`, `executive`, `academic`, `research`, `professional`).
  - [x] Evaluate DOCX generator (`lib/export/docx-export.ts`) and PDF print rules (`styles/globals.css`).
  - [x] Identify known stubs (`statistics-panel.tsx`, `tutorial-container.tsx`, orphaned `tutorial-screen.tsx`).
- **Acceptance Criteria**: Baseline reality documented with zero assumptions.

---

### Milestone 1 — Project Structure Cleanup
- **Purpose**: Reorganize existing components and utilities into cohesive modular subdirectories without regressing any working features.
- **Dependencies**: M0.
- **Status**: `IN PROGRESS` (85%)
- **Tasks**:
  - [x] Clean `.gitignore` to exclude build artifacts (`.next/`, `node_modules/`, `.env*`).
  - [x] Create `.context/` knowledge base with all 14 architectural guides.
  - [x] Restructure builder components into `controls/`, `form/`, and `preview/`.
  - [x] Restructure `lib/` into `documents/`, `export/`, `templates/`, and `validation/`.
  - [x] Verify build and linting pass cleanly post-restructuring (`npm run build`).
- **Acceptance Criteria**: Clean directory layout with identical runtime functionality and zero broken imports.

---

### Milestone 2 — Formalize the Document Engine & Data Model
- **Purpose**: Decouple document definition into two distinct entities: **Template Schemas** (structure, fields, styling) and **Saved Documents** (user data instances).
- **Dependencies**: M1.
- **Status**: `COMPLETE` (100%)
- **Tasks**:
  - [x] Define `TemplateDefinition`, `TemplateSection`, and `TemplateField` schemas.
  - [x] Separate template metadata from user-entered document content.
  - [x] Create translation layers bridging existing `DocumentData` to schema-driven definitions.
  - [x] Ensure schema handles arbitrary *N* sections (e.g. 4 sections for basic resume vs 15 for academic CV).
- **Acceptance Criteria**: Both simple resumes and complex CVs can be declared and rendered through a unified schema model.

---

### Milestone 3 — User Authentication
- **Purpose**: Introduce secure user identity so templates, documents, and profiles belong to authenticated accounts.
- **Dependencies**: M2.
- **Status**: `COMPLETE` (100%)
- **Tasks**:
  - [x] Establish environment configuration (`.env.example`) with `AUTH_SECRET`.
  - [x] Implement Sign Up, Login, Logout, and session persistence.
  - [x] Protect account routes, dashboard endpoints, and user resources.
  - [x] Ensure server-side session checks verify resource ownership.
- **Acceptance Criteria**: Users can register, log in, maintain sessions, and access protected dashboard routes.

---

### Milestone 4 — Database & Persistence Layer
- **Purpose**: Provide permanent cloud persistence for Users, Profiles, Custom Templates, and Saved Documents.
- **Dependencies**: M3.
- **Status**: `IN PROGRESS` (35%)
- **Tasks**:
  - [x] Design relational database schema (`User`, `UserProfile`, `Template`, `SavedDocument`).
  - [x] Implement database client and migration scripts.
  - [x] Establish authenticated saved-document API routes with strict owner filtering.
  - [ ] Add profile and user-owned template CRUD operations.
- **Acceptance Criteria**: Users can store and retrieve documents in a database, with zero cross-tenant data leaks.

---

### Milestone 5 — User Workspace & Dashboard
- **Purpose**: Create a clean post-login dashboard managing saved documents, custom templates, and user profile.
- **Dependencies**: M4.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Build `/dashboard` route with tabbed or card navigation:
    - *My Documents* (open, rename, duplicate, delete, export).
    - *My Templates* (use, edit, duplicate, delete).
    - *Profile* (view & update reusable data).
  - [ ] Display document metadata (name, template used, last modified date, document type).
- **Acceptance Criteria**: Users can manage their portfolio of documents and custom templates from a unified hub.

---

### Milestone 6 — Universal Template Builder
- **Purpose**: Replace hardcoded document builders with ONE universal visual builder that creates custom template schemas.
- **Dependencies**: M2, M5.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Section management: Add, remove, duplicate, rename, and reorder sections.
  - [ ] Field management: Add, edit, remove fields (text, textarea, date, list, select).
  - [ ] Field constraints: Required/optional flags, placeholders, profile mapping keys.
  - [ ] Live visual template preview updating font, sizing, margins, and spacing in real time.
- **Acceptance Criteria**: Users can construct a custom template from scratch or duplicate a built-in one without touching code.

---

### Milestone 7 — Template → Saved Document Instantiation
- **Purpose**: Enable users to instantiate a clean `SavedDocument` from any built-in or custom template.
- **Dependencies**: M6.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Implement "Use Template" action creating an isolated document record.
  - [ ] Render the builder form strictly driven by the template's schema fields.
  - [ ] Guarantee template edits do not destructively overwrite active document content.
- **Acceptance Criteria**: Clicking "Use Template" produces an editable document adhering exactly to the template schema.

---

### Milestone 8 — User Profile & Smart Autofill Suggestions
- **Purpose**: Store reusable career data and suggest automatic population without clobbering existing inputs.
- **Dependencies**: M5, M7.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Build User Profile editor (contact info, headline, education, past roles).
  - [ ] Map template fields to profile attributes (`profile.email`, `profile.github`).
  - [ ] Present non-destructive suggestions ("Fill suggested fields", "Dismiss").
- **Acceptance Criteria**: Users can fill standard fields with 1 click without ever overwriting custom edits silently.

---

### Milestone 9 — Database-Backed Document Autosave
- **Purpose**: Seamless background autosave to the database with local fallback for network interruptions.
- **Dependencies**: M4, M7.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Replace or augment `localStorage` debounce with server persistence.
  - [ ] Display real-time save state indicators ("Saving...", "Saved", "Offline draft", "Save failed").
  - [ ] Provide offline recovery using cached local drafts.
- **Acceptance Criteria**: Keystrokes save reliably to the cloud with debouncing; network dropouts do not lose user data.

---

### Milestone 10 — True 1:1 Export Parity
- **Purpose**: Achieve near-identical visual formatting across Live Preview, Print PDF, and Native Word DOCX.
- **Dependencies**: M2.
- **Status**: `PARTIAL` (65%)
- **Tasks**:
  - [x] Shared typography tokens (pt for preview/print, hp for Word).
  - [x] Native OOXML paragraphs, bullets, tab stops, and borders.
  - [x] CSS `@media print` rules for clean zero-margin A4 PDF printing.
  - [ ] Multi-column layout normalization in DOCX (Word tables matching preview sidebar).
  - [ ] Spacing and line-height micro-calibration between DOM and OOXML.
- **Acceptance Criteria**: Exported PDF and DOCX documents match the on-screen live preview layout within reasonable format constraints.

---

### Milestone 11 — Template Versioning & Snapshot Safety
- **Purpose**: Ensure modifying a template never unintentionally alters existing finalized documents.
- **Dependencies**: M6, M7.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Implement template snapshotting or immutable version IDs on `SavedDocument`.
  - [ ] Offer optional "Update to latest template version" prompt when opening older documents.
- **Acceptance Criteria**: Old documents render with their original layout even after the parent template has been redesigned.

---

### Milestone 12 — Document Management Quality
- **Purpose**: Add search, sorting, filtering, and bulk operations for documents in the dashboard.
- **Dependencies**: M5, M9.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Document search by name and content keywords.
  - [ ] Sorting (last modified, created date, alphabetical, document type).
  - [ ] Confirmation modals for irreversible deletion.
- **Acceptance Criteria**: Users with dozens of resumes can quickly locate, organize, duplicate, and clean up their files.

---

### Milestone 13 — Template Management Quality
- **Purpose**: Differentiate system templates from user templates and support community/shared layouts.
- **Dependencies**: M5, M6.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Read-only protection on system built-in templates.
  - [ ] "Duplicate to My Templates" workflow for modifying system templates.
  - [ ] Category filtering (Resume, CV, Cover Letter, Academic, Tech).
- **Acceptance Criteria**: Built-in templates are protected from accidental mutation while remaining fully forkable.

---

### Milestone 14 — UX Polish & Accessibility
- **Purpose**: Elevate mobile builder experience, keyboard accessibility, loading skeletons, and motion design.
- **Dependencies**: M12, M13.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Responsive split-screen collapse for mobile devices.
  - [ ] Full WCAG 2.1 AA keyboard navigation across all wizard steps.
  - [ ] Connect [`TutorialScreen`](file:///e:/Github/Documaxxer/components/builder/tutorial-screen.tsx) into user onboarding flow.
  - [ ] Complete [`StatisticsPanel`](file:///e:/Github/Documaxxer/components/builder/statistics-panel.tsx) with completion rate and page estimation.
- **Acceptance Criteria**: Smooth mobile editing, accessible screen-reader experience, and seamless onboarding.

---

### Milestone 15 — Quality Assurance & Production Build
- **Purpose**: Rigorous stress testing, linting, cross-browser verification, and production readiness.
- **Dependencies**: M0–M14.
- **Status**: `NOT STARTED` (0%)
- **Tasks**:
  - [ ] Stress-test edge cases (extreme lengths, multi-page overflow, special characters, unicode).
  - [ ] Zero TypeScript errors (`npm run build`).
  - [ ] Zero ESLint warnings (`npm run lint`).
  - [ ] Performance audit (Lighthouse score > 90 on desktop/mobile).
- **Acceptance Criteria**: Flawless production build ready for deployment with zero regressions.
