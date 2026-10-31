import {
  AlignmentType, BorderStyle, Document, HeightRule, HorizontalPositionRelativeFrom, ImageRun, LineRuleType, OverlapType, Packer,
  Paragraph, ShadingType, Table, TableAnchorType, TableCell, TableLayoutType, TableRow, TextRun, TextWrappingType, VerticalAlign,
  VerticalPositionRelativeFrom, WidthType, type ISectionOptions, type TableVerticalAlign,
} from "docx";
import type { BlockDefinition, PageDefinition, VisualTemplateDefinition } from "@/types/visual-document";
import { BLOCK_PADDING_PX, parseTable } from "@/lib/visual/visual-model";
import { downloadBlob } from "@/lib/export/download";

/**
 * Visual template → editable DOCX.
 *
 * Every page becomes its own section with the page's exact size and no margins.
 * Text, shapes, dividers, signatures and tables become *floating tables* placed at
 * the block's absolute page coordinates (text stays editable); images become
 * floating pictures. Known Word limitations: rounded corners and opacity are
 * not reproduced, and text that overflows a fixed-height block is clipped.
 */

const PX_TO_TWIP = 15;        // 96 dpi CSS px → 1/20 pt
const PX_TO_EMU = 9525;       // 96 dpi CSS px → English Metric Units
const PX_TO_HALF_POINT = 1.5; // 1px = 0.75pt = 1.5 half-points
const PX_TO_EIGHTH_POINT = 6; // border widths are in 1/8 pt

const hex = (color: string | undefined, fallback = "000000") => {
  const value = color?.trim().replace(/^#/, "");
  if (!value || value === "transparent") return fallback;
  if (/^[0-9a-f]{3}$/i.test(value)) return value.split("").map((char) => char + char).join("").toUpperCase();
  return /^[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : fallback;
};
const isFilled = (color: string | undefined) => Boolean(color && color !== "transparent");

const ALIGN = { left: AlignmentType.LEFT, center: AlignmentType.CENTER, right: AlignmentType.RIGHT } as const;

function runs(block: BlockDefinition, text: string, bold?: boolean): TextRun[] {
  const { style } = block;
  return text.split("\n").map((line, index) => new TextRun({
    text: line,
    font: style.fontFamily ?? "Arial",
    size: Math.max(2, Math.round((style.fontSize ?? 14) * PX_TO_HALF_POINT)),
    bold: bold ?? (style.fontWeight ?? 400) >= 600,
    color: hex(style.color, "172033"),
    break: index > 0 ? 1 : undefined,
  }));
}

function textParagraph(block: BlockDefinition, text: string, bold?: boolean): Paragraph {
  return new Paragraph({
    alignment: ALIGN[block.style.align ?? "left"],
    spacing: { before: 0, after: 0, line: 312, lineRule: LineRuleType.AUTO }, // 1.3 line height
    children: runs(block, text, bold),
  });
}

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER };

function floatOptions(block: BlockDefinition) {
  return {
    horizontalAnchor: TableAnchorType.PAGE,
    verticalAnchor: TableAnchorType.PAGE,
    absoluteHorizontalPosition: Math.round(block.x * PX_TO_TWIP),
    absoluteVerticalPosition: Math.round(block.y * PX_TO_TWIP),
    overlap: OverlapType.OVERLAP,
    leftFromText: 0, rightFromText: 0, topFromText: 0, bottomFromText: 0,
  };
}

/** A fixed-size, single-cell floating table — the DOCX equivalent of an absolutely positioned box. */
function boxTable(block: BlockDefinition, children: Paragraph[], options: { padding?: number; fill?: string; verticalAlign?: TableVerticalAlign; topBorderOnly?: boolean } = {}): Table {
  const width = Math.max(1, Math.round(block.width * PX_TO_TWIP));
  const height = Math.max(20, Math.round(block.height * PX_TO_TWIP));
  const padding = Math.round((options.padding ?? 0) * PX_TO_TWIP);
  const borderWidth = block.style.borderWidth ?? 0;
  const border = borderWidth > 0
    ? { style: BorderStyle.SINGLE, size: Math.max(2, Math.round(borderWidth * PX_TO_EIGHTH_POINT)), color: hex(block.style.borderColor) }
    : NO_BORDER;

  return new Table({
    float: floatOptions(block),
    layout: TableLayoutType.FIXED,
    width: { size: width, type: WidthType.DXA },
    columnWidths: [width],
    borders: NO_BORDERS,
    rows: [new TableRow({
      height: { value: height, rule: HeightRule.EXACT },
      children: [new TableCell({
        width: { size: width, type: WidthType.DXA },
        margins: { top: padding, bottom: padding, left: padding, right: padding },
        verticalAlign: options.verticalAlign ?? VerticalAlign.TOP,
        shading: options.fill ? { type: ShadingType.CLEAR, fill: options.fill, color: "auto" } : undefined,
        borders: { top: border, bottom: border, left: border, right: border },
        children,
      })],
    })],
  });
}

function dataTable(block: BlockDefinition): Table {
  const rows = parseTable(block.content);
  const width = Math.max(1, Math.round(block.width * PX_TO_TWIP));
  const columns = Math.max(1, rows[0]?.length ?? 1);
  const columnWidth = Math.floor(width / columns);
  const line = { style: BorderStyle.SINGLE, size: Math.max(2, Math.round(Math.max(1, block.style.borderWidth ?? 1) * PX_TO_EIGHTH_POINT)), color: hex(block.style.borderColor, "94A3B8") };

  return new Table({
    float: floatOptions(block),
    layout: TableLayoutType.FIXED,
    width: { size: columnWidth * columns, type: WidthType.DXA },
    columnWidths: Array.from({ length: columns }, () => columnWidth),
    borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: line, insideVertical: line },
    rows: (rows.length ? rows : [[""]]).map((row, rowIndex) => new TableRow({
      children: row.map((cell) => new TableCell({
        width: { size: columnWidth, type: WidthType.DXA },
        margins: { top: 4 * PX_TO_TWIP, bottom: 4 * PX_TO_TWIP, left: 6 * PX_TO_TWIP, right: 6 * PX_TO_TWIP },
        shading: isFilled(block.style.backgroundColor) ? { type: ShadingType.CLEAR, fill: hex(block.style.backgroundColor), color: "auto" } : undefined,
        children: [textParagraph(block, cell, rowIndex === 0 ? true : undefined)],
      })),
    })),
  });
}

function dataUrlBytes(dataUrl: string): Uint8Array | null {
  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const binary = atob(match[1]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

/** Tiny anchor paragraph: separates floating tables (Word merges adjacent tables) without taking page space. */
const anchor = (children: ImageRun[] = []) => new Paragraph({ spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT }, children: children.length ? children : [new TextRun({ text: "", size: 2 })] });

function blockToDocx(block: BlockDefinition): (Paragraph | Table)[] {
  const { style } = block;
  const fill = isFilled(style.backgroundColor) ? hex(style.backgroundColor) : undefined;

  switch (block.type) {
    case "text":
    case "heading":
      return [boxTable(block, [textParagraph(block, block.content)], { padding: BLOCK_PADDING_PX, fill }), anchor()];
    case "shape":
      return [boxTable(block, [anchor()], { fill: hex(style.backgroundColor, "E4E9F2") }), anchor()];
    case "divider":
      return [boxTable({ ...block, style: { ...style, borderWidth: 0 } }, [anchor()], { fill: hex(style.borderColor ?? style.color, "172033") }), anchor()];
    case "signature":
      return [boxTable({ ...block, style: { ...style, borderWidth: 0 } }, [new Paragraph({
        alignment: ALIGN[style.align ?? "left"],
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: hex(style.borderColor, "172033"), space: 3 } },
        children: runs(block, block.content),
      })], { padding: 0, fill, verticalAlign: VerticalAlign.BOTTOM }), anchor()];
    case "table":
      return [dataTable(block), anchor()];
    case "image":
    case "logo": {
      const bytes = dataUrlBytes(block.content);
      if (!bytes) return [];
      return [anchor([new ImageRun({
        type: "png",
        data: bytes,
        transformation: { width: block.width, height: block.height },
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: Math.round(block.x * PX_TO_EMU) },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(block.y * PX_TO_EMU) },
          allowOverlap: true,
          behindDocument: false,
          wrap: { type: TextWrappingType.NONE },
          zIndex: block.zIndex,
        },
      })])];
    }
    default:
      return [];
  }
}

function pageSection(page: PageDefinition, blocks: BlockDefinition[]): ISectionOptions {
  const children = blocks
    .filter((block) => block.pageId === page.id && block.visible)
    .sort((a, b) => a.zIndex - b.zIndex)
    .flatMap(blockToDocx);

  return {
    properties: {
      page: {
        size: { width: Math.round(page.width * PX_TO_TWIP), height: Math.round(page.height * PX_TO_TWIP) },
        margin: { top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0 },
      },
    },
    children: children.length ? children : [anchor()],
  };
}

export function buildVisualTemplateDocx(template: Pick<VisualTemplateDefinition, "name" | "pages" | "blocks">): Document {
  return new Document({
    creator: "Documaxxer",
    title: template.name,
    styles: { default: { document: { run: { font: "Arial", size: 21 }, paragraph: { spacing: { after: 0 } } } } },
    sections: template.pages.map((page) => pageSection(page, template.blocks)),
  });
}

export function exportFileBaseName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, "").trim().replace(/\s+/g, "_").slice(0, 80) || "Document";
}

export async function exportVisualTemplateToDocx(template: Pick<VisualTemplateDefinition, "name" | "pages" | "blocks">): Promise<void> {
  const blob = await Packer.toBlob(buildVisualTemplateDocx(template));
  downloadBlob(blob, `${exportFileBaseName(template.name)}.docx`);
}
