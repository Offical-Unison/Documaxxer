# Documaxxer — Typography System & Font Tokens

This document details the shared typography system, font registries, unit scaling (points vs half-points), and CSS style objects defined in [`lib/documents/document-typography.ts`](file:///e:/Github/Documaxxer/lib/documents/document-typography.ts) and [`lib/fonts.ts`](file:///e:/Github/Documaxxer/lib/fonts.ts).

---

## 1. Shared Typography Tokens

Documaxxer uses a single source of truth for document typography to eliminate inconsistencies between on-screen preview, print rendering, and native Word export.

### Typographic Point Sizes & DOCX Half-Points

| Token Name | Point Size (pt) | DOCX Half-Points (hp = pt × 2) | Typical Role | Font Weight |
| :--- | :--- | :--- | :--- | :--- |
| `NAME` | 22 pt | 44 hp | Candidate's Full Name | 700 (Bold) |
| `SECTION_HEADING` | 11 pt | 22 hp | Section Titles (e.g. "EDUCATION") | 700 (Bold, Uppercase) |
| `ENTRY_TITLE` | 10 pt | 20 hp | Job Titles, Degree Names | 700 (Bold) |
| `ENTRY_SUBTITLE` | 10 pt | 20 hp | Company Name, University Name | 700 (Bold) |
| `BODY` | 10 pt | 20 hp | Bullet items, Summary paragraphs | 400 (Regular) |
| `CONTACT` | 10 pt | 20 hp | Email, Phone, Location | 400 (Regular) |
| `DATE` | 10 pt | 20 hp | Employment / Education Dates | 400 (Regular) |
| `HEADLINE` | 10 pt | 20 hp | Professional Headline / Sub-header | 500 (Medium) |

---

## 2. Shared CSS Style Objects

The style objects exported by [`document-typography.ts`](file:///e:/Github/Documaxxer/lib/documents/document-typography.ts) enforce uniform line height, letter spacing, and word wrapping:

```typescript
export const TEXT_COLOR = "#000"; // Pure high-contrast black for ATS and print

export const nameStyle: React.CSSProperties = {
  fontSize: `${NAME_PT}pt`,
  fontWeight: 700,
  color: TEXT_COLOR,
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const sectionHeadingStyle: React.CSSProperties = {
  fontSize: `${SECTION_HEADING_PT}pt`,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: TEXT_COLOR,
  borderBottom: "1px solid #000",
  paddingBottom: "4px",
  marginTop: "14px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const entryTitleStyle: React.CSSProperties = {
  fontSize: `${ENTRY_TITLE_PT}pt`,
  fontWeight: 700,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const entrySubtitleStyle: React.CSSProperties = {
  fontSize: `${BODY_PT}pt`,
  fontWeight: 700,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const bodyStyle: React.CSSProperties = {
  fontSize: `${BODY_PT}pt`,
  fontWeight: 400,
  color: TEXT_COLOR,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const dateStyle: React.CSSProperties = {
  fontSize: `${DATE_PT}pt`,
  fontWeight: 400,
  color: TEXT_COLOR,
  flexShrink: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const contactStyle: React.CSSProperties = {
  fontSize: `${CONTACT_PT}pt`,
  fontWeight: 400,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const headlineStyle: React.CSSProperties = {
  fontSize: `${BODY_PT}pt`,
  fontWeight: 500,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const linkStyle: React.CSSProperties = {
  fontSize: `${CONTACT_PT}pt`,
  color: TEXT_COLOR,
  textDecoration: "underline",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};
```

---

## 3. Font System Registry

Defined in [`lib/fonts.ts`](file:///e:/Github/Documaxxer/lib/fonts.ts):

```typescript
export interface ResumeFont {
  id: string;
  name: string;
  stack: string;
}

export const RESUME_FONTS: ResumeFont[] = [
  { id: "arial", name: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "calibri", name: "Calibri", stack: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif" },
  { id: "times", name: "Times New Roman", stack: "'Times New Roman', Times, serif" },
  { id: "georgia", name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { id: "helvetica", name: "Helvetica", stack: "Helvetica, Arial, sans-serif" },
  { id: "verdana", name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
];

export const DEFAULT_FONT_ID = "calibri";
```

### Font Resolution Pipeline
1. **Preview & Print View**:
   - Consumes the full fallback `stack` string (e.g. `Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif`) to ensure graceful degradation across operating systems (Windows, macOS, Linux, iOS, Android).
2. **Native Word DOCX**:
   - Extracts the primary family name using `resolvedFont.name` (e.g. `"Calibri"`). Microsoft Word and Google Docs match local system font definitions using this exact string.

---

## 4. Cross-Platform Font & ATS Considerations

- **ATS Readability**: All 6 included fonts are standard, highly legible system typefaces recommended by hiring platforms and Applicant Tracking Systems. Exotic Google web fonts (e.g. decorative display typefaces) are intentionally excluded from document bodies to prevent ATS parsing errors.
- **Font Availability**: Standard fonts like *Arial*, *Times New Roman*, and *Calibri* exist across >98% of target desktop devices. If a client device lacks a specific typeface, Word and the browser fall back to the generic serif or sans-serif families specified in the stack.
