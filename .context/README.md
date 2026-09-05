# Documaxxer Context & Knowledge Base

Welcome to the **Documaxxer** developer and AI documentation repository. This directory (`.context/`) contains the authoritative technical knowledge base, system architecture, data models, development milestones, and rules for the Documaxxer project.

---

## ⚠️ Mandatory Development Protocol

Before proposing or making any architectural modifications, refactorings, or adding features:

1. **Do NOT start coding immediately.**
2. Follow the strictly designated **Reading Order**:
   1. [`PROJECT.md`](file:///e:/Github/Documaxxer/.context/PROJECT.md) — Product concept, tech stack, target audience, and positioning.
   2. [`CURRENT_STATE.md`](file:///e:/Github/Documaxxer/.context/CURRENT_STATE.md) — What is implemented, what is partial, what is missing, and immediate next steps.
   3. [`MILESTONES.md`](file:///e:/Github/Documaxxer/.context/MILESTONES.md) — Full roadmap (M0–M15), dependency chains, and completion criteria.
   4. [`ARCHITECTURE.md`](file:///e:/Github/Documaxxer/.context/ARCHITECTURE.md) — System data flow, rendering pipeline, and state management.
   5. **Relevant Feature Context** — Consult [`DOCUMENT_MODEL.md`](file:///e:/Github/Documaxxer/.context/DOCUMENT_MODEL.md), [`TEMPLATE_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/TEMPLATE_SYSTEM.md), [`EXPORT_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/EXPORT_SYSTEM.md), [`TYPOGRAPHY.md`](file:///e:/Github/Documaxxer/.context/TYPOGRAPHY.md), or [`DESIGN_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/DESIGN_SYSTEM.md) as applicable.
   6. **Existing Source Code** — Inspect the current codebase to verify implementation status.

> [!IMPORTANT]
> **Source Code is the Final Authority:**
> Context files are prescriptive guidance and design documentation, but the actual source code is the ultimate truth when documentation and implementation disagree. If you find a discrepancy, update the context files to match code reality (or fix unintentional bugs).

> [!WARNING]
> **Self-Correcting Milestone Rule:**
> Never skip forward if an earlier milestone has unfinished foundational work. If documentation claims Milestone N is active, but code inspection shows Milestone N-1 has materially incomplete features, you must return to Milestone N-1, update `.context/CURRENT_STATE.md` and `.context/MILESTONES.md`, complete the missing functionality, and verify it before proceeding.

---

## Core Development Philosophy

Every developer and AI agent working on Documaxxer must adhere to these non-negotiable principles:

1. **Preserve Working Features:** Existing functionality (resume/CV editing, live preview, 6 templates, DOCX export, PDF printing, font picker, autosave) must never be broken or regressed.
2. **No Duplicate Systems:** Never create redundant components, hooks, stores, or exporters. Always search the codebase before creating new files.
3. **Single Source of Truth:** Shared styling, typography tokens, and layout schemas must drive form validation, live preview, PDF print, and DOCX generation simultaneously.
4. **Incremental Migration:** Evolve code incrementally with minimal churn. Do not rewrite functioning modules from scratch.

---

## Context File Directory Map

| File | Purpose |
| :--- | :--- |
| [`README.md`](file:///e:/Github/Documaxxer/.context/README.md) | This file: onboarding instructions, reading order, and rules. |
| [`PROJECT.md`](file:///e:/Github/Documaxxer/.context/PROJECT.md) | Project vision, branding, Philippine focus, and tech stack. |
| [`ARCHITECTURE.md`](file:///e:/Github/Documaxxer/.context/ARCHITECTURE.md) | System components, data flow, rendering engine, and state. |
| [`FILE_STRUCTURE.md`](file:///e:/Github/Documaxxer/.context/FILE_STRUCTURE.md) | Comprehensive directory tree and module responsibilities. |
| [`CURRENT_STATE.md`](file:///e:/Github/Documaxxer/.context/CURRENT_STATE.md) | Current active milestone, completion %, known debt, and next task. |
| [`MILESTONES.md`](file:///e:/Github/Documaxxer/.context/MILESTONES.md) | Authoritative roadmap M0 through M15 with acceptance criteria. |
| [`DOCUMENT_MODEL.md`](file:///e:/Github/Documaxxer/.context/DOCUMENT_MODEL.md) | Types, schema interfaces, and all 29 reducer action types. |
| [`TEMPLATE_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/TEMPLATE_SYSTEM.md) | Built-in templates, theme definitions, and block pagination. |
| [`EXPORT_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/EXPORT_SYSTEM.md) | DOCX (native OOXML) and PDF (print-based) export pipelines. |
| [`TYPOGRAPHY.md`](file:///e:/Github/Documaxxer/.context/TYPOGRAPHY.md) | Shared typography tokens (pt vs hp) and font family system. |
| [`DESIGN_SYSTEM.md`](file:///e:/Github/Documaxxer/.context/DESIGN_SYSTEM.md) | Dual UI design: Glassmorphic App UI vs ATS-friendly Document. |
| [`DEVELOPMENT_RULES.md`](file:///e:/Github/Documaxxer/.context/DEVELOPMENT_RULES.md) | Architectural invariants, security rules, and coding standards. |
| [`DECISIONS.md`](file:///e:/Github/Documaxxer/.context/DECISIONS.md) | Architecture Decision Records (ADRs) explaining key choices. |
| [`CHANGELOG.md`](file:///e:/Github/Documaxxer/.context/CHANGELOG.md) | Chronological log of changes across milestones. |
