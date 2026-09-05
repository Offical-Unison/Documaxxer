# Documaxxer — Architecture Decision Records (ADRs)

This document records the foundational architectural decisions made for Documaxxer, including rationale, tradeoffs, and consequences.

---

## ADR-001: Next.js 15 App Router with React 19 & Tailwind CSS v4
- **Status**: Accepted
- **Context**: Need a modern, scalable web foundation capable of serving static marketing pages, dynamic client-side builder routes, and future server-side authentication and database operations.
- **Decision**: Adopt Next.js 15 with React 19, TypeScript, and Tailwind CSS v4.
- **Consequences**:
  - Leverages React 19 concurrent features and latest hook semantics.
  - Modern Tailwind v4 configuration via `@import "tailwindcss"` and `@source` directives eliminates complex legacy Tailwind config files.

---

## ADR-002: 100% Client-Side Architecture for MVP
- **Status**: Accepted
- **Context**: Philippine college students, fresh grads, and job seekers need immediate access without registration friction. Requiring an account or database on day one creates barrier to entry.
- **Decision**: The entire current MVP operates 100% client-side. Document state is initialized and edited in the browser, persisted via debounced `localStorage`, and exported directly to DOCX and PDF without server calls.
- **Consequences**:
  - Zero hosting costs for database/storage during MVP.
  - Instant user onboarding (no sign-up wall).
  - Subsequent milestones (M3–M9) will introduce cloud authentication and persistence without breaking this frictionless builder.

---

## ADR-003: React Context + useReducer as Single Client Source of Truth
- **Status**: Accepted
- **Context**: The document builder requires high-frequency state updates across 20+ section types and complex nested structures (personal info, experience bullets, education awards). External state stores (Redux, Zustand) introduce unnecessary dependencies.
- **Decision**: Implement [`DocumentProvider`](file:///e:/Github/Documaxxer/context/document-context.tsx) and [`documentReducer`](file:///e:/Github/Documaxxer/context/document-reducer.ts) using native React primitives.
- **Consequences**:
  - Zero additional bundle footprint.
  - Predictable, type-safe action dispatching with 29 discrete actions.
  - Centralized state makes it straightforward to add autosave debounce and mount hydration.

---

## ADR-004: Native OpenXML DOCX Generation via `docx` Library
- **Status**: Accepted
- **Context**: Many document builders export "fake" Word documents (HTML files saved with a `.doc` extension or screenshot images embedded inside Word). Recruiters and ATS scanners reject these files.
- **Decision**: Use the [`docx`](file:///e:/Github/Documaxxer/lib/export/docx-export.ts) package (v9.7.1) to generate genuine OpenXML paragraphs, run styles, tab stops, and bullet structures entirely in the browser.
- **Consequences**:
  - Exported `.docx` files are 100% editable in Microsoft Word, LibreOffice, and Google Docs.
  - Perfect ATS compliance with genuine text streams.
  - Requires unit conversion from CSS pixels and points to OOXML twips and half-points.

---

## ADR-005: Print-Based PDF Generation via `window.print()`
- **Status**: Accepted
- **Context**: Headless browser rendering (Puppeteer) requires server infrastructure and latency. Canvas-based client PDF generators (jsPDF/html2canvas) produce rasterized blurry text and huge file sizes.
- **Decision**: Implement PDF export via native browser print (`window.print()`) combined with CSS `@media print` rules, `@page { size: A4; margin: 0; }`, and a dedicated print portal [`DocumentAllPages`](file:///e:/Github/Documaxxer/components/builder/preview/document-preview.tsx).
- **Consequences**:
  - Instantaneous PDF generation with vector-sharp text and selectable hyperlinks.
  - Zero server cost.
  - Ensures preview pagination exactly matches PDF page splits.

---

## ADR-006: Shared Typography Tokens for Preview, Print, and DOCX
- **Status**: Accepted
- **Context**: If preview CSS, print CSS, and Word exporter define font sizes and margins independently, visual divergence is inevitable.
- **Decision**: Centralize all typographic points (`NAME_PT`, `BODY_PT`, `SECTION_HEADING_PT`), half-points (`NAME_HP`), and spacing ratios in [`lib/documents/document-typography.ts`](file:///e:/Github/Documaxxer/lib/documents/document-typography.ts).
- **Consequences**:
  - Updating a font size token updates the preview, PDF print, and DOCX simultaneously.
  - Enforces the Single Source of Truth invariant across all output targets.

---

## ADR-007: Philippine-Oriented Defaults and Placeholders
- **Status**: Accepted
- **Context**: Documaxxer is tailored for the Philippine market. US defaults (+1 country code, US addresses, ZIP codes) alienate local fresh graduates.
- **Decision**: Default phone country to `"PH"` (`+63`), validate Philippine mobile patterns (`0917 123 4567`), and use Philippine educational contexts (STEM/ABM strands, local universities).
- **Consequences**:
  - Significantly better local user experience and relevance.
  - Placeholders remain examples only and are never saved as actual document data.

---

## ADR-008: Strict Dual Design System (App Chrome vs Document Output)
- **Status**: Accepted
- **Context**: Modern web applications benefit from playful, rich glassmorphic visuals, but job applications demand conservative, black-and-white, ATS-friendly resumes.
- **Decision**: Keep application UI styling (glassmorphism, subtle blur, indigo accents, animations, dark mode) strictly isolated from document canvas rendering (pure black text `#000000`, white paper, no effects).
- **Consequences**:
  - The app feels modern and engaging while the output remains impeccably professional and ATS-compliant.
