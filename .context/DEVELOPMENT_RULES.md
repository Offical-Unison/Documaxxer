# Documaxxer — Development Invariants & Engineering Rules

This document outlines the mandatory engineering rules, architectural constraints, and development invariants for the Documaxxer codebase. Every developer and AI agent must adhere strictly to these principles.

---

## 1. Non-Negotiable Invariants

### Rule 1: Do Not Start Coding Immediately
Before creating or modifying any implementation code:
1. Inspect the entire repository.
2. Read the `.context/` knowledge base in specified order ([`README.md`](file:///e:/Github/Documaxxer/.context/README.md) → [`PROJECT.md`](file:///e:/Github/Documaxxer/.context/PROJECT.md) → [`CURRENT_STATE.md`](file:///e:/Github/Documaxxer/.context/CURRENT_STATE.md) → [`MILESTONES.md`](file:///e:/Github/Documaxxer/.context/MILESTONES.md) → [`ARCHITECTURE.md`](file:///e:/Github/Documaxxer/.context/ARCHITECTURE.md)).
3. Inspect relevant source files to verify actual implementation status.
4. Never assume something is missing merely because a task mentions it. Code is the primary evidence.

### Rule 2: Preserve Working Features
Existing functionality must continue working. Never regress or break:
- Resume & CV multi-step builder forms.
- The 6 built-in templates.
- Real-time preview with greedy pagination and orphan-header protection.
- Font picker and typography customization.
- Dynamic section additions and HTML5 drag-and-drop reordering.
- 500ms debounced `localStorage` autosave.
- Native editable DOCX export via `docx`.
- Print-based PDF export via `window.print()`.

### Rule 3: Zero Duplicate Systems
Never create duplicate abstractions:
- Before creating a component, hook, context, exporter, utility, or schema type, **search the repository first**.
- Reuse or extend existing implementations whenever reasonable.
- If an existing module needs improvement, refactor it in-place rather than creating a parallel duplicate.

### Rule 4: Single Source of Truth
Avoid situations where the live preview, PDF print engine, and DOCX exporter independently define layout, fonts, or colors:
- The same typography tokens in [`lib/documents/document-typography.ts`](file:///e:/Github/Documaxxer/lib/documents/document-typography.ts) drive the preview, print styles, and DOCX sizes.
- The same layout block generator in [`lib/documents/document-blocks.tsx`](file:///e:/Github/Documaxxer/lib/documents/document-blocks.tsx) drives both the interactive single-page view and the multi-page print portal.

### Rule 5: Self-Correcting Milestone Protocol
- Always verify what milestone the code is actually in.
- If documentation says Milestone *N* is active, but code inspection reveals Milestone *N-1* has incomplete functionality, **halt progress on Milestone *N***.
- Update `.context/CURRENT_STATE.md` and `.context/MILESTONES.md`, complete the missing foundation in Milestone *N-1*, verify it, and only then proceed.

---

## 2. Engineering Standards & Code Hygiene

### Token Efficiency & Minimal Code Churn
- Perform surgical, focused modifications rather than wholesale file rewrites.
- Preserve existing comments, docstrings, and type definitions unless directly refactoring that functionality.
- Keep dependency additions to an absolute minimum.

### Client-Side MVP Focus
- The current MVP is intentionally 100% client-side.
- Do NOT introduce external state management libraries (Redux, Zustand, MobX).
- Do NOT introduce backend, database, or authentication dependencies until the specific milestone calls for them.

### Data Ownership & Authorization (Future Milestones M3–M9)
- Resource authorization must occur server-side.
- Never rely solely on client-side route guards, hidden form fields, or client-provided `userId` parameters to determine document access.
- Every custom template and saved document must carry verified ownership metadata.

### Truth in Documentation
- Document reality, not aspirations.
- If a feature is a stub, document it as a stub (e.g. `statistics-panel.tsx`, `tutorial-container.tsx`).
- If an action is orphaned or a document type is disabled, state it explicitly (e.g. `tutorial-screen.tsx`, Cover Letter "Coming Soon").
- Source code remains the final authority if documentation and implementation disagree.
