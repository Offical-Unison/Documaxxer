"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import type { BlockDefinition, BlockStyle, BlockType, PageDefinition, PageSize, VisualTemplateDefinition } from "@/types/visual-document";
import {
  BLOCK_FONTS, BLOCK_TYPES, MAX_PAGE_PX, MIN_PAGE_PX, PAGE_PRESETS, TEMPLATE_DOCUMENT_TYPES,
  imageFileToPngDataUrl, makeBlock, makeId, makePage, normalizeVisualTemplate,
} from "@/lib/visual/visual-model";
import { VisualBlockContent, VisualPrintPages, blockFrameStyle, visualPrintPageCss } from "@/components/templates/visual-block";
import { exportFileBaseName, exportVisualTemplateToDocx } from "@/lib/export/visual-docx-export";
import { printDocument } from "@/lib/export/download";

type ResizeHandle = "e" | "s" | "se";
type Interaction = {
  kind: "move" | "resize";
  id: string;
  handle?: ResizeHandle;
  startX: number;
  startY: number;
  origin: { x: number; y: number; width: number; height: number };
};
type Notice = { tone: "info" | "error"; text: string } | null;

const GUIDE_THRESHOLD = 6;
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5];
const TEXT_BLOCKS: BlockType[] = ["text", "heading", "signature", "table"];
const FILL_BLOCKS: BlockType[] = ["text", "heading", "shape", "table", "signature"];
const BORDER_BLOCKS: BlockType[] = ["text", "heading", "shape", "table", "image", "logo"];

const INPUT = "mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
const SMALL_BUTTON = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800";

const isTypingTarget = (target: EventTarget) => target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
const toHexColor = (value: string | undefined, fallback: string) => (value && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback);
const finite = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function TemplateBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("template");

  const [initialPage] = useState(() => makePage("a4"));
  const [templateId, setTemplateId] = useState<string | null>(requestedId);
  const [loading, setLoading] = useState(Boolean(requestedId));
  const [name, setName] = useState("My document template");
  const [description, setDescription] = useState("");
  const [documentType, setDocumentType] = useState("business-document");
  const [pages, setPages] = useState<PageDefinition[]>([initialPage]);
  const [activePageId, setActivePageId] = useState(initialPage.id);
  const [blocks, setBlocks] = useState<BlockDefinition[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);
  const interaction = useRef<Interaction | null>(null);
  const [activeInteraction, setActiveInteraction] = useState<Interaction["kind"] | null>(null);

  const page = pages.find((item) => item.id === activePageId) ?? pages[0];
  const pageBlocks = blocks.filter((block) => block.pageId === page.id);
  const selected = blocks.find((block) => block.id === selectedId) ?? null;

  useEffect(() => setPrintRoot(document.body), []);

  /* ── Load an existing template ─────────────────────────────── */
  useEffect(() => {
    if (!requestedId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/templates/${encodeURIComponent(requestedId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const template = (await response.json()) as { id: string; name: string; description: string; documentType: string; schema: unknown };
        if (cancelled) return;
        const schema = template.schema as Partial<VisualTemplateDefinition>;
        if (!Array.isArray(schema?.pages)) throw new Error("not-visual");
        const { pages: loadedPages, blocks: loadedBlocks } = normalizeVisualTemplate(schema);
        setTemplateId(template.id);
        setName(template.name);
        setDescription(template.description);
        setDocumentType(template.documentType);
        setPages(loadedPages);
        setBlocks(loadedBlocks);
        setActivePageId(loadedPages[0].id);
        setSelectedId(null);
        setDirty(false);
        setNotice(null);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setTemplateId(null);
        setNotice({ tone: "error", text: error.message === "not-visual" ? "That template was not made in the visual editor." : "That template could not be loaded. You are editing a new template." });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [requestedId]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ── Mutations ─────────────────────────────────────────────── */
  const changeBlocks = useCallback((update: (current: BlockDefinition[]) => BlockDefinition[]) => {
    setBlocks(update);
    setDirty(true);
  }, []);

  const changeBlock = useCallback((id: string, update: Partial<BlockDefinition>) => {
    changeBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...update } : block)));
  }, [changeBlocks]);

  const changeStyle = (update: Partial<BlockStyle>) => {
    if (!selected) return;
    changeBlock(selected.id, { style: { ...selected.style, ...update } });
  };

  function updatePage(update: Partial<PageDefinition>) {
    setPages((current) => current.map((item) => (item.id === page.id ? { ...item, ...update } : item)));
    setDirty(true);
  }

  function addBlock(type: BlockType) {
    const block = makeBlock(type, page, pageBlocks);
    changeBlocks((current) => [...current, block]);
    setSelectedId(block.id);
  }

  function duplicateSelected() {
    if (!selected) return;
    const offset = page.grid.size * 2;
    const copy: BlockDefinition = {
      ...selected,
      id: makeId("block"),
      x: Math.min(selected.x + offset, Math.max(0, page.width - selected.width)),
      y: Math.min(selected.y + offset, Math.max(0, page.height - selected.height)),
      zIndex: Math.max(0, ...pageBlocks.map((block) => block.zIndex)) + 1,
      locked: false,
    };
    changeBlocks((current) => [...current, copy]);
    setSelectedId(copy.id);
  }

  function removeSelected() {
    if (!selected) return;
    changeBlocks((current) => current.filter((block) => block.id !== selected.id));
    setSelectedId(null);
  }

  function arrange(direction: "front" | "back" | "forward" | "backward") {
    if (!selected) return;
    const ordered = [...pageBlocks].sort((a, b) => a.zIndex - b.zIndex);
    const index = ordered.findIndex((block) => block.id === selected.id);
    const target = direction === "front" ? ordered.length - 1 : direction === "back" ? 0 : direction === "forward" ? Math.min(ordered.length - 1, index + 1) : Math.max(0, index - 1);
    const [moved] = ordered.splice(index, 1);
    ordered.splice(target, 0, moved);
    const zById = new Map(ordered.map((block, order) => [block.id, order + 1]));
    changeBlocks((current) => current.map((block) => (zById.has(block.id) ? { ...block, zIndex: zById.get(block.id)! } : block)));
  }

  function addPage() {
    const next = page.size === "custom" ? makePage("custom", { width: page.width, height: page.height }) : makePage(page.size);
    setPages((current) => [...current, next]);
    setActivePageId(next.id);
    setSelectedId(null);
    setDirty(true);
  }

  function deletePage() {
    if (pages.length <= 1) return;
    if (pageBlocks.length > 0 && !window.confirm(`Delete page ${pages.indexOf(page) + 1} and its ${pageBlocks.length} block(s)?`)) return;
    const remaining = pages.filter((item) => item.id !== page.id);
    setPages(remaining);
    changeBlocks((current) => current.filter((block) => block.pageId !== page.id));
    setActivePageId(remaining[0].id);
    setSelectedId(null);
  }

  function changePageSize(size: PageSize) {
    if (size === "custom") updatePage({ size });
    else updatePage({ size, width: PAGE_PRESETS[size].width, height: PAGE_PRESETS[size].height });
  }

  /* ── Pointer interactions (move / resize) with grid + guide snapping ── */
  const snapToGrid = (value: number) => (page.grid.snap ? Math.round(value / page.grid.size) * page.grid.size : value);

  function guidePositions(block: BlockDefinition, axis: "x" | "y") {
    const others = pageBlocks.filter((item) => item.id !== block.id && item.visible);
    return axis === "x"
      ? [0, page.margin, page.width / 2, page.width - page.margin, page.width, ...others.flatMap((item) => [item.x, item.x + item.width / 2, item.x + item.width])]
      : [0, page.margin, page.height / 2, page.height - page.margin, page.height, ...others.flatMap((item) => [item.y, item.y + item.height / 2, item.y + item.height])];
  }

  /** Snaps a position so the block's start, centre or end (`edges`) lands on a nearby guide. */
  function snapToGuides(start: number, size: number, axis: "x" | "y", block: BlockDefinition, edges = [0, size / 2, size]) {
    if (!page.grid.snap) return start;
    let best = start;
    let bestDistance = GUIDE_THRESHOLD + 1;
    for (const candidate of guidePositions(block, axis)) {
      for (const edge of edges) {
        const distance = Math.abs(start + edge - candidate);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = candidate - edge;
        }
      }
    }
    return bestDistance <= GUIDE_THRESHOLD ? best : start;
  }

  function startInteraction(event: PointerEvent<HTMLElement>, block: BlockDefinition, kind: Interaction["kind"], handle?: ResizeHandle) {
    if (event.button !== 0) return;
    event.stopPropagation();
    setSelectedId(block.id);
    if (block.locked) return;
    interaction.current = { kind, id: block.id, handle, startX: event.clientX, startY: event.clientY, origin: { x: block.x, y: block.y, width: block.width, height: block.height } };
    setActiveInteraction(kind);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveInteraction(event: PointerEvent<HTMLElement>) {
    const active = interaction.current;
    if (!active) return;
    const block = blocks.find((item) => item.id === active.id);
    if (!block) return;
    const dx = (event.clientX - active.startX) / zoom;
    const dy = (event.clientY - active.startY) / zoom;
    const { origin } = active;

    if (active.kind === "move") {
      const x = snapToGuides(snapToGrid(origin.x + dx), origin.width, "x", block);
      const y = snapToGuides(snapToGrid(origin.y + dy), origin.height, "y", block);
      changeBlock(block.id, { x: Math.round(Math.min(page.width - 4, Math.max(4 - origin.width, x))), y: Math.round(Math.min(page.height - 4, Math.max(4 - origin.height, y))) });
      return;
    }

    // Resizing snaps the moving (right / bottom) edge to guides.
    const update: Partial<BlockDefinition> = {};
    if (active.handle === "e" || active.handle === "se") {
      const right = snapToGuides(origin.x + snapToGrid(origin.width + dx), 0, "x", block, [0]);
      update.width = Math.round(Math.max(8, Math.min(page.width - origin.x, right - origin.x)));
    }
    if (active.handle === "s" || active.handle === "se") {
      const bottom = snapToGuides(origin.y + snapToGrid(origin.height + dy), 0, "y", block, [0]);
      update.height = Math.round(Math.max(1, Math.min(page.height - origin.y, bottom - origin.y)));
    }
    changeBlock(block.id, update);
  }

  function endInteraction() {
    interaction.current = null;
    setActiveInteraction(null);
  }

  function handleCanvasKey(event: KeyboardEvent<HTMLDivElement>) {
    if (isTypingTarget(event.target)) return;
    if (event.key === "Escape") { setSelectedId(null); return; }
    if (!selected) return;
    if ((event.key === "Delete" || event.key === "Backspace") && !selected.locked) { event.preventDefault(); removeSelected(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelected(); return; }
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const move = moves[event.key];
    if (move && !selected.locked) {
      event.preventDefault();
      changeBlock(selected.id, { x: selected.x + move[0], y: selected.y + move[1] });
    }
  }

  /* ── Guides shown while dragging ───────────────────────────── */
  const guideLines: { axis: "x" | "y"; position: number }[] = [];
  if (selected && activeInteraction && selected.pageId === page.id) {
    const xs = [selected.x, selected.x + selected.width / 2, selected.x + selected.width];
    const ys = [selected.y, selected.y + selected.height / 2, selected.y + selected.height];
    new Set(guidePositions(selected, "x")).forEach((position) => { if (xs.some((value) => Math.abs(value - position) < 0.5)) guideLines.push({ axis: "x", position }); });
    new Set(guidePositions(selected, "y")).forEach((position) => { if (ys.some((value) => Math.abs(value - position) < 0.5)) guideLines.push({ axis: "y", position }); });
  }

  /* ── Persistence ───────────────────────────────────────────── */
  function buildSchema(): VisualTemplateDefinition {
    const now = new Date().toISOString();
    return { id: templateId ?? "new", name: name.trim(), description: description.trim(), documentType, builtIn: false, pages, blocks, createdAt: now, updatedAt: now };
  }

  async function saveTemplate(asCopy = false) {
    if (!name.trim()) {
      setNotice({ tone: "error", text: "Give the template a name before saving." });
      return;
    }
    setSaving(true);
    setNotice(null);
    const schema = buildSchema();
    const payloadName = asCopy ? `${schema.name} (Copy)` : schema.name;
    try {
      const response = await fetch(templateId && !asCopy ? `/api/templates/${templateId}` : "/api/templates", {
        method: templateId && !asCopy ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payloadName, description: schema.description, documentType, schema: { ...schema, name: payloadName } }),
      });
      const result = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error ?? "The template could not be saved.");
      setDirty(false);
      if (asCopy) setName(payloadName);
      if (result.id !== templateId) {
        setTemplateId(result.id);
        router.replace(`/template-builder?template=${encodeURIComponent(result.id)}`, { scroll: false });
      }
      setNotice({ tone: "info", text: asCopy ? "Saved as a new copy." : "Template saved." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "The template could not be saved." });
    } finally {
      setSaving(false);
    }
  }

  function newTemplate() {
    if (dirty && !window.confirm("Discard unsaved changes and start a new template?")) return;
    const fresh = makePage("a4");
    setTemplateId(null);
    setName("My document template");
    setDescription("");
    setDocumentType("business-document");
    setPages([fresh]);
    setActivePageId(fresh.id);
    setBlocks([]);
    setSelectedId(null);
    setDirty(false);
    setNotice(null);
    router.replace("/template-builder", { scroll: false });
  }

  /* ── Export ────────────────────────────────────────────────── */
  function exportPdf() {
    setSelectedId(null);
    printDocument(exportFileBaseName(name), visualPrintPageCss(pages));
  }

  async function exportWord() {
    setExporting(true);
    setNotice(null);
    try {
      await exportVisualTemplateToDocx({ name: name.trim() || "Document", pages, blocks });
    } catch {
      setNotice({ tone: "error", text: "The Word document could not be generated." });
    } finally {
      setExporting(false);
    }
  }

  async function uploadImage(file: File | undefined) {
    if (!file || !selected) return;
    if (!file.type.startsWith("image/")) {
      setNotice({ tone: "error", text: "Choose an image file (PNG, JPG, GIF, WebP or SVG)." });
      return;
    }
    try {
      changeBlock(selected.id, { content: await imageFileToPngDataUrl(file) });
    } catch {
      setNotice({ tone: "error", text: "That image could not be read." });
    }
  }

  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Loading template…</main>;
  }

  const layers = [...pageBlocks].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <>
      {printRoot && createPortal(<VisualPrintPages pages={pages} blocks={blocks} />, printRoot)}
      <main className="min-h-[100dvh] bg-slate-100 px-4 py-6 print:hidden dark:bg-[#0B0F19] sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Visual template editor</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">{templateId ? name || "Untitled template" : "Design the page"}</h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dirty ? "Unsaved changes" : templateId ? "All changes saved" : "Not saved yet"}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={newTemplate} className={SMALL_BUTTON}>New</button>
              <button type="button" onClick={exportPdf} className={SMALL_BUTTON}>Export PDF</button>
              <button type="button" onClick={() => void exportWord()} disabled={exporting} className={SMALL_BUTTON}>{exporting ? "Preparing…" : "Export Word"}</button>
              {templateId && <button type="button" onClick={() => void saveTemplate(true)} disabled={saving} className={SMALL_BUTTON}>Save as copy</button>}
              <button type="button" onClick={() => void saveTemplate()} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving..." : "Save template"}
              </button>
            </div>
          </header>

          {notice && (
            <p role={notice.tone === "error" ? "alert" : "status"} className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${notice.tone === "error" ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300" : "border border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"}`}>
              {notice.text}
            </p>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <nav className="flex gap-2 overflow-x-auto" aria-label="Pages">
              {pages.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setActivePageId(item.id); setSelectedId(null); }}
                  aria-current={item.id === page.id ? "page" : undefined}
                  className={`rounded px-3 py-1.5 text-sm font-semibold ${item.id === page.id ? "bg-blue-600 text-white" : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"}`}
                >
                  Page {index + 1}
                </button>
              ))}
            </nav>
            <button type="button" onClick={addPage} className="rounded px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800">+ Add page</button>
            {pages.length > 1 && <button type="button" onClick={deletePage} className="rounded px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">Delete page</button>}
            <label className="ml-auto flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              Zoom
              <select value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                {ZOOM_LEVELS.map((level) => <option key={level} value={level}>{Math.round(level * 100)}%</option>)}
              </select>
            </label>
          </div>

          <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
            {/* ── Left: blocks, template info, page setup, layers ── */}
            <aside className="h-fit space-y-5 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <Panel title="Add block">
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_TYPES.map((type) => (
                    <button key={type} type="button" onClick={() => addBlock(type)} className="rounded border border-slate-200 px-2 py-2 text-left text-xs font-semibold capitalize text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:text-slate-300">
                      + {type}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Template">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name<input value={name} maxLength={120} onChange={(event) => { setName(event.target.value); setDirty(true); }} className={INPUT} /></label>
                <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Document type
                  <select value={documentType} onChange={(event) => { setDocumentType(event.target.value); setDirty(true); }} className={INPUT}>
                    {TEMPLATE_DOCUMENT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                    {!TEMPLATE_DOCUMENT_TYPES.some((type) => type.value === documentType) && <option value={documentType}>{documentType}</option>}
                  </select>
                </label>
                <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300">Description<textarea value={description} maxLength={500} onChange={(event) => { setDescription(event.target.value); setDirty(true); }} rows={2} className={INPUT} /></label>
              </Panel>

              <Panel title={`Page ${pages.indexOf(page) + 1} setup`}>
                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  Size
                  <select value={page.size} onChange={(event) => changePageSize(event.target.value as PageSize)} className={INPUT}>
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">Letter (8.5 × 11 in)</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>
                {page.size === "custom" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <NumberField label="Width (px)" value={page.width} min={MIN_PAGE_PX} max={MAX_PAGE_PX} onChange={(width) => updatePage({ width })} />
                    <NumberField label="Height (px)" value={page.height} min={MIN_PAGE_PX} max={MAX_PAGE_PX} onChange={(height) => updatePage({ height })} />
                  </div>
                )}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="text-sm text-slate-600 dark:text-slate-400">Background<input type="color" value={toHexColor(page.background, "#ffffff")} onChange={(event) => updatePage({ background: event.target.value })} className="mt-1 h-8 w-full" /></label>
                  <NumberField label="Margin guide" value={page.margin} min={0} max={Math.floor(page.width / 3)} onChange={(margin) => updatePage({ margin })} />
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" checked={page.grid.enabled} onChange={(event) => updatePage({ grid: { ...page.grid, enabled: event.target.checked } })} />Show grid</label>
                <label className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" checked={page.grid.snap} onChange={(event) => updatePage({ grid: { ...page.grid, snap: event.target.checked } })} />Snap to grid &amp; guides</label>
              </Panel>

              <Panel title="Layers">
                {layers.length === 0 ? <p className="text-xs text-slate-500">No blocks on this page yet.</p> : (
                  <ul className="space-y-1">
                    {layers.map((block) => (
                      <li key={block.id} className={`flex items-center gap-1 rounded px-1.5 py-1 text-xs ${block.id === selectedId ? "bg-blue-50 dark:bg-blue-950/50" : ""}`}>
                        <button type="button" onClick={() => setSelectedId(block.id)} className="min-w-0 flex-1 truncate text-left font-medium capitalize text-slate-700 dark:text-slate-300">
                          {block.type}{block.content && !block.content.startsWith("data:") ? ` — ${block.content.split("\n")[0]}` : ""}
                        </button>
                        <button type="button" onClick={() => changeBlock(block.id, { visible: !block.visible })} aria-label={block.visible ? "Hide block" : "Show block"} title={block.visible ? "Hide" : "Show"} className="px-1 font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">{block.visible ? "Hide" : "Show"}</button>
                        <button type="button" onClick={() => changeBlock(block.id, { locked: !block.locked })} aria-label={block.locked ? "Unlock block" : "Lock block"} title={block.locked ? "Unlock" : "Lock"} className="px-1 font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">{block.locked ? "Unlock" : "Lock"}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </aside>

            {/* ── Canvas ── */}
            <section className="overflow-auto border border-slate-300 bg-slate-200 p-5 dark:border-slate-700 dark:bg-slate-800" aria-label="Page canvas">
              <div style={{ width: page.width * zoom, height: page.height * zoom }} className="mx-auto">
                <div
                  tabIndex={0}
                  onKeyDown={handleCanvasKey}
                  onPointerDown={() => setSelectedId(null)}
                  className="relative origin-top-left shadow-xl outline-none"
                  style={{
                    width: page.width,
                    height: page.height,
                    transform: `scale(${zoom})`,
                    background: page.background,
                    backgroundImage: page.grid.enabled ? "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)" : undefined,
                    backgroundSize: page.grid.enabled ? `${page.grid.size}px ${page.grid.size}px` : undefined,
                    overflow: "hidden",
                  }}
                >
                  {page.margin > 0 && <div className="pointer-events-none absolute border border-dashed border-blue-300/60" style={{ left: page.margin, top: page.margin, right: page.margin, bottom: page.margin }} />}

                  {pageBlocks.filter((block) => block.visible).sort((a, b) => a.zIndex - b.zIndex).map((block) => {
                    const isSelected = block.id === selectedId;
                    return (
                      <div
                        key={block.id}
                        role="button"
                        tabIndex={-1}
                        aria-label={`${block.type} block${block.locked ? " (locked)" : ""}`}
                        onPointerDown={(event) => startInteraction(event, block, "move")}
                        onPointerMove={moveInteraction}
                        onPointerUp={endInteraction}
                        onPointerCancel={endInteraction}
                        style={{ ...blockFrameStyle(block), touchAction: "none", cursor: block.locked ? "default" : "move", outline: isSelected ? "2px solid #3b82f6" : undefined, outlineOffset: 1 }}
                        className={isSelected ? "" : "hover:outline hover:outline-1 hover:outline-blue-300"}
                      >
                        <VisualBlockContent block={block} editor />
                        {isSelected && !block.locked && (["e", "s", "se"] as const).map((handle) => (
                          <span
                            key={handle}
                            aria-hidden="true"
                            onPointerDown={(event) => startInteraction(event, block, "resize", handle)}
                            onPointerMove={moveInteraction}
                            onPointerUp={endInteraction}
                            onPointerCancel={endInteraction}
                            className="absolute z-10 rounded-full border border-white bg-blue-600 shadow-sm"
                            style={{
                              width: 10 / zoom,
                              height: 10 / zoom,
                              cursor: handle === "e" ? "ew-resize" : handle === "s" ? "ns-resize" : "nwse-resize",
                              ...(handle === "e" ? { right: -5 / zoom, top: `calc(50% - ${5 / zoom}px)` } : handle === "s" ? { bottom: -5 / zoom, left: `calc(50% - ${5 / zoom}px)` } : { right: -5 / zoom, bottom: -5 / zoom }),
                            }}
                          />
                        ))}
                      </div>
                    );
                  })}

                  {guideLines.map((line) => (
                    <div
                      key={`${line.axis}-${line.position}`}
                      className="pointer-events-none absolute bg-fuchsia-500"
                      style={line.axis === "x" ? { left: line.position, top: 0, bottom: 0, width: 1 } : { top: line.position, left: 0, right: 0, height: 1 }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">Drag to move · drag the blue handles to resize · arrow keys nudge (Shift = 10px) · Delete removes · Ctrl/⌘+D duplicates</p>
            </section>

            {/* ── Right: properties ── */}
            <aside className="h-fit border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-bold text-slate-900 dark:text-slate-50">Properties</h2>
              {selected ? (
                <div className="mt-4 space-y-4">
                  <p className="text-xs uppercase text-slate-400">{selected.type} on page {pages.findIndex((item) => item.id === selected.pageId) + 1}{selected.locked ? " · locked" : ""}</p>

                  {(selected.type === "text" || selected.type === "heading" || selected.type === "signature" || selected.type === "table") && (
                    <label className="block text-sm text-slate-600 dark:text-slate-400">
                      {selected.type === "table" ? "Rows (one per line, cells separated by |)" : selected.type === "signature" ? "Label under the line" : "Text"}
                      <textarea value={selected.content} onChange={(event) => changeBlock(selected.id, { content: event.target.value })} rows={selected.type === "table" ? 5 : 3} className={INPUT} />
                    </label>
                  )}

                  {(selected.type === "image" || selected.type === "logo") && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <label className="block">
                        Image file
                        <input type="file" accept="image/*" onChange={(event) => { void uploadImage(event.target.files?.[0]); event.target.value = ""; }} className="mt-1 block w-full text-xs" />
                      </label>
                      {selected.content && <button type="button" onClick={() => changeBlock(selected.id, { content: "" })} className="mt-2 text-xs font-semibold text-red-600">Remove image</button>}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <NumberField label="X" value={selected.x} onChange={(x) => changeBlock(selected.id, { x })} />
                    <NumberField label="Y" value={selected.y} onChange={(y) => changeBlock(selected.id, { y })} />
                    <NumberField label="Width" value={selected.width} min={1} max={MAX_PAGE_PX} onChange={(width) => changeBlock(selected.id, { width })} />
                    <NumberField label="Height" value={selected.height} min={1} max={MAX_PAGE_PX} onChange={(height) => changeBlock(selected.id, { height })} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Arrange</p>
                    <div className="mt-1 grid grid-cols-4 gap-1 text-xs">
                      {([["front", "Front"], ["forward", "Up"], ["backward", "Down"], ["back", "Back"]] as const).map(([direction, label]) => (
                        <button key={direction} type="button" onClick={() => arrange(direction)} className="rounded border border-slate-200 px-1 py-1.5 font-semibold text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:text-slate-300">{label}</button>
                      ))}
                    </div>
                  </div>

                  {TEXT_BLOCKS.includes(selected.type) && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <label className="text-sm text-slate-600 dark:text-slate-400">
                          Font
                          <select value={selected.style.fontFamily ?? "Arial"} onChange={(event) => changeStyle({ fontFamily: event.target.value })} className={INPUT}>
                            {BLOCK_FONTS.map((font) => <option key={font} value={font}>{font}</option>)}
                          </select>
                        </label>
                        <NumberField label="Size (px)" value={selected.style.fontSize ?? 14} min={6} max={200} onChange={(fontSize) => changeStyle({ fontSize })} />
                      </div>
                      <div className="flex items-center gap-1">
                        <ToggleButton active={(selected.style.fontWeight ?? 400) >= 600} onClick={() => changeStyle({ fontWeight: (selected.style.fontWeight ?? 400) >= 600 ? 400 : 700 })}><strong>B</strong></ToggleButton>
                        {(["left", "center", "right"] as const).map((align) => (
                          <ToggleButton key={align} active={(selected.style.align ?? "left") === align} onClick={() => changeStyle({ align })}>{align[0].toUpperCase() + align.slice(1)}</ToggleButton>
                        ))}
                      </div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400">Text color<input type="color" value={toHexColor(selected.style.color, "#172033")} onChange={(event) => changeStyle({ color: event.target.value })} className="mt-1 h-8 w-full" /></label>
                    </div>
                  )}

                  {FILL_BLOCKS.includes(selected.type) && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>Fill</span>
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!selected.style.backgroundColor || selected.style.backgroundColor === "transparent"} onChange={(event) => changeStyle({ backgroundColor: event.target.checked ? "transparent" : "#e4e9f2" })} />None</label>
                      </div>
                      <input type="color" value={toHexColor(selected.style.backgroundColor, "#ffffff")} onChange={(event) => changeStyle({ backgroundColor: event.target.value })} className="mt-1 h-8 w-full" />
                    </div>
                  )}

                  {(BORDER_BLOCKS.includes(selected.type) || selected.type === "divider" || selected.type === "signature") && (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400">{selected.type === "divider" ? "Line color" : "Border color"}<input type="color" value={toHexColor(selected.style.borderColor, "#172033")} onChange={(event) => changeStyle({ borderColor: event.target.value })} className="mt-1 h-8 w-full" /></label>
                      {BORDER_BLOCKS.includes(selected.type) && <NumberField label="Border (px)" value={selected.style.borderWidth ?? 0} min={0} max={40} onChange={(borderWidth) => changeStyle({ borderWidth })} />}
                      {(selected.type === "shape" || selected.type === "text" || selected.type === "heading") && <NumberField label="Radius (px)" value={selected.style.borderRadius ?? 0} min={0} max={500} onChange={(borderRadius) => changeStyle({ borderRadius })} />}
                    </div>
                  )}

                  <label className="block text-sm text-slate-600 dark:text-slate-400">
                    Opacity ({Math.round((selected.style.opacity ?? 1) * 100)}%)
                    <input type="range" min={0.1} max={1} step={0.05} value={selected.style.opacity ?? 1} onChange={(event) => changeStyle({ opacity: Number(event.target.value) })} className="mt-1 w-full" />
                  </label>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" checked={selected.visible} onChange={(event) => changeBlock(selected.id, { visible: event.target.checked })} />Visible</label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" checked={selected.locked} onChange={(event) => changeBlock(selected.id, { locked: event.target.checked })} />Locked</label>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={duplicateSelected} className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Duplicate</button>
                    <button type="button" onClick={removeSelected} className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">Delete</button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Select a block on the canvas or in Layers to edit its content, position, size, and style.</p>
              )}
              <p className="mt-6 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Export PDF opens the print dialog — choose “Save as PDF”. Word export keeps text editable; rounded corners and transparency are not supported by Word.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-bold text-slate-900 dark:text-slate-50">{title}</h2>
      {children}
    </section>
  );
}

function NumberField({ label, value, onChange, min = -MAX_PAGE_PX, max = MAX_PAGE_PX }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  // Keeps the raw text while typing so partial values (e.g. "5" on the way to "500") aren't clamped mid-entry.
  const [draft, setDraft] = useState<string | null>(null);
  const commit = (raw: string) => {
    onChange(Math.min(max, Math.max(min, finite(raw, value))));
    setDraft(null);
  };
  return (
    <label className="text-sm text-slate-600 dark:text-slate-400">
      {label}
      <input
        type="number"
        value={draft ?? String(Math.round(value))}
        min={min}
        max={max}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          const parsed = Number(raw);
          if (raw.trim() !== "" && Number.isFinite(parsed) && parsed >= min && parsed <= max) onChange(parsed);
        }}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => { if (event.key === "Enter") commit(event.currentTarget.value); }}
        className={INPUT}
      />
    </label>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`rounded border px-2.5 py-1 text-xs font-semibold ${active ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>
      {children}
    </button>
  );
}
