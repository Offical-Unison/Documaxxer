import {
  AlignmentType, BorderStyle, convertMillimetersToTwip, Document, ExternalHyperlink, LineRuleType, Packer, Paragraph,
  ShadingType, Table, TableBorders, TableCell, TableLayoutType, TableRow, TabStopType, TextRun, VerticalAlign, WidthType,
  type ParagraphChild,
} from "docx";
import { formatDateRange, formatPartialDate } from "@/lib/format";
import { getFont } from "@/lib/fonts";
import type { DocumentData } from "@/types/document";
import {
  NAME_HP, SECTION_HEADING_HP, ENTRY_TITLE_HP, BODY_HP, CONTACT_HP, DATE_HP, BODY_PT,
  LETTER_BODY_HP, LETTER_LINE_HEIGHT, LETTER_NAME_HP,
} from "@/lib/documents/document-typography";
import {
  CONTENT_WIDTH_MM, MARGIN_MM, PAGE_HEIGHT_MM, PAGE_WIDTH_MM, SIDEBAR_GAP_MM, SIDEBAR_RAIL_WIDTH_RATIO,
} from "@/lib/documents/document-blocks";
import {
  buildLetterContent, getContactLine, getExportBaseName, getLetterSignOff, getResumeLayout, isLetterType, normalizeUrl,
  selectVisibleEntries, type LayoutSectionKey,
} from "@/lib/documents/document-layout";
import { normalizeDocumentData } from "@/context/document-reducer";
import { downloadBlob } from "@/lib/export/download";

// All text is black — no accent colors
const BLACK = "000000";
/** Sidebar fill matching the preview's `bg-blue-50/60` rail. */
const RAIL_FILL = "F3F7FE";

/**
 * Convert preview CSS spacing to DOCX twips.
 * The preview uses px values rendered at 96dpi in the browser.
 * 1 inch = 96 CSS-px = 1440 twips → 1 CSS-px = 15 twips.
 */
const PX_TO_TWIP = 15;
const PT_TO_TWIP = 20;

/* ── Spacing constants matching preview CSS ───────────────────── */
// sectionHeadingStyle: marginTop: 14px, paddingBottom: 4px
const SECTION_HEADING_BEFORE = 14 * PX_TO_TWIP; // 210 twips
const SECTION_HEADING_AFTER = 4 * PX_TO_TWIP;   // 60 twips
// sectionContent wrapper: marginTop: 8px
const ENTRY_BEFORE = 8 * PX_TO_TWIP;  // 120 twips
// bodyStyle lineHeight: 1.5 → 150% of single spacing. Single spacing = 240 twips.
const BODY_LINE_SPACING = Math.round(BODY_PT * 20 * 1.5); // pt × 20 = twips-per-line, × 1.5
// Bullet/plain line: marginBottom: 2px
const BULLET_AFTER = 2 * PX_TO_TWIP;  // 30 twips
// Highlight lists sit in a wrapper with marginTop: 4px; detail lines (org, authors, location) use marginTop: 2px.
const LIST_BEFORE = 4 * PX_TO_TWIP;   // 60 twips
const DETAIL_BEFORE = 2 * PX_TO_TWIP; // 30 twips

/**
 * The preview inherits CSS `line-height: 1.5` (Tailwind preflight), so every
 * line box is 1.5 × its font size. Word's "single" / "1.5 lines" are multiples
 * of the font's own line gap instead, so heights are set explicitly in points.
 */
const lineHeight = (fontPt: number, factor = 1.5) => ({ line: Math.round(fontPt * factor * PT_TO_TWIP), lineRule: LineRuleType.AT_LEAST });
// Preview list: ul padding-left 16px + li padding-left 2px → text starts 18px from the margin.
const BULLET_INDENT = { left: 18 * PX_TO_TWIP, hanging: 12 * PX_TO_TWIP };

const CONTENT_WIDTH_TWIP = convertMillimetersToTwip(CONTENT_WIDTH_MM);
const SIDEBAR_GAP_TWIP = convertMillimetersToTwip(SIDEBAR_GAP_MM);
const RAIL_PADDING_TWIP = 12 * PX_TO_TWIP;

export interface DocxExportInput {
  document: DocumentData;
  documentType: string;
  templateId?: string | null;
  fontId?: string | null;
}

/* ── Shared run helpers ───────────────────────────────────────── */

interface RunStyle { size: number; font: string; bold?: boolean }

/** Splits on "\n" into runs separated by real line breaks (Word ignores raw newlines). */
function textRuns(text: string, style: RunStyle): TextRun[] {
  return text.split("\n").map((line, index) => new TextRun({
    text: line, bold: style.bold, size: style.size, font: style.font, color: BLACK, break: index > 0 ? 1 : undefined,
  }));
}

function hyperlink(text: string, url: string, style: RunStyle): ExternalHyperlink {
  return new ExternalHyperlink({
    link: normalizeUrl(url),
    children: [new TextRun({ text, size: style.size, font: style.font, color: BLACK, underline: {} })],
  });
}

/* ── Resume / CV ──────────────────────────────────────────────── */

class ResumeWriter {
  /**
   * @param stacked Narrow sidebar columns: the preview's flex row wraps there, so the
   *                date and grade sit on their own lines instead of being right-aligned.
   */
  constructor(private readonly font: string, private readonly rightTab: number, private readonly stacked = false) {}

  /** Sidebar blocks each carry an extra 12px top margin in the preview (`mt-3`). */
  private get blockGap() {
    return this.stacked ? 12 * PX_TO_TWIP : 0;
  }

  heading(text: string): Paragraph {
    return new Paragraph({
      spacing: { before: SECTION_HEADING_BEFORE + this.blockGap, after: SECTION_HEADING_AFTER, ...lineHeight(SECTION_HEADING_HP / 2) },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK, space: 3 } },
      keepNext: true,
      children: [new TextRun({ text: text.toUpperCase(), bold: true, color: BLACK, size: SECTION_HEADING_HP, font: this.font })],
    });
  }

  /** Bold title on the left, date right-aligned on the same line (preview: flex space-between). */
  entry(primary: ParagraphChild[] | string, secondary: string, dateRange: string, rightSecondary?: string): Paragraph[] {
    const tabStops = [{ type: TabStopType.RIGHT, position: this.rightTab }];
    const spacing = lineHeight(ENTRY_TITLE_HP / 2);
    const run = (text: string, bold = false) => new TextRun({ text, bold, size: BODY_HP, color: BLACK, font: this.font });
    const first: ParagraphChild[] = typeof primary === "string"
      ? [new TextRun({ text: primary, bold: true, size: ENTRY_TITLE_HP, color: BLACK, font: this.font })]
      : [...primary];

    if (this.stacked) {
      const lines = [new Paragraph({ keepNext: true, keepLines: true, spacing: { before: ENTRY_BEFORE + this.blockGap, ...spacing }, children: first })];
      if (secondary) lines.push(new Paragraph({ keepNext: true, spacing, children: [run(secondary, true)] }));
      if (dateRange) lines.push(new Paragraph({ keepNext: true, spacing, children: [new TextRun({ text: dateRange, size: DATE_HP, color: BLACK, font: this.font })] }));
      if (rightSecondary) lines.push(new Paragraph({ spacing, children: [run(rightSecondary)] }));
      return lines;
    }

    if (dateRange) first.push(new TextRun({ text: `\t${dateRange}`, size: DATE_HP, color: BLACK, font: this.font }));
    const paragraphs = [new Paragraph({ tabStops, keepNext: true, keepLines: true, spacing: { before: ENTRY_BEFORE, ...spacing }, children: first })];
    if (secondary || rightSecondary) {
      const runs: TextRun[] = [];
      if (secondary) runs.push(run(secondary, true));
      if (rightSecondary) runs.push(run(`\t${rightSecondary}`));
      paragraphs.push(new Paragraph({ tabStops, keepLines: true, spacing, children: runs }));
    }
    return paragraphs;
  }

  line(text: string | ParagraphChild[], options: { bullet?: boolean; before?: number; bold?: boolean } = {}): Paragraph {
    return new Paragraph({
      bullet: options.bullet ? { level: 0 } : undefined,
      indent: options.bullet ? BULLET_INDENT : undefined,
      // A line that opens a content block (before = ENTRY_BEFORE) also gets the sidebar block gap.
      spacing: { before: options.before === ENTRY_BEFORE ? ENTRY_BEFORE + this.blockGap : options.before, after: BULLET_AFTER, line: BODY_LINE_SPACING, lineRule: LineRuleType.AT_LEAST },
      children: typeof text === "string" ? textRuns(text, { size: BODY_HP, font: this.font, bold: options.bold }) : text,
    });
  }

  lines(items: string[]): Paragraph[] {
    return items.filter((line) => line.trim()).map((line, index) => this.line(line, { before: index === 0 ? LIST_BEFORE : undefined }));
  }
}

function buildResumeSections(document: DocumentData, keys: LayoutSectionKey[], writer: ResumeWriter, font: string): Paragraph[] {
  const visible = selectVisibleEntries(document);
  const titles = document.sectionTitles;
  const out: Paragraph[] = [];

  const builders: Record<LayoutSectionKey, () => void> = {
    summary: () => {
      if (!document.professionalSummary.trim()) return;
      out.push(writer.heading(titles.summary), writer.line(document.professionalSummary, { before: ENTRY_BEFORE }));
    },
    experience: () => {
      if (!visible.experiences.length) return;
      out.push(writer.heading(titles.experience));
      visible.experiences.forEach((item) => {
        out.push(...writer.entry(item.role || "—", [item.employer, item.location].filter(Boolean).join(", "), formatDateRange(item.startDate, item.endDate, item.current)));
        item.highlights.filter((line) => line.trim()).forEach((line, index) => out.push(writer.line(line, { bullet: true, before: index === 0 ? LIST_BEFORE : undefined })));
      });
    },
    education: () => {
      if (!visible.education.length) return;
      out.push(writer.heading(titles.education));
      visible.education.forEach((item) => {
        const grade = item.gradeLabel?.trim() && item.gradeValue?.trim() ? `${item.gradeLabel.trim()}: ${item.gradeValue.trim()}` : undefined;
        out.push(...writer.entry(item.institution, [item.degree, item.fieldOfStudy].filter(Boolean).join(", "), formatDateRange(item.startDate, item.endDate, item.current), grade));
        const awards = item.awards.filter((award) => award.name.trim()).map((award) => award.name).join(" • ");
        if (awards) out.push(writer.line(awards, { before: 4 * PX_TO_TWIP }));
      });
    },
    skills: () => {
      if (!visible.skills.length) return;
      out.push(writer.heading(titles.skills), writer.line(visible.skills.join(" • "), { before: ENTRY_BEFORE }));
    },
    projects: () => {
      if (!visible.projects.length) return;
      out.push(writer.heading(titles.projects));
      visible.projects.forEach((item) => {
        const tech = item.technologies.filter(Boolean).join(", ");
        const primary: ParagraphChild[] = [new TextRun({ text: item.name, bold: true, size: ENTRY_TITLE_HP, color: BLACK, font })];
        if (tech) primary.push(new TextRun({ text: ` | ${tech}`, size: ENTRY_TITLE_HP, color: BLACK, font }));
        out.push(...writer.entry(primary, "", formatPartialDate(item.date)), ...writer.lines(item.highlights));
      });
    },
    certifications: () => {
      if (!visible.certifications.length) return;
      out.push(writer.heading(titles.certifications));
      visible.certifications.forEach((item) => {
        out.push(...writer.entry(item.name, "", formatPartialDate(item.date)));
        if (item.issuingOrganization?.trim()) out.push(writer.line(item.issuingOrganization.trim(), { before: DETAIL_BEFORE }));
      });
    },
    awards: () => {
      if (!visible.awards.length) return;
      out.push(writer.heading(titles.awards));
      visible.awards.forEach((item) => out.push(...writer.entry(item.title, "", formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    volunteerExperiences: () => {
      if (!visible.volunteerExperiences.length) return;
      out.push(writer.heading(titles.volunteerExperiences));
      visible.volunteerExperiences.forEach((item) => out.push(...writer.entry([item.role, item.organization].filter(Boolean).join(" | "), "", formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    languages: () => {
      if (!visible.languages.length) return;
      out.push(writer.heading(titles.languages), writer.line(visible.languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • "), { before: ENTRY_BEFORE }));
    },
    publications: () => {
      if (!visible.publications.length) return;
      out.push(writer.heading(titles.publications));
      visible.publications.forEach((item) => {
        out.push(...writer.entry(item.title, item.publisher, formatPartialDate(item.date)));
        if (item.authors.trim()) out.push(writer.line(`Authors: ${item.authors}`, { before: DETAIL_BEFORE }));
        if (item.url.trim()) out.push(writer.line([hyperlink(item.url, item.url, { size: BODY_HP, font })], { before: DETAIL_BEFORE }));
        out.push(...writer.lines(item.highlights));
      });
    },
    presentations: () => {
      if (!visible.presentations.length) return;
      out.push(writer.heading(titles.presentations));
      visible.presentations.forEach((item) => {
        out.push(...writer.entry(item.title, item.event, formatPartialDate(item.date)));
        if (item.location.trim()) out.push(writer.line(`Location: ${item.location}`, { before: DETAIL_BEFORE }));
        out.push(...writer.lines(item.highlights));
      });
    },
    researchExperiences: () => {
      if (!visible.researchExperiences.length) return;
      out.push(writer.heading(titles.researchExperiences));
      visible.researchExperiences.forEach((item) => out.push(...writer.entry(item.role, [item.organization, item.project].filter(Boolean).join(" | "), formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    teachingExperiences: () => {
      if (!visible.teachingExperiences.length) return;
      out.push(writer.heading(titles.teachingExperiences));
      visible.teachingExperiences.forEach((item) => {
        out.push(...writer.entry(item.role, item.institution, formatPartialDate(item.date)));
        if (item.location.trim()) out.push(writer.line(`Location: ${item.location}`, { before: DETAIL_BEFORE }));
        out.push(...writer.lines(item.highlights));
      });
    },
    grants: () => {
      if (!visible.grants.length) return;
      out.push(writer.heading(titles.grants));
      visible.grants.forEach((item) => out.push(...writer.entry(item.name, item.issuer, formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    memberships: () => {
      if (!visible.memberships.length) return;
      out.push(writer.heading(titles.memberships));
      visible.memberships.forEach((item) => out.push(...writer.entry(item.role, item.organization, formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    organizations: () => {
      if (!visible.organizations.length) return;
      out.push(writer.heading(titles.organizations));
      visible.organizations.forEach((item) => out.push(...writer.entry(item.role, item.organization, formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    leadership: () => {
      if (!visible.leadership.length) return;
      out.push(writer.heading(titles.leadership));
      visible.leadership.forEach((item) => out.push(...writer.entry(item.role, item.organization, formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
    references: () => {
      if (!visible.references.length) return;
      out.push(writer.heading(titles.references));
      visible.references.forEach((item) => {
        out.push(writer.line(item.name, { bold: true, before: ENTRY_BEFORE }));
        [item.title, item.company, item.contactInfo].filter((value) => value?.trim()).forEach((value) => out.push(writer.line(value)));
      });
    },
    other: () => {
      if (!visible.otherEntries.length) return;
      out.push(writer.heading(titles.other));
      visible.otherEntries.forEach((item) => out.push(...writer.entry(item.name, "", formatPartialDate(item.date)), ...writer.lines(item.highlights)));
    },
  };

  keys.forEach((key) => builders[key]());
  return out;
}

function buildResumeBody(document: DocumentData, templateId: string | null | undefined, font: string): (Paragraph | Table)[] {
  const layout = getResumeLayout(templateId, document.optionalSections);
  const personal = document.personalDetails;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const contactLine = getContactLine(document);
  const links = personal.links.filter((link) => link.name.trim() && link.url.trim());
  const contact: RunStyle = { size: CONTACT_HP, font };

  const railChildren = buildResumeSections(document, layout.rail, new ResumeWriter(font, 0), font);
  // Same rule as the preview: the sidebar only exists when it has sections to show.
  const isSidebar = railChildren.length > 0;
  const alignment = layout.headerAlign === "center" ? AlignmentType.CENTER : AlignmentType.LEFT;

  // Header lines; the last one carries the 1px bottom rule the preview draws under the header.
  const headerLines: { children: ParagraphChild[]; before: number; line: ReturnType<typeof lineHeight> }[] = [];
  const bodyLine = lineHeight(CONTACT_HP / 2);
  // nameStyle uses line-height 1.2; the other header lines inherit 1.5.
  if (fullName) headerLines.push({ before: 0, line: lineHeight(NAME_HP / 2, 1.2), children: [new TextRun({ text: fullName, bold: true, size: NAME_HP, color: BLACK, font })] });
  if (personal.headline.trim()) headerLines.push({ before: 4 * PX_TO_TWIP, line: bodyLine, children: textRuns(personal.headline, { size: BODY_HP, font }) });
  if (!isSidebar && contactLine) headerLines.push({ before: 6 * PX_TO_TWIP, line: bodyLine, children: [new TextRun({ text: contactLine, size: CONTACT_HP, color: BLACK, font })] });
  if (!isSidebar && links.length) {
    headerLines.push({
      before: 2 * PX_TO_TWIP,
      line: bodyLine,
      children: links.flatMap((link, index) => [
        ...(index > 0 ? [new TextRun({ text: "  •  ", size: CONTACT_HP, color: BLACK, font })] : []),
        hyperlink(link.name, link.url, contact),
      ]),
    });
  }
  const header = headerLines.map((line, index) => new Paragraph({
    alignment,
    keepNext: true,
    spacing: { before: line.before, ...line.line },
    border: index === headerLines.length - 1 ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK, space: 7 } } : undefined,
    children: line.children,
  }));

  if (!isSidebar) {
    return [...header, ...buildResumeSections(document, layout.main, new ResumeWriter(font, CONTENT_WIDTH_TWIP), font)];
  }

  // Two-column templates: a borderless table — sidebar (left) and main column (right), like the preview.
  const railWidth = Math.round(CONTENT_WIDTH_TWIP * SIDEBAR_RAIL_WIDTH_RATIO - SIDEBAR_GAP_TWIP / 2);
  const mainWidth = CONTENT_WIDTH_TWIP - railWidth;
  const railInner = railWidth - RAIL_PADDING_TWIP * 2;
  const mainInner = mainWidth - SIDEBAR_GAP_TWIP;

  // Sidebar contact block: one item per line, line-height 1.6 (preview).
  const railLine = lineHeight(CONTACT_HP / 2, 1.6);
  const rail: Paragraph[] = [];
  // The rail's 12px top padding is expressed as spacing on its first line: Word lines up all cells
  // of a row by the largest top cell margin, which would push the main column down as well.
  if (contactLine) contactLine.split("  •  ").forEach((part, index) => rail.push(new Paragraph({ spacing: { before: index === 0 ? RAIL_PADDING_TWIP : 0, ...railLine }, children: [new TextRun({ text: part, size: CONTACT_HP, color: BLACK, font })] })));
  links.forEach((link, index) => rail.push(new Paragraph({ spacing: { before: index === 0 ? 4 * PX_TO_TWIP : 0, ...railLine }, children: [hyperlink(link.name, link.url, contact)] })));
  rail.push(...buildResumeSections(document, layout.rail, new ResumeWriter(font, railInner, true), font));
  const main = buildResumeSections(document, layout.main, new ResumeWriter(font, mainInner), font);

  const table = new Table({
    width: { size: CONTENT_WIDTH_TWIP, type: WidthType.DXA },
    columnWidths: [railWidth, mainWidth],
    layout: TableLayoutType.FIXED,
    borders: TableBorders.NONE,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    rows: [new TableRow({
      cantSplit: false,
      children: [
        new TableCell({
          width: { size: railWidth, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: RAIL_FILL, color: "auto" },
          margins: { top: 0, bottom: RAIL_PADDING_TWIP, left: RAIL_PADDING_TWIP, right: RAIL_PADDING_TWIP },
          verticalAlign: VerticalAlign.TOP,
          children: rail,
        }),
        new TableCell({
          width: { size: mainWidth, type: WidthType.DXA },
          margins: { top: 0, bottom: 0, left: SIDEBAR_GAP_TWIP, right: 0 },
          verticalAlign: VerticalAlign.TOP,
          children: main.length ? main : [new Paragraph({})],
        }),
      ],
    })],
  });

  // Word requires a paragraph after a table at the end of a section.
  // 12px gap between header and columns (preview: mt-3) as an exact-height spacer; a 1pt line closes the section.
  const spacer = (height: number) => new Paragraph({ spacing: { before: 0, after: 0, line: height, lineRule: LineRuleType.EXACT }, children: [new TextRun({ text: "", size: 2 })] });
  return [...header, spacer(12 * PX_TO_TWIP), table, spacer(PT_TO_TWIP)];
}

/* ── Letters ──────────────────────────────────────────────────── */

function buildLetterBody(document: DocumentData, documentType: string, templateId: string | null | undefined, font: string): Paragraph[] {
  const letter = buildLetterContent(document.letterDetails!, documentType, templateId);
  const body: RunStyle = { size: LETTER_BODY_HP, font };
  const lineSpacing = lineHeight(LETTER_BODY_HP / 2, LETTER_LINE_HEIGHT);
  const para = (text: string, before = 0, bold = false) =>
    new Paragraph({ spacing: { before, ...lineSpacing }, children: textRuns(text, { ...body, bold }) });
  const out: Paragraph[] = [];

  if (letter.style === "modern") {
    if (letter.senderName) out.push(new Paragraph({ spacing: lineHeight(LETTER_NAME_HP / 2, 1.2), children: [new TextRun({ text: letter.senderName, bold: true, size: LETTER_NAME_HP, color: BLACK, font })] }));
    if (letter.senderName || letter.senderLines.length) {
      out.push(new Paragraph({
        spacing: { before: 3 * PT_TO_TWIP, ...lineSpacing },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK, space: 7 } },
        children: textRuns(letter.senderLines.join(" • "), body),
      }));
    }
    if (letter.date) out.push(para(letter.date, 15 * PT_TO_TWIP));
  } else if (letter.style === "classic") {
    if (letter.senderName) out.push(para(letter.senderName, 0, true));
    if (letter.senderLines.length) out.push(para(letter.senderLines.join("\n")));
    if (letter.date) out.push(para(letter.date, 12 * PT_TO_TWIP));
  } else if (letter.date) {
    out.push(para(letter.date));
  }

  if (letter.recipientLines.length) out.push(para(letter.recipientLines.join("\n"), 12 * PT_TO_TWIP));
  if (letter.subject) out.push(para(letter.style === "minimal" ? `Re: ${letter.subject}` : `Subject: ${letter.subject}`, 12 * PT_TO_TWIP, letter.style !== "minimal"));
  if (letter.salutation) out.push(para(letter.salutation, 12 * PT_TO_TWIP));
  letter.details.forEach((line, index) => out.push(para(line, index === 0 ? 9 * PT_TO_TWIP : 2 * PT_TO_TWIP)));
  letter.paragraphs.forEach((paragraph) => out.push(para(paragraph, 9 * PT_TO_TWIP)));
  const signOff = getLetterSignOff(letter);
  if (signOff) out.push(new Paragraph({ keepLines: true, spacing: { before: 15 * PT_TO_TWIP, ...lineSpacing }, children: textRuns(signOff, body) }));
  if (letter.style === "minimal" && letter.senderLines.length) out.push(para(letter.senderLines.join("\n"), 2 * PT_TO_TWIP));

  return out.length ? out : [new Paragraph({})];
}

/* ── Public API ───────────────────────────────────────────────── */

/** Builds a genuinely editable .docx document (real OOXML paragraphs/runs — no images or HTML). */
export function buildDocumentDocx({ document: raw, documentType, templateId, fontId }: DocxExportInput): Document {
  const document = normalizeDocumentData(raw);
  const font = getFont(fontId).name;
  const letter = isLetterType(documentType);
  const children = letter
    ? buildLetterBody(document, documentType, templateId, font)
    : buildResumeBody(document, templateId, font);

  return new Document({
    creator: "Documaxxer",
    title: getExportBaseName(document, documentType).replace(/_/g, " "),
    description: `Exported ${documentType} from Documaxxer`,
    styles: {
      default: {
        document: {
          // Kerning on (Word's default is off) — browsers kern, so line widths and wraps match the preview.
          run: { font, size: letter ? LETTER_BODY_HP : BODY_HP, color: BLACK, kern: 2 },
          paragraph: { spacing: { after: 0 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: convertMillimetersToTwip(PAGE_WIDTH_MM), height: convertMillimetersToTwip(PAGE_HEIGHT_MM) },
          margin: {
            top: convertMillimetersToTwip(MARGIN_MM),
            right: convertMillimetersToTwip(MARGIN_MM),
            bottom: convertMillimetersToTwip(MARGIN_MM),
            left: convertMillimetersToTwip(MARGIN_MM),
          },
        },
      },
      children,
    }],
  });
}

/** Builds the .docx and triggers a browser download. */
export async function exportDocumentToDocx(input: DocxExportInput): Promise<void> {
  const blob = await Packer.toBlob(buildDocumentDocx(input));
  downloadBlob(blob, `${getExportBaseName(normalizeDocumentData(input.document), input.documentType)}.docx`);
}
