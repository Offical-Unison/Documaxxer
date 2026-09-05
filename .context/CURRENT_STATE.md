# Documaxxer — Current Development State

## Status Overview

- **Current Milestone**: **Milestone 4 — Database & Persistence Layer** (Next / In Progress)
- **Previous Milestone**: **Milestone 3 — User Authentication** (Complete)
- **Overall Roadmap Completion**: **~40%** (Client-side builder, schema engine, authentication, and initial database schema complete)
- **Target Active Focus**: Extend authenticated persistence with profile and user-owned template CRUD operations.

---

## 1. Feature Implementation Matrix

### Fully Implemented ✅
- **Resume & CV Builder**: Interactive multi-step wizard covering Personal Information, Experience, Education, Skills, and Additional Sections.
- **6 Built-in Document Templates**:
  - Resumes: `ats-classic`, `modern-tech`, `executive`
  - CVs: `academic`, `research`, `professional`
- **Real-Time Live Preview**: Greedy block pagination (`paginateBlocks`), orphan-header protection, and uniform A4 scaling (`A4Page`) via `ResizeObserver`.
- **Native DOCX Export**: Genuine OOXML Word document generation using `docx` v9.7.1 with true paragraph, tab-stop, and bullet-list styling.
- **PDF Print Export**: Instant A4 print output using `window.print()` and CSS `@media print` rules, suppressing all UI and background chrome.
- **Shared Typography Tokens**: Single source of truth in [`lib/documents/document-typography.ts`](file:///e:/Github/Documaxxer/lib/documents/document-typography.ts) providing pt sizes for preview/print and hp sizes for Word.
- **Font Selection System**: 6 cross-platform fonts (`Arial`, `Calibri`, `Times New Roman`, `Georgia`, `Helvetica`, `Verdana`) with dynamic preview updates.
- **Debounced LocalStorage Autosave**: 500ms debounced persistence keying on `documaxxer:document-state:v1`, with mount hydration.
- **Dynamic Optional Sections**: 15+ specialized section types (Projects, Certifications, Awards, Languages, Volunteer, Publications, Presentations, Research, Teaching, Grants, Memberships, Organizations, Leadership, References, Custom).
- **Section Reordering**: HTML5 drag-and-drop ordering for dynamic sections.
- **Philippine Defaults**: Default `+63` dialing code, Philippine phone format validation, and Philippine-oriented example placeholders.
- **Dark / Light Theme**: Clean Tailwind v4 theme switching persisted across sessions.
- **Formalized Document Engine & Schema (M2)**: Full schema decoupling with [`TemplateDefinition`](file:///e:/Github/Documaxxer/types/template.ts), `TemplateSection`, `TemplateField`, and [`SavedDocument`](file:///e:/Github/Documaxxer/types/saved-document.ts). Centralized schema registry `TEMPLATE_DEFINITIONS` covering all 6 built-in templates with `getTemplateDefinition()` lookup.

### Partially Implemented ⚠️
- **Export Parity (M10)**: Shared typography tokens align font sizes and margins, but 2-column templates (`executive`, `modern-tech`) render as a single linear flow in DOCX rather than multi-column Word tables.
- **Document Analytics / Statistics**: Word count is calculated across all active sections via [`countResumeWords()`](file:///e:/Github/Documaxxer/lib/documents/statistics.ts), but Completion Rate (%) and Estimated Page Count are not yet implemented.
- **Interactive Tutorial**: [`TutorialScreen`](file:///e:/Github/Documaxxer/components/builder/tutorial-screen.tsx) is completely written with a 4-step walkthrough, but is currently **orphaned** (no route or header button triggers it).

### Missing Features ❌
- **Cover Letter Builder**: Disabled with a "Coming Soon" badge in [`hero.tsx`](file:///e:/Github/Documaxxer/components/landing/hero.tsx).
- **M3: Authentication**: No user sign-up, sign-in, session cookies, or JWT handling.
- **M4: Database Persistence**: No cloud database (PostgreSQL/Prisma/Drizzle/Supabase) schema or API routes.
- **M5: User Dashboard**: No logged-in workspace to view, duplicate, rename, or organize multiple saved documents.
- **M6: Universal Template Builder**: No GUI to create, customize, or modify custom template schemas.
- **M7: Template → Saved Document Flow**: Documents cannot be cloned into isolated instances from customized templates.
- **M8: User Profile & Autofill**: No centralized user profile repository to automatically suggest bio, contact, and work history.
- **M9: Database Autosave**: Autosave only targets local browser storage.
- **M11: Template Versioning**: No safety snapshotting when templates update.

---

## 2. Known Technical Debt & Stubs

1. [`components/builder/statistics-panel.tsx`](file:///e:/Github/Documaxxer/components/builder/statistics-panel.tsx): Contains a placeholder card with `PlaceholderContent`. Needs integration with word count, completion rate calculation, and page count estimates.
2. [`components/builder/tutorial-container.tsx`](file:///e:/Github/Documaxxer/components/builder/tutorial-container.tsx): Contains a placeholder stub.
3. [`components/builder/tutorial-screen.tsx`](file:///e:/Github/Documaxxer/components/builder/tutorial-screen.tsx): Fully functional 4-step wizard that is unreachable because no navigation trigger mounts it.
4. **Package Name Mismatch**: The repository folder and product branding is **Documaxxer**, but [`package.json`](file:///e:/Github/Documaxxer/package.json) defines `"name": "resume-builder"`. This is intentional for current backwards-compatibility but should be kept in mind.

---

## 3. Immediate Next Task

**Commence Milestone 3 — User Authentication:**
1. Establish environment configuration (`.env.example`) with `AUTH_SECRET` and authentication credentials.
2. Implement auth provider and session handling (Sign Up, Login, Logout, Session Cookies).
3. Protect private routes, user dashboard, and prepare user ID association for `SavedDocument.ownerId`.
