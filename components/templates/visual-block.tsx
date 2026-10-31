import type { CSSProperties } from "react";
import type { BlockDefinition, PageDefinition } from "@/types/visual-document";
import { BLOCK_PADDING_PX, parseTable } from "@/lib/visual/visual-model";

/** Absolute position, size and stacking of a block on its page (CSS px). */
export function blockFrameStyle(block: BlockDefinition): CSSProperties {
  return {
    position: "absolute",
    left: block.x,
    top: block.y,
    width: block.width,
    height: block.height,
    zIndex: block.zIndex,
    opacity: block.style.opacity ?? 1,
  };
}

const transparent = (color: string | undefined) => !color || color === "transparent";

/**
 * Renders a block's content inside its frame. Shared by the editor canvas and
 * the print/PDF pages so both show exactly the same design. `editor` adds
 * placeholders for empty images and an outline for spacers.
 */
export function VisualBlockContent({ block, editor = false }: { block: BlockDefinition; editor?: boolean }) {
  const { style } = block;
  const text: CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    textAlign: style.align,
    lineHeight: 1.3,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
  const box: CSSProperties = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    boxSizing: "border-box",
    backgroundColor: transparent(style.backgroundColor) ? undefined : style.backgroundColor,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor ?? "#000"}` : undefined,
    borderRadius: style.borderRadius || undefined,
  };

  switch (block.type) {
    case "text":
    case "heading":
      return <div style={{ ...box, ...text, padding: BLOCK_PADDING_PX }}>{block.content}</div>;

    case "image":
    case "logo":
      return block.content.startsWith("data:image/") ? (
        // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL, not an optimizable asset
        <img src={block.content} alt={block.type === "logo" ? "Logo" : "Image"} style={{ ...box, objectFit: "contain", display: "block" }} draggable={false} />
      ) : editor ? (
        <div style={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", border: "1px dashed #94a3b8", color: "#64748b", fontSize: 12, fontFamily: "Arial" }}>
          {block.type === "logo" ? "Logo — upload in Properties" : "Image — upload in Properties"}
        </div>
      ) : null;

    case "table": {
      const rows = parseTable(block.content);
      const cellBorder = `${Math.max(1, style.borderWidth ?? 1)}px solid ${style.borderColor ?? "#94a3b8"}`;
      return (
        <div style={{ ...box, border: undefined }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", ...text }}>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ border: cellBorder, padding: "4px 6px", fontWeight: rowIndex === 0 ? 700 : style.fontWeight, verticalAlign: "top" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "divider":
      return <div style={{ width: "100%", height: "100%", backgroundColor: style.borderColor ?? style.color ?? "#172033", borderRadius: style.borderRadius || undefined }} />;

    case "shape":
      return <div style={{ ...box, backgroundColor: style.backgroundColor ?? "#e4e9f2" }} />;

    case "signature":
      return (
        <div style={{ ...box, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: `0 ${BLOCK_PADDING_PX}px` }}>
          <div style={{ ...text, borderTop: `1px solid ${style.borderColor ?? "#172033"}`, paddingTop: 4 }}>{block.content}</div>
        </div>
      );

    case "spacer":
      return editor ? <div style={{ width: "100%", height: "100%", border: "1px dashed #cbd5e1" }} /> : null;

    default:
      return null;
  }
}

/** All pages at true size, rendered only when printing ("Save as PDF"). */
export function VisualPrintPages({ pages, blocks }: { pages: PageDefinition[]; blocks: BlockDefinition[] }) {
  return (
    <div className="visual-print-root hidden print:block">
      {pages.map((page, index) => (
        <div
          key={page.id}
          style={{
            position: "relative",
            width: page.width,
            height: page.height,
            overflow: "hidden",
            background: page.background,
            breakAfter: index < pages.length - 1 ? "page" : "auto",
            pageBreakAfter: index < pages.length - 1 ? "always" : "auto",
            page: `visual-page-${index}`,
          } as CSSProperties}
        >
          {blocks
            .filter((block) => block.pageId === page.id && block.visible)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((block) => (
              <div key={block.id} style={blockFrameStyle(block)}>
                <VisualBlockContent block={block} />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

/** `@page` rules giving every printed page its own paper size (named pages). */
export function visualPrintPageCss(pages: PageDefinition[]): string {
  const first = pages[0];
  return [
    `@page { size: ${first.width}px ${first.height}px; margin: 0; }`,
    ...pages.map((page, index) => `@page visual-page-${index} { size: ${page.width}px ${page.height}px; margin: 0; }`),
    "html, body { background: #ffffff !important; }",
  ].join("\n");
}
