# Documaxxer Milestone Roadmap

This roadmap defines Documaxxer as a visual document-template editor. A template is a reusable page design. A document is an instance created from that design and filled with content.

## Product Model

- **Template**: reusable visual design containing pages, sections, content blocks, styles, and layout rules.
- **Document**: editable instance of a template with its own content and layout overrides.
- **Content block**: movable element such as text, heading, image, logo, table, divider, shape, signature, or spacer.
- **Document type**: a category such as resume, CV, cover letter, business letter, invoice, proposal, report, or other custom document.
- **Template version**: an immutable design revision used to protect existing documents from later template edits.

## Roadmap Summary

| Milestone | Title | Status | Completion | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **M0** | Project Audit & Current-Milestone Detection | **COMPLETE** | 100% | None |
| **M1** | Project Structure Cleanup | **COMPLETE** | 100% | M0 |
| **M2** | Document Engine & Visual Data Model | **IN PROGRESS** | 90% | M1 |
| **M3** | User Authentication | **COMPLETE** | 100% | M2 |
| **M4** | Database & Persistence Layer | **COMPLETE** | 100% | M3 |
| **M5** | User Workspace & Dashboard | **PARTIAL** | 70% | M4 |
| **M6** | Visual Template Editor | **IN PROGRESS** | 60% | M2, M5 |
| **M7** | Template to Document Creation | **NOT STARTED** | 0% | M6 |
| **M8** | Profile Data & Smart Content | **NOT STARTED** | 0% | M5, M7 |
| **M9** | Database-Backed Document Autosave | **NOT STARTED** | 0% | M4, M7 |
| **M10** | Visual Preview, PDF & DOCX Parity | **PARTIAL** | 40% | M2, M6 |
| **M11** | Template Versioning & Snapshot Safety | **NOT STARTED** | 0% | M6, M7 |
| **M12** | Document Management Quality | **NOT STARTED** | 0% | M5, M9 |
| **M13** | Template Management Quality | **NOT STARTED** | 0% | M5, M6, M11 |
| **M14** | UX, Accessibility & Responsive Canvas | **NOT STARTED** | 0% | M6, M12, M13 |
| **M15** | Production Build & Comprehensive QA | **NOT STARTED** | 0% | M0-M14 |

## Milestone Details

### M0 - Project Audit & Current-Milestone Detection
- **Status**: `COMPLETE` (100%)
- **Purpose**: Establish the actual baseline and identify working features, stubs, and architectural risks.

### M1 - Project Structure Cleanup
- **Status**: `COMPLETE` (100%)
- **Purpose**: Keep the codebase modular and maintainable without regressing existing features.

### M2 - Document Engine & Visual Data Model
- **Status**: `IN PROGRESS` (90%)
- **Purpose**: Replace the resume-only mental model with a general document model that can represent arbitrary document types and visual layouts.
- **Tasks**:
  - [x] Preserve existing document content and export structures during the transition.
  - [x] Define reusable template and saved-document entities.
  - [x] Define pages, page size, margins, coordinates, stacking order, visibility, and lock state.
  - [x] Define typed content blocks: text, heading, image, logo, table, divider, shape, signature, and spacer.
  - [x] Define style tokens for typography, color, borders, fills, alignment, and spacing.
  - [x] Define a serialized visual template and document format.
  - [x] Add dedicated content structures for cover, authorization, and excuse letters.
  - [x] Define grids, snapping, and overflow behavior.
  - [ ] Define renderer adapters for preview, PDF, and DOCX.
- **Acceptance Criteria**: A resume, business letter, invoice, and custom document can be represented without resume-specific fields being required.

### M3 - User Authentication
- **Status**: `COMPLETE` (100%)
- **Purpose**: Provide secure account identity, login, signup, logout, sessions, and protected resources.

### M4 - Database & Persistence Layer
- **Status**: `COMPLETE` (100%)
- **Purpose**: Persist users, profiles, templates, documents, and ownership boundaries in Neon PostgreSQL.
- **Note**: Existing APIs must be migrated from the old resume-schema payload to the visual template/document payload as M2 and M6 land.

### M5 - User Workspace & Dashboard
- **Status**: `PARTIAL` (70%)
- **Purpose**: Provide a workspace for finding and managing templates and document instances.
- **Note**: The dashboard foundation exists, but its labels and actions must be updated to reflect visual templates rather than resume templates.

### M6 - Visual Template Editor
- **Status**: `IN PROGRESS` (60%)
- **Purpose**: Build a graphics-editor-like canvas where users design reusable document templates.
- **Tasks**:
  - [x] Create a page canvas with A4, Letter, and custom page-size foundation.
  - [x] Add, select, resize by coordinates, lock, hide, and delete blocks.
  - [x] Support direct drag movement and snapping.
  - [x] Support page tabs and adding multiple pages.
  - [x] Support visibility, locking, z-order editing, and block duplication.
  - [ ] Support guides, alignment, distribute, layers panel, grouping, and resize handles.
  - [x] Add block types for text, headings, images, logos, tables, dividers, shapes, signatures, and spacers.
  - [x] Provide a properties panel for position, size, typography, colors, and content.
  - [x] Support multiple pages and page-level layout settings.
  - [x] Save reusable visual templates independently from documents.
  - [ ] Allow blank templates and duplication of existing templates.
- **Acceptance Criteria**: A user can create a multi-page visual design and place elements precisely without editing code or being restricted to resume fields.

### M7 - Template to Document Creation
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Create editable document instances from any visual template.
- **Tasks**:
  - [ ] Add a "Use template" action for built-in and user-owned templates.
  - [ ] Copy the template into an immutable document starting point.
  - [ ] Keep document content and layout edits isolated from the source template.
  - [ ] Allow users to edit block content while preserving the template's design.
  - [ ] Support general document types including letters, business documents, invoices, proposals, and reports.
- **Acceptance Criteria**: Editing a document never changes the source template, and creating a document does not require resume-specific data.

### M8 - Profile Data & Smart Content
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Offer reusable user data without making profiles mandatory for general documents.
- **Tasks**:
  - [ ] Store reusable identity, company, contact, address, and signature data.
  - [ ] Map template fields or blocks to profile values.
  - [ ] Provide non-destructive suggestions and explicit fill actions.
  - [ ] Support multiple profiles such as personal, freelance, and company identities.
- **Acceptance Criteria**: Suggested data never silently overwrites a user's custom content.

### M9 - Database-Backed Document Autosave
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Save visual document changes reliably to Neon PostgreSQL.
- **Tasks**:
  - [ ] Debounce document and layout changes to the server.
  - [ ] Show saving, saved, offline, and failed states.
  - [ ] Recover local drafts after network interruptions.
- **Acceptance Criteria**: Layout and content changes survive refresh and temporary network loss.

### M10 - Visual Preview, PDF & DOCX Parity
- **Status**: `PARTIAL` (40%)
- **Purpose**: Render the same visual document model consistently in the editor, preview, PDF, and editable DOCX.
- **Tasks**:
  - [x] Keep existing PDF print and native DOCX export paths.
  - [ ] Render arbitrary positioned blocks and multi-page layouts in preview.
  - [ ] Export visual blocks to PDF with matching page sizes and coordinates.
  - [ ] Export editable DOCX structures where the format supports the design.
  - [ ] Clearly document format limitations where DOCX cannot exactly reproduce canvas behavior.
- **Acceptance Criteria**: Exported output matches the designed pages as closely as each target format permits.

### M11 - Template Versioning & Snapshot Safety
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Ensure template edits never unexpectedly change existing documents.
- **Tasks**:
  - [ ] Store immutable template versions.
  - [ ] Snapshot the exact version used by each document.
  - [ ] Offer an explicit update-to-new-version workflow.
- **Acceptance Criteria**: Existing documents retain their original design after a template is edited.

### M12 - Document Management Quality
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Make a large document library easy to search, sort, filter, duplicate, archive, and delete.
- **Tasks**:
  - [ ] Search by document name, type, and content.
  - [ ] Sort and filter by dates, type, template, and status.
  - [ ] Add archive, duplicate, export, and deletion confirmation flows.
- **Acceptance Criteria**: Users can manage dozens of documents without losing track of versions or types.

### M13 - Template Management Quality
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Manage built-in, private, shared, and user-created visual templates.
- **Tasks**:
  - [ ] Protect built-in templates from direct mutation.
  - [ ] Duplicate any template into an owned editable copy.
  - [ ] Add categories for resumes, letters, business, finance, academic, and custom documents.
  - [ ] Add template preview thumbnails and version history.
- **Acceptance Criteria**: Templates are reusable design assets, not accidental containers for one document's content.

### M14 - UX, Accessibility & Responsive Canvas
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Make the visual editor usable with keyboard, mouse, touch, and assistive technology.
- **Tasks**:
  - [ ] Add keyboard movement, shortcuts, focus management, and undo/redo.
  - [ ] Make canvas controls usable on smaller screens.
  - [ ] Add accessible labels and non-canvas editing alternatives.
  - [ ] Add onboarding for the visual editing workflow.
- **Acceptance Criteria**: Users can create and edit templates reliably across desktop and mobile layouts.

### M15 - Production Build & Comprehensive QA
- **Status**: `NOT STARTED` (0%)
- **Purpose**: Verify the visual editor and all document types for production release.
- **Tasks**:
  - [ ] Test long text, overflow, multiple pages, images, tables, special characters, and Unicode.
  - [ ] Test template/document isolation and ownership boundaries.
  - [ ] Run lint, type checks, production build, and browser QA.
  - [ ] Measure editor and export performance.
- **Acceptance Criteria**: The application is production-ready for general-purpose document template creation.
