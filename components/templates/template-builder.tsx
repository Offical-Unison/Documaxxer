"use client";

import { useState, type PointerEvent } from "react";
import type {
  BlockDefinition,
  BlockType,
  PageDefinition,
  PageSize,
  VisualTemplateDefinition,
} from "@/types/visual-document";

const pageSizes = {
  a4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
};

const blockTypes: BlockType[] = [
  "text",
  "heading",
  "image",
  "logo",
  "table",
  "divider",
  "shape",
  "signature",
  "spacer",
];

const defaults: Record<BlockType, { content: string; height: number }> = {
  text: { content: "Body text", height: 56 },
  heading: { content: "Section heading", height: 48 },
  image: { content: "Image placeholder", height: 150 },
  logo: { content: "Logo placeholder", height: 80 },
  table: { content: "Table placeholder", height: 120 },
  divider: { content: "", height: 4 },
  shape: { content: "", height: 80 },
  signature: { content: "Signature", height: 48 },
  spacer: { content: "", height: 24 },
};

function makePage(size: PageSize, index: number): PageDefinition {
  const dimensions = size === "custom" ? pageSizes.a4 : pageSizes[size];

  return {
    id: `page-${Date.now()}-${index}`,
    width: dimensions.width,
    height: dimensions.height,
    size,
    background: "#ffffff",
    margin: 40,
    grid: { enabled: true, size: 10, snap: true },
    overflow: "clip",
  };
}

function makeBlock(type: BlockType, pageId: string, index: number): BlockDefinition {
  const item = defaults[type];

  return {
    id: `block-${Date.now()}-${index}`,
    type,
    pageId,
    x: 60,
    y: 70 + index * 70,
    width: 674,
    height: item.height,
    zIndex: index,
    visible: true,
    locked: false,
    content: item.content,
    style: {
      fontFamily: "Arial",
      fontSize: type === "heading" ? 22 : 14,
      fontWeight: type === "heading" ? 700 : 400,
      color: "#172033",
      backgroundColor: type === "shape" ? "#e4e9f2" : "transparent",
      align: "left",
    },
  };
}

export function TemplateBuilder() {
  const [name, setName] = useState("My document template");
  const [description, setDescription] = useState("");
  const [documentType, setDocumentType] = useState("business-document");
  const [pages, setPages] = useState<PageDefinition[]>([makePage("a4", 0)]);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const [blocks, setBlocks] = useState<BlockDefinition[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizing, setResizing] = useState<{
    id: string;
    handle: "se" | "s" | "e";
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const page = pages.find((item) => item.id === activePageId) ?? pages[0];
  const selected = blocks.find((block) => block.id === selectedId) ?? null;
  const gridBackgroundImage = page.grid.enabled
    ? "linear-gradient(#d9e0eb 1px, transparent 1px), linear-gradient(90deg, #d9e0eb 1px, transparent 1px)"
    : undefined;
  const gridBackgroundSize = page.grid.enabled ? `${page.grid.size}px ${page.grid.size}px` : undefined;
  const alignmentGuideThreshold = 8;

  function getGuidePositions(block: BlockDefinition) {
    const otherBlocks = blocks.filter((item) => item.id !== block.id && item.pageId === page.id && item.visible);

    return [
      0,
      page.margin,
      page.width / 2,
      page.width - page.margin,
      page.width,
      ...otherBlocks.flatMap((item) => [item.x, item.x + item.width]),
      ...otherBlocks.flatMap((item) => [item.y, item.y + item.height]),
    ];
  }

  function applyGuideSnap(value: number, axis: "x" | "y", block: BlockDefinition) {
    if (!page.grid.snap) return value;

    const guidePositions = getGuidePositions(block);
    const values =
      axis === "x"
        ? guidePositions.filter((candidate) => candidate >= 0 && candidate <= page.width)
        : guidePositions.filter((candidate) => candidate >= 0 && candidate <= page.height);

    let snapped = value;
    let smallestDistance = Number.POSITIVE_INFINITY;

    for (const candidate of values) {
      const distance = Math.abs(value - candidate);
      if (distance <= alignmentGuideThreshold && distance < smallestDistance) {
        snapped = candidate;
        smallestDistance = distance;
      }
    }

    return snapped;
  }

  function getGuideLines(block: BlockDefinition | null) {
    if (!block) return [];

    const guidePositions = getGuidePositions(block);
    const lines: Array<{ axis: "x" | "y"; position: number }> = [];

    for (const candidate of guidePositions) {
      const xMatches = Math.abs(block.x - candidate) <= alignmentGuideThreshold;
      const xCenterMatches = Math.abs(block.x + block.width / 2 - candidate) <= alignmentGuideThreshold;
      const yMatches = Math.abs(block.y - candidate) <= alignmentGuideThreshold;
      const yCenterMatches = Math.abs(block.y + block.height / 2 - candidate) <= alignmentGuideThreshold;

      if (xMatches || xCenterMatches) {
        lines.push({ axis: "x", position: candidate });
      }

      if (yMatches || yCenterMatches) {
        lines.push({ axis: "y", position: candidate });
      }
    }

    return lines.filter(
      (line, index, collection) =>
        collection.findIndex((entry) => entry.axis === line.axis && entry.position === line.position) === index,
    );
  }

  function updatePage(update: Partial<PageDefinition>) {
    setPages((current) => current.map((item) => (item.id === page.id ? { ...item, ...update } : item)));
  }

  function addBlock(type: BlockType) {
    const block = makeBlock(type, page.id, blocks.length);
    setBlocks((current) => [...current, block]);
    setSelectedId(block.id);
  }

  function updateSelected(update: Partial<BlockDefinition>) {
    setBlocks((current) => current.map((block) => (block.id === selectedId ? { ...block, ...update } : block)));
  }

  function updateStyle(key: keyof BlockDefinition["style"], value: string | number) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === selectedId ? { ...block, style: { ...block.style, [key]: value } } : block,
      ),
    );
  }

  function snap(value: number) {
    return page.grid.snap ? Math.round(value / page.grid.size) * page.grid.size : value;
  }

  function startDrag(event: PointerEvent<HTMLElement>, block: BlockDefinition) {
    if (block.locked) return;

    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    setSelectedId(block.id);
    setDragging({
      id: block.id,
      offsetX: event.clientX - bounds.left - block.x,
      offsetY: event.clientY - bounds.top - block.y,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (!dragging) return;

    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    const block = blocks.find((item) => item.id === dragging.id);
    if (!block) return;

    const nextX = Math.max(0, snap(event.clientX - bounds.left - dragging.offsetX));
    const nextY = Math.max(0, snap(event.clientY - bounds.top - dragging.offsetY));

    updateSelected({
      x: applyGuideSnap(nextX, "x", block),
      y: applyGuideSnap(nextY, "y", block),
    });
  }

  function startResize(
    event: PointerEvent<HTMLElement>,
    block: BlockDefinition,
    handle: "se" | "s" | "e",
  ) {
    if (block.locked) return;

    event.stopPropagation();
    setSelectedId(block.id);
    setResizing({
      id: block.id,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: block.width,
      startHeight: block.height,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveResize(event: PointerEvent<HTMLElement>) {
    if (!resizing) return;

    const block = blocks.find((item) => item.id === resizing.id);
    if (!block) return;

    const nextWidth = resizing.handle.includes("e")
      ? Math.min(Math.max(40, resizing.startWidth + (event.clientX - resizing.startX)), Math.max(40, page.width - block.x))
      : block.width;

    const nextHeight = resizing.handle.includes("s")
      ? Math.min(Math.max(24, resizing.startHeight + (event.clientY - resizing.startY)), Math.max(24, page.height - block.y))
      : block.height;

    const snappedWidth = snap(nextWidth);
    const snappedHeight = snap(nextHeight);

    updateSelected({
      width: Math.max(40, applyGuideSnap(snappedWidth, "x", block)),
      height: Math.max(24, applyGuideSnap(snappedHeight, "y", block)),
    });
  }

  function duplicateSelected() {
    if (!selected) return;

    const copy = {
      ...selected,
      id: `block-${Date.now()}`,
      x: Math.min(selected.x + page.grid.size * 2, page.width - selected.width),
      y: Math.min(selected.y + page.grid.size * 2, page.height - selected.height),
      zIndex: blocks.length,
    };

    setBlocks((current) => [...current, copy]);
    setSelectedId(copy.id);
  }

  function removeSelected() {
    setBlocks((current) => current.filter((block) => block.id !== selectedId));
    setSelectedId(null);
  }

  function addPage() {
    const nextPage = makePage(page.size, pages.length);
    setPages((current) => [...current, nextPage]);
    setActivePageId(nextPage.id);
  }

  const guideLines = getGuideLines(selected);

  async function saveTemplate() {
    if (!name.trim() || blocks.length === 0) {
      setMessage("Add a template name and at least one block.");
      return;
    }

    setSaving(true);
    setMessage("");

    const now = new Date().toISOString();
    const schema: VisualTemplateDefinition = {
      id: "custom",
      name: name.trim(),
      description: description.trim(),
      documentType,
      builtIn: false,
      pages,
      blocks,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: schema.name,
          description: schema.description,
          documentType,
          schema,
        }),
      });

      if (!response.ok) throw new Error();
      setMessage("Template saved.");
    } catch {
      setMessage("The template could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-slate-100 px-4 py-6 dark:bg-[#0B0F19] sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Visual template editor
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
              Design the page
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={addPage}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Add page
            </button>

            <select
              value={page.size}
              onChange={(event) => {
                const size = event.target.value as PageSize;
                const dimensions = size === "custom" ? pageSizes.a4 : pageSizes[size];
                updatePage({ size, width: dimensions.width, height: dimensions.height });
              }}
              aria-label="Page size"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="custom">Custom</option>
            </select>

            <button
              type="button"
              onClick={() => void saveTemplate()}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save template"}
            </button>
          </div>
        </header>

        <nav className="mb-4 flex gap-2 overflow-x-auto" aria-label="Pages">
          {pages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePageId(item.id)}
              className={`rounded px-3 py-1.5 text-sm font-semibold ${
                item.id === page.id ? "bg-blue-600 text-white" : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              Page {index + 1}
            </button>
          ))}
        </nav>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(500px,1fr)_280px]">
          <aside className="h-fit border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold text-slate-900 dark:text-slate-50">Blocks</h2>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {blockTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="rounded border border-slate-200 px-2 py-2 text-left text-xs font-semibold capitalize text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:text-slate-300"
                >
                  + {type}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Template name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>

            <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Document type
              <input
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>

            <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={page.grid.enabled}
                onChange={(event) => updatePage({ grid: { ...page.grid, enabled: event.target.checked } })}
              />
              Show grid
            </label>

            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={page.grid.snap}
                onChange={(event) => updatePage({ grid: { ...page.grid, snap: event.target.checked } })}
              />
              Snap to grid
            </label>
          </aside>

          <section className="overflow-auto border border-slate-300 bg-slate-200 p-5 dark:border-slate-700 dark:bg-slate-800">
            <div
              className="relative mx-auto shadow-xl"
              style={{
                width: page.width,
                height: page.height,
                maxWidth: "100%",
                aspectRatio: `${page.width}/${page.height}`,
                background: page.background,
                backgroundImage: gridBackgroundImage,
                backgroundSize: gridBackgroundSize,
              }}
            >
              <div className="absolute inset-0">
                {guideLines.map((line) =>
                  line.axis === "x" ? (
                    <div
                      key={`x-${line.position}`}
                      className="pointer-events-none absolute top-0 bottom-0 w-px bg-blue-500/80"
                      style={{
                        left: line.position,
                        boxShadow: "0 0 0 1px rgba(59,130,246,0.35)",
                      }}
                    />
                  ) : (
                    <div
                      key={`y-${line.position}`}
                      className="pointer-events-none absolute left-0 right-0 h-px bg-blue-500/80"
                      style={{
                        top: line.position,
                        boxShadow: "0 0 0 1px rgba(59,130,246,0.35)",
                      }}
                    />
                  ),
                )}
              </div>

              {blocks
                .filter((block) => block.pageId === page.id && block.visible)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((block) => (
                  <button
                    key={block.id}
                    type="button"
                    onPointerDown={(event) => startDrag(event, block)}
                    onPointerMove={moveDrag}
                    onPointerUp={() => {
                      setDragging(null);
                      setResizing(null);
                    }}
                    onClick={() => setSelectedId(block.id)}
                    className={`absolute overflow-hidden border-2 p-2 text-left ${
                      selectedId === block.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-transparent hover:border-blue-300"
                    }`}
                    style={{
                      left: block.x,
                      top: block.y,
                      width: block.width,
                      height: block.height,
                      zIndex: block.zIndex,
                      color: block.style.color,
                      backgroundColor: block.style.backgroundColor,
                      fontFamily: block.style.fontFamily,
                      fontSize: block.style.fontSize,
                      fontWeight: block.style.fontWeight,
                      textAlign: block.style.align,
                      opacity: block.style.opacity,
                      touchAction: "none",
                    }}
                  >
                    {block.content || block.type}
                    {selectedId === block.id && !block.locked ? (
                      <span
                        className="absolute -bottom-1 -right-1 z-10 flex h-3.5 w-3.5 cursor-se-resize items-center justify-center rounded-full border border-white bg-blue-600 shadow-sm"
                        onPointerDown={(event) => startResize(event, block, "se")}
                        onPointerMove={moveResize}
                        onPointerUp={() => setResizing(null)}
                        aria-label={`Resize ${block.type}`}
                      />
                    ) : null}
                  </button>
                ))}
            </div>
          </section>

          <aside className="h-fit border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold text-slate-900 dark:text-slate-50">Properties</h2>

            {selected ? (
              <div className="mt-4 space-y-3">
                <p className="text-xs uppercase text-slate-400">
                  {selected.type} on page {pages.findIndex((item) => item.id === selected.pageId) + 1}
                </p>

                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  Content
                  <textarea
                    value={selected.content}
                    onChange={(event) => updateSelected({ content: event.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(["x", "y", "width", "height", "zIndex"] as const).map((key) => (
                    <label key={key} className="text-sm capitalize text-slate-600 dark:text-slate-400">
                      {key}
                      <input
                        type="number"
                        value={selected[key]}
                        onChange={(event) => updateSelected({ [key]: Number(event.target.value) })}
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </label>
                  ))}
                </div>

                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  Font size
                  <input
                    type="number"
                    value={selected.style.fontSize}
                    onChange={(event) => updateStyle("fontSize", Number(event.target.value))}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>

                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  Text color
                  <input
                    type="color"
                    value={selected.style.color}
                    onChange={(event) => updateStyle("color", event.target.value)}
                    className="mt-1 h-9 w-full"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={selected.visible}
                    onChange={(event) => updateSelected({ visible: event.target.checked })}
                  />
                  Visible
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={selected.locked}
                    onChange={(event) => updateSelected({ locked: event.target.checked })}
                  />
                  Locked
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={duplicateSelected}
                    className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={removeSelected}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Select a block to edit its content, position, size, and style.
              </p>
            )}

            <p role="status" className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
