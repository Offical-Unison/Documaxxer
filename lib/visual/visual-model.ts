import type { BlockDefinition, BlockType, PageDefinition, PageSize, VisualTemplateDefinition } from "@/types/visual-document";

/** Page sizes in CSS px at 96 dpi (A4 = 210 × 297 mm, Letter = 8.5 × 11 in). */
export const PAGE_PRESETS: Record<Exclude<PageSize, "custom">, { width: number; height: number; label: string }> = {
  a4: { width: 794, height: 1123, label: "A4" },
  letter: { width: 816, height: 1056, label: "Letter" },
};

export const MIN_PAGE_PX = 200;
export const MAX_PAGE_PX = 4000;

/** Inner padding of text-like blocks, identical in the editor, the PDF and the DOCX. */
export const BLOCK_PADDING_PX = 8;

export const BLOCK_TYPES: BlockType[] = ["text", "heading", "image", "logo", "table", "divider", "shape", "signature", "spacer"];

export const BLOCK_FONTS = ["Arial", "Calibri", "Georgia", "Helvetica", "Times New Roman", "Verdana"];

export const TEMPLATE_DOCUMENT_TYPES = [
  { value: "business-document", label: "Business document" },
  { value: "letter", label: "Letter" },
  { value: "invoice", label: "Invoice" },
  { value: "proposal", label: "Proposal" },
  { value: "report", label: "Report" },
  { value: "certificate", label: "Certificate" },
  { value: "resume", label: "Resume" },
  { value: "cv", label: "CV" },
  { value: "other", label: "Other" },
];

const BLOCK_DEFAULTS: Record<BlockType, { content: string; width: number; height: number }> = {
  text: { content: "Body text", width: 674, height: 56 },
  heading: { content: "Section heading", width: 674, height: 48 },
  image: { content: "", width: 240, height: 160 },
  logo: { content: "", width: 120, height: 80 },
  table: { content: "Item | Qty | Price\nDesign | 1 | 500\nDevelopment | 2 | 1,200", width: 674, height: 120 },
  divider: { content: "", width: 674, height: 2 },
  shape: { content: "", width: 200, height: 120 },
  signature: { content: "Signature", width: 240, height: 64 },
  spacer: { content: "", width: 674, height: 24 },
};

let idCounter = 0;
export function makeId(prefix: string): string {
  idCounter += 1;
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${idCounter}-${random}`;
}

export function makePage(size: PageSize = "a4", custom?: { width: number; height: number }): PageDefinition {
  const dimensions = size === "custom" ? (custom ?? PAGE_PRESETS.a4) : PAGE_PRESETS[size];
  return {
    id: makeId("page"),
    width: dimensions.width,
    height: dimensions.height,
    size,
    background: "#ffffff",
    margin: 40,
    grid: { enabled: true, size: 10, snap: true },
    overflow: "clip",
  };
}

export function makeBlock(type: BlockType, page: PageDefinition, existingOnPage: BlockDefinition[]): BlockDefinition {
  const item = BLOCK_DEFAULTS[type];
  const width = Math.min(item.width, page.width - page.margin * 2);
  const lowest = existingOnPage.reduce((bottom, block) => Math.max(bottom, block.y + block.height), page.margin);
  const y = Math.min(lowest + 10, Math.max(page.margin, page.height - item.height - page.margin));
  const topZ = existingOnPage.reduce((max, block) => Math.max(max, block.zIndex), 0);

  return {
    id: makeId("block"),
    type,
    pageId: page.id,
    x: page.margin,
    y,
    width,
    height: item.height,
    zIndex: topZ + 1,
    visible: true,
    locked: false,
    content: item.content,
    style: {
      fontFamily: "Arial",
      fontSize: type === "heading" ? 22 : 14,
      fontWeight: type === "heading" ? 700 : 400,
      color: "#172033",
      backgroundColor: type === "shape" ? "#e4e9f2" : "transparent",
      borderColor: type === "table" ? "#94a3b8" : "#172033",
      borderWidth: type === "table" ? 1 : 0,
      borderRadius: 0,
      align: "left",
      opacity: 1,
    },
  };
}

/** Parses "a | b | c" lines into table rows; the first row is the header. */
export function parseTable(content: string): string[][] {
  const rows = content.split("\n").map((line) => line.split("|").map((cell) => cell.trim())).filter((row) => row.some(Boolean));
  const columns = Math.max(1, ...rows.map((row) => row.length));
  return rows.map((row) => Array.from({ length: columns }, (_, index) => row[index] ?? ""));
}

const clamp = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

/** Repairs template JSON loaded from the database so the editor and exporters can rely on its shape. */
export function normalizeVisualTemplate(raw: unknown): Pick<VisualTemplateDefinition, "pages" | "blocks"> {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<VisualTemplateDefinition>;
  const pages = (Array.isArray(data.pages) ? data.pages : [])
    .filter((page): page is PageDefinition => Boolean(page && typeof page === "object" && typeof page.id === "string"))
    .map((page) => ({
      ...makePage(page.size === "letter" || page.size === "custom" ? page.size : "a4"),
      ...page,
      width: clamp(page.width, MIN_PAGE_PX, MAX_PAGE_PX, PAGE_PRESETS.a4.width),
      height: clamp(page.height, MIN_PAGE_PX, MAX_PAGE_PX, PAGE_PRESETS.a4.height),
      grid: { enabled: page.grid?.enabled ?? true, size: clamp(page.grid?.size, 2, 100, 10), snap: page.grid?.snap ?? true },
    }));
  if (pages.length === 0) pages.push(makePage("a4"));
  const pageIds = new Set(pages.map((page) => page.id));
  const blocks = (Array.isArray(data.blocks) ? data.blocks : [])
    .filter((block): block is BlockDefinition => Boolean(block && typeof block === "object" && pageIds.has(block.pageId) && BLOCK_TYPES.includes(block.type)))
    .map((block) => ({
      ...block,
      x: clamp(block.x, -MAX_PAGE_PX, MAX_PAGE_PX, 0),
      y: clamp(block.y, -MAX_PAGE_PX, MAX_PAGE_PX, 0),
      width: clamp(block.width, 1, MAX_PAGE_PX, 100),
      height: clamp(block.height, 1, MAX_PAGE_PX, 40),
      zIndex: clamp(block.zIndex, -1000, 100000, 0),
      visible: block.visible !== false,
      locked: Boolean(block.locked),
      content: typeof block.content === "string" ? block.content : "",
      style: block.style && typeof block.style === "object" ? block.style : {},
    }));
  return { pages, blocks };
}

/** Converts an uploaded image into a PNG data URL (max 1600px), so every exporter can embed it. */
export async function imageFileToPngDataUrl(file: File, maxSide = 1600): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Unsupported image."));
    element.src = source;
  });
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
