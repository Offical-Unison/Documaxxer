# Documaxxer — Template System & Rendering Engine

This document details the template catalog, theme configurations, layout models, block generation logic, and pagination algorithms that power document rendering in Documaxxer.

---

## 1. The Built-in Template Registry

All templates are declared in [`lib/templates/templates.ts`](file:///e:/Github/Documaxxer/lib/templates/templates.ts) under the `RESUME_TEMPLATES` registry.

| Template ID | Name | Type | Layout Style | Default Font Style | Header Alignment | Target Audience |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ats-classic` | **ATS Classic** | Resume | Single Column | Serif (`Georgia`) | Center | Traditional corporate, finance, and ATS scanners. |
| `modern-tech` | **Modern Tech** | Resume | Single Column | Sans-serif (`Segoe UI`) | Left | Software engineering, IT, design, and startups. |
| `executive` | **Executive** | Resume | Two-Column Sidebar | Sans-serif (`Segoe UI`) | Left | Senior leadership, executives, and managers. |
| `academic` | **Academic** | CV | Single Column | Serif (`Georgia`) | Center | Higher education faculty, PhD applicants, scholarships. |
| `research` | **Research** | CV | Single Column | Sans-serif (`Segoe UI`) | Left | R&D scientists, laboratory fellows, engineers. |
| `professional` | **Professional** | CV | Single Column | Sans-serif (`Segoe UI`) | Left | Comprehensive career trajectory and consulting. |

The default fallback template is `ats-classic`.

---

## 2. Template Theme Definitions

Defined in [`lib/documents/document-blocks.tsx`](file:///e:/Github/Documaxxer/lib/documents/document-blocks.tsx#L16-L31):

```typescript
export interface TemplateTheme {
  fontStack: string;
  headerAlign: "left" | "center";
}

const FONT_STACK_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_STACK_SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

export const TEMPLATE_THEMES: Record<TemplateId, TemplateTheme> = {
  "ats-classic": { fontStack: FONT_STACK_SERIF, headerAlign: "center" },
  "modern-tech": { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  executive:     { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  academic:      { fontStack: FONT_STACK_SERIF, headerAlign: "center" },
  research:      { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  professional:  { fontStack: FONT_STACK_SANS, headerAlign: "left" },
};
```

---

## 3. Physical Page Geometry & Grid Ratios

All rendering calculations use standardized metric millimeters:
- **Sheet Dimensions**: A4 Standard (210mm × 297mm).
- **Margins**: 25.4mm (1.0 inch) on all sides.
- **Content Area**:
  - Content Width: `210 - (25.4 * 2) = 159.2 mm`
  - Content Height: `297 - (25.4 * 2) = 246.2 mm`
- **Sidebar Grid (Two-Column Templates)**:
  - `SIDEBAR_MAIN_WIDTH_RATIO = 0.65` (Main column occupies 65% of width)
  - `SIDEBAR_RAIL_WIDTH_RATIO = 0.35` (Sidebar rail occupies 35% of width)
  - `SIDEBAR_GAP_MM = 8 mm` (Inter-column gap)

---

## 4. Block Generation Pipeline (`buildTemplateBlocks`)

The [`buildTemplateBlocks`](file:///e:/Github/Documaxxer/lib/documents/document-blocks.tsx#L81) function takes `DocumentData` and a `TemplateId` and produces an object with two block arrays:
```typescript
export interface PreviewBlock {
  id: string;
  type: "header" | "content";
  node: ReactNode;
}

export function buildTemplateBlocks(
  document: DocumentData,
  templateId: TemplateId
): { main: PreviewBlock[]; rail: PreviewBlock[] }
```

### Layout Rules:
1. **Single-Column Templates** (`ats-classic`, `modern-tech`, `academic`, `research`, `professional`):
   - All blocks (Summary, Experience, Education, Skills, Optional Sections) are appended to `main`.
   - `rail` is returned as empty `[]`.
2. **Two-Column Sidebar Template** (`executive`):
   - Core biographical narrative (Summary, Experience, Education, Projects) goes into `main`.
   - Contact info, Skills, Languages, Certifications, and Memberships are routed into the `rail` (sidebar).

---

## 5. Greedy Pagination & Orphan-Header Prevention

Document content can span multiple pages. Rather than letting the browser unpredictably break elements, [`paginateBlocks`](file:///e:/Github/Documaxxer/lib/documents/document-blocks.tsx#L542) calculates exact A4 sheet boundaries using measured pixel heights.

```mermaid
flowchart TD
    Start[Iterate through PreviewBlocks] --> Measure[Check block height against safe page height]
    Measure --> SpaceCheck{Does block fit on current page?}
    SpaceCheck -->|Yes| PushBlock[Push block to current page]
    SpaceCheck -->|No| NewPage[Create new page & reset height tracker]
    PushBlock --> NextBlock{More blocks?}
    NewPage --> PushBlock
    NextBlock -->|Yes| Measure
    NextBlock -->|No| OrphanCheck[Orphan Header Detection Loop]

    OrphanCheck --> TrailingHeader{Does page end with a header block?}
    TrailingHeader -->|Yes| ShiftHeader[Pop header and shift to start of next page]
    ShiftHeader --> RevalidateOverflow[Re-validate cascading page overflows]
    RevalidateOverflow --> TrailingHeader
    TrailingHeader -->|No| Finished[Emit stable DocumentPage array]
```

### Orphan-Header Algorithm:
1. If any page ends with a block of `type: "header"`, the heading would look awkward with no subsequent content beneath it.
2. The algorithm pops the orphan header and prepends it (`unshift`) to the beginning of the next page.
3. If the last page ends with an orphan header, a new page is allocated to receive it.
4. The algorithm performs a cascading pass: shifting headers forward might cause the subsequent page to exceed `safeHeight`. If so, trailing blocks on that page are pushed forward repeatedly until the entire document stabilizes.

---

## 6. Template Selection & Customization UI

Templates can be chosen in two locations:
1. **Catalog Route** (`/templates?type=resume|cv`): Visual card grid with descriptions, badges, and template type filtering before entering the editor.
2. **Preview Toolbar** ([`TemplatePicker`](file:///e:/Github/Documaxxer/components/builder/template-picker.tsx)): Compact selector pinned above the live preview canvas in `/builder`, allowing users to switch templates on the fly without losing entered data.
