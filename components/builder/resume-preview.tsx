"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { useResumeContext } from "@/context/resume-context";
import { COUNTRIES } from "@/lib/countries";
import { getTemplate } from "@/lib/templates";
import { getFont } from "@/lib/fonts";
import { countResumeWords } from "@/lib/statistics";
import {
  CONTENT_HEIGHT_MM, CONTENT_WIDTH_MM, MARGIN_MM, PAGE_HEIGHT_MM, PAGE_WIDTH_MM,
  SIDEBAR_GAP_MM, SIDEBAR_MAIN_WIDTH_RATIO, SIDEBAR_RAIL_WIDTH_RATIO, TEMPLATE_THEMES,
  buildTemplateBlocks, hasEducationContent, hasExperienceContent, normalizeUrl, paginateBlocks,
  type PreviewBlock,
} from "@/lib/resume-blocks";
import {
  nameStyle, headlineStyle, contactStyle, linkStyle, TEXT_COLOR,
} from "@/lib/resume-typography";
import type { ReactNode } from "react";

/* ════════════════════════════════════════════════════════════════
 * useResumePages — single source of truth for resume layout
 *
 * Builds blocks, measures them in a hidden container, paginates,
 * and returns everything both ResumePreview and ResumeAllPages need.
 * ════════════════════════════════════════════════════════════════ */

export interface UseResumePagesResult {
  isEmpty: boolean;
  headerNode: ReactNode;
  pages: PreviewBlock[][];
  railBlocks: PreviewBlock[];
  isSidebar: boolean;
  fontStack: string;
  contactLine: string;
  links: { id: string; name: string; url: string }[];
  measureWidthMM: number;
  wordCount: number;
  /** Render this off-screen measuring container exactly once in the DOM. */
  measuringContainer: ReactNode;
}

export function useResumePages(): UseResumePagesResult {
  const { state } = useResumeContext();
  const { resume, selectedTemplateId, selectedFontId } = state;
  const templateId = getTemplate(selectedTemplateId).id;
  const theme = TEMPLATE_THEMES[templateId];
  const fontStack = getFont(selectedFontId).stack;

  const { personalDetails: personal, professionalSummary } = resume;

  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const dial = COUNTRIES.find((country) => country.code === personal.contact.phoneCountry)?.dial ?? "+63";
  const phoneLine = personal.contact.phoneNumber ? `${dial} ${personal.contact.phoneNumber}` : "";
  const contactLine = [personal.contact.location, personal.contact.email, phoneLine].filter(Boolean).join("  •  ");
  const links = personal.links.filter((link) => link.name.trim() && link.url.trim());

  const experiencesPresent = resume.experiences.some(hasExperienceContent);
  const educationPresent = resume.education.some(hasEducationContent);
  const skillsPresent = resume.skills.length > 0;
  const isEmpty = !fullName && !personal.headline.trim() && !contactLine && links.length === 0 && !professionalSummary.trim() && !experiencesPresent && !educationPresent && !skillsPresent;

  const { main: mainBlocks, rail: railBlocks } = useMemo(
    () => buildTemplateBlocks(resume, templateId),
    [resume, templateId]
  );
  const isSidebar = railBlocks.length > 0;
  const wordCount = useMemo(() => countResumeWords(resume), [resume]);

  const headerNode = fullName || personal.headline.trim() || contactLine || links.length > 0
    ? (
      <header style={{ borderBottom: "1px solid #000", paddingBottom: "10px", textAlign: theme.headerAlign === "center" ? "center" : "left" }}>
        {fullName && <h2 style={nameStyle}>{fullName}</h2>}
        {personal.headline.trim() && <p style={{ ...headlineStyle, marginTop: "4px" }}>{personal.headline}</p>}
        {!isSidebar && contactLine && <p style={{ ...contactStyle, marginTop: "6px" }}>{contactLine}</p>}
        {!isSidebar && links.length > 0 && (
          <p style={{ ...contactStyle, marginTop: "2px" }}>
            {links.map((link, index) => (
              <span key={link.id}>
                {index > 0 && "  •  "}
                <a href={normalizeUrl(link.url)} target="_blank" rel="noreferrer" style={linkStyle}>{link.name}</a>
              </span>
            ))}
          </p>
        )}
      </header>
    )
    : null;

  const headerMeasureRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PreviewBlock[][]>([[]]);

  const measureWidthMM = isSidebar ? CONTENT_WIDTH_MM * SIDEBAR_MAIN_WIDTH_RATIO - SIDEBAR_GAP_MM / 2 : CONTENT_WIDTH_MM;

  useIsomorphicLayoutEffect(() => {
    if (isEmpty) return;
    const heights: Record<string, number> = {};
    const container = measureRef.current;
    if (container) {
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((child, index) => {
        const nextTop = index < children.length - 1 ? children[index + 1].offsetTop : container.scrollHeight;
        const block = mainBlocks[index];
        if (block) heights[block.id] = nextTop - child.offsetTop;
      });
    }
    const headerHeight = headerMeasureRef.current?.offsetHeight ?? 0;
    const contentHeight = contentAreaRef.current?.offsetHeight ?? 1;
    setPages(paginateBlocks(mainBlocks, heights, headerHeight, contentHeight));
  }, [mainBlocks, isEmpty]);

  /* Off-screen measuring container — rendered once in the component that
     first mounts (ResumePreview). Both preview and print use the SAME
     pagination result from this hook instance. */
  const measuringContainer = (
    <div aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: `${measureWidthMM}mm`, fontFamily: fontStack }}>
      <div ref={headerMeasureRef} style={{ overflow: "hidden" }}>{headerNode}</div>
      <div ref={measureRef} style={{ overflow: "hidden" }}>
        {mainBlocks.map((block) => (
          <div key={block.id}>{block.node}</div>
        ))}
      </div>
      <div ref={contentAreaRef} style={{ height: `${CONTENT_HEIGHT_MM}mm` }} />
    </div>
  );

  return { isEmpty, headerNode, pages, railBlocks, isSidebar, fontStack, contactLine, links, measureWidthMM, wordCount, measuringContainer };
}

/* ════════════════════════════════════════════════════════════════
 * ResumePageContent — renders the body content of a single page
 *
 * Shared between A4Page (scaled preview) and print pages.
 * ════════════════════════════════════════════════════════════════ */

function ResumePageContent({
  pageIndex, pageBlocks, headerNode, isSidebar, contactLine, links, railBlocks, measureWidthMM,
}: {
  pageIndex: number;
  pageBlocks: PreviewBlock[];
  headerNode: ReactNode;
  isSidebar: boolean;
  contactLine: string;
  links: { id: string; name: string; url: string }[];
  railBlocks: PreviewBlock[];
  measureWidthMM: number;
}) {
  return (
    <>
      {pageIndex === 0 && headerNode}
      {isSidebar ? (
        <div className="mt-3 flex" style={{ gap: `${SIDEBAR_GAP_MM}mm` }}>
          {pageIndex === 0 && (
            <aside style={{ width: `${CONTENT_WIDTH_MM * SIDEBAR_RAIL_WIDTH_RATIO}mm` }} className="shrink-0 rounded-lg bg-blue-50/60 p-3">
              {contactLine && <p style={{ ...contactStyle, lineHeight: "1.6" }}>{contactLine}</p>}
              {links.length > 0 && (
                <div style={{ marginTop: "4px" }}>
                  {links.map((link) => (
                    <a key={link.id} href={normalizeUrl(link.url)} target="_blank" rel="noreferrer" style={{ ...linkStyle, display: "block", lineHeight: "1.6" }}>{link.name}</a>
                  ))}
                </div>
              )}
              {railBlocks.map((block) => (
                <div key={block.id} className="mt-3 first:mt-0">{block.node}</div>
              ))}
            </aside>
          )}
          <div style={{ width: `${measureWidthMM}mm` }} className="min-w-0">
            {pageBlocks.map((block, index) => (
              <div key={block.id} style={pageIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>
                {block.node}
              </div>
            ))}
          </div>
        </div>
      ) : (
        pageBlocks.map((block, index) => (
          <div key={block.id} style={pageIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>
            {block.node}
          </div>
        ))
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
 * A4Page — scales a 210×297 mm page to fit its container
 * ════════════════════════════════════════════════════════════════ */

/** Renders one A4 sheet, scaled uniformly (never stretched) to fit its container. */
function A4Page({ children, fontStack }: { children: ReactNode; fontStack: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const [naturalWidthPx, setNaturalWidthPx] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (sizerRef.current) setNaturalWidthPx(sizerRef.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !naturalWidthPx) return;
    const naturalHeightPx = naturalWidthPx * (PAGE_HEIGHT_MM / PAGE_WIDTH_MM);
    const update = () => {
      const widthScale = box.clientWidth / naturalWidthPx;
      const heightScale = box.clientHeight / naturalHeightPx;
      setScale(Math.max(0.05, Math.min(1, widthScale, heightScale)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, [naturalWidthPx]);

  const scaledWidthPx = naturalWidthPx ? naturalWidthPx * scale : 0;
  const scaledHeightPx = naturalWidthPx ? naturalWidthPx * (PAGE_HEIGHT_MM / PAGE_WIDTH_MM) * scale : 0;

  return (
    <div ref={boxRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div ref={sizerRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: `${PAGE_WIDTH_MM}mm`, height: 0, overflow: "hidden" }} />
      <div style={{ width: scaledWidthPx || undefined, height: scaledHeightPx || undefined, position: "relative", flexShrink: 0 }}>
        <div
          className="bg-white shadow-md ring-1 ring-slate-200"
          style={{ width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm`, transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}
        >
          <div style={{ height: "100%", width: "100%", overflow: "hidden", padding: `${MARGIN_MM}mm`, fontFamily: fontStack, color: TEXT_COLOR }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
 * Navigation helpers
 * ════════════════════════════════════════════════════════════════ */

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d={direction === "prev" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} />
    </svg>
  );
}

function PageNavButton({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════
 * ResumePreview — interactive, scaled, single-page preview
 * ════════════════════════════════════════════════════════════════ */

export interface ResumePreviewProps {
  resumePages: UseResumePagesResult;
  pageIndex: number;
  onPageIndexChange: (index: number) => void;
  maxHeight?: string;
  /** When true, page navigation and word count are not rendered. */
  hideFooter?: boolean;
  /** When true, only the page navigation and word count are rendered (no resume paper). */
  footerOnly?: boolean;
  className?: string;
}

export function ResumePreview({ resumePages, pageIndex, onPageIndexChange, maxHeight = "70vh", hideFooter, footerOnly, className }: ResumePreviewProps) {
  const { isEmpty, headerNode, pages, railBlocks, isSidebar, fontStack, contactLine, links, measureWidthMM, wordCount, measuringContainer } = resumePages;

  useEffect(() => {
    if (pageIndex > pages.length - 1) onPageIndexChange(Math.max(0, pages.length - 1));
  }, [pages, pageIndex, onPageIndexChange]);

  const pageCount = pages.length;
  const safeIndex = Math.min(pageIndex, pageCount - 1);

  /* ── Footer-only mode: render just the page nav + word count ── */
  if (footerOnly) {
    if (isEmpty) return null;
    return (
      <div>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          {pageCount > 1 && <PageNavButton direction="prev" onClick={() => onPageIndexChange(Math.max(0, safeIndex - 1))} disabled={safeIndex === 0} />}
          <span>Page {safeIndex + 1} of {pageCount}</span>
          {pageCount > 1 && <PageNavButton direction="next" onClick={() => onPageIndexChange(Math.min(pageCount - 1, safeIndex + 1))} disabled={safeIndex >= pageCount - 1} />}
        </div>
        <p className="mt-1 text-center text-xs text-slate-400">{wordCount} {wordCount === 1 ? "word" : "words"}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">Your resume preview will appear here</p>
        <p className="mt-1 text-xs text-slate-400">Start filling out the form to see it come together.</p>
      </div>
    );
  }

  const currentBlocks = pages[safeIndex] ?? [];

  return (
    <div className={className ? `${className} flex flex-col` : "flex flex-col"}>
      {measuringContainer}

      <div 
        className={`w-full flex items-center justify-center ${maxHeight !== "none" ? "flex-1 min-h-0" : ""}`} 
        style={{ maxHeight: maxHeight === "none" ? undefined : maxHeight }}
      >
        <div 
          className={`w-full flex items-center justify-center ${maxHeight !== "none" ? "h-full" : ""}`} 
          style={{ aspectRatio: maxHeight !== "100%" ? `${PAGE_WIDTH_MM} / ${PAGE_HEIGHT_MM}` : undefined }}
        >
          <A4Page fontStack={fontStack}>
            <ResumePageContent
              pageIndex={safeIndex}
              pageBlocks={currentBlocks}
              headerNode={headerNode}
              isSidebar={isSidebar}
              contactLine={contactLine}
              links={links}
              railBlocks={railBlocks}
              measureWidthMM={measureWidthMM}
            />
          </A4Page>
        </div>
      </div>

      {!hideFooter && (
        <>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            {pageCount > 1 && <PageNavButton direction="prev" onClick={() => onPageIndexChange(Math.max(0, safeIndex - 1))} disabled={safeIndex === 0} />}
            <span>Page {safeIndex + 1} of {pageCount}</span>
            {pageCount > 1 && <PageNavButton direction="next" onClick={() => onPageIndexChange(Math.min(pageCount - 1, safeIndex + 1))} disabled={safeIndex >= pageCount - 1} />}
          </div>
          <p className="mt-1 text-center text-xs text-slate-400">{wordCount} {wordCount === 1 ? "word" : "words"}</p>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
 * ResumeAllPages — print-only, full-fidelity, all pages at true
 * A4 size. Uses the SAME useResumePages() hook so pagination is
 * identical to the interactive preview.
 *
 * Replaces the old ResumePrintView that had its own independent
 * block building + measurement + pagination.
 * ════════════════════════════════════════════════════════════════ */

export function ResumeAllPages() {
  const { isEmpty, headerNode, pages, railBlocks, isSidebar, fontStack, contactLine, links, measureWidthMM, measuringContainer } = useResumePages();

  if (isEmpty) return null;

  return (
    <div className="print-only hidden print:block" style={{ fontFamily: fontStack }}>
      {/* Measuring container for this instance of the hook */}
      {measuringContainer}

      {pages.map((pageBlocks, pageIndex) => (
        <div
          key={pageIndex}
          style={{
            height: `${PAGE_HEIGHT_MM}mm`,
            width: `${PAGE_WIDTH_MM}mm`,
            padding: `${MARGIN_MM}mm`,
            boxSizing: "border-box",
            overflow: "hidden",
            color: TEXT_COLOR,
            fontFamily: fontStack,
            breakAfter: pageIndex < pages.length - 1 ? "page" : "auto",
            pageBreakAfter: pageIndex < pages.length - 1 ? "always" : "auto",
          }}
        >
          <ResumePageContent
            pageIndex={pageIndex}
            pageBlocks={pageBlocks}
            headerNode={headerNode}
            isSidebar={isSidebar}
            contactLine={contactLine}
            links={links}
            railBlocks={railBlocks}
            measureWidthMM={measureWidthMM}
          />
        </div>
      ))}
    </div>
  );
}