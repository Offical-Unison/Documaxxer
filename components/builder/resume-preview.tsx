"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useResumeContext } from "@/context/resume-context";
import { COUNTRIES } from "@/lib/countries";
import { getTemplate } from "@/lib/templates";
import { getFont } from "@/lib/fonts";
import { countResumeWords } from "@/lib/statistics";
import {
  CONTENT_HEIGHT_MM, CONTENT_WIDTH_MM, MARGIN_MM, PAGE_HEIGHT_MM, PAGE_WIDTH_MM,
  SIDEBAR_GAP_MM, SIDEBAR_MAIN_WIDTH_RATIO, SIDEBAR_RAIL_WIDTH_RATIO, TEMPLATE_THEMES,
  buildBlocks, hasEducationContent, hasExperienceContent, normalizeUrl, paginateBlocks, splitForSidebar,
  type PreviewBlock,
} from "@/lib/resume-blocks";
import type { ReactNode } from "react";

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
      <div ref={sizerRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: "210mm", height: 0, overflow: "hidden" }} />
      <div style={{ width: scaledWidthPx || undefined, height: scaledHeightPx || undefined, position: "relative", flexShrink: 0 }}>
        <div
          className="bg-white shadow-md ring-1 ring-slate-200"
          style={{ width: "210mm", height: "297mm", transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}
        >
          <div className="h-full w-full overflow-hidden text-slate-900" style={{ padding: `${MARGIN_MM}mm`, fontFamily: fontStack }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

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

export interface ResumePreviewProps {
  pageIndex: number;
  onPageIndexChange: (index: number) => void;
  maxHeight?: string;
}

export function ResumePreview({ pageIndex, onPageIndexChange, maxHeight = "70vh" }: ResumePreviewProps) {
  const { state } = useResumeContext();
  const { resume, selectedTemplateId, selectedFontId } = state;
  const templateId = getTemplate(selectedTemplateId).id;
  const theme = TEMPLATE_THEMES[templateId];
  const isSidebar = templateId === "sidebar";
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

  const headerNode = fullName || personal.headline.trim() || contactLine || links.length > 0
    ? (
      <header className={`border-b border-slate-300 pb-3 ${theme.headerAlign === "center" ? "text-center" : "text-left"}`}>
        {fullName && <h2 className="text-2xl font-bold tracking-tight text-slate-950">{fullName}</h2>}
        {personal.headline.trim() && <p className="mt-1 text-sm font-medium text-slate-600">{personal.headline}</p>}
        {!isSidebar && contactLine && <p className="mt-2 text-xs text-slate-500">{contactLine}</p>}
        {!isSidebar && links.length > 0 && (
          <p className="mt-0.5 text-xs text-slate-500">
            {links.map((link, index) => (
              <span key={link.id}>
                {index > 0 && "  •  "}
                <a href={normalizeUrl(link.url)} target="_blank" rel="noreferrer" className="text-blue-700 underline">{link.name}</a>
              </span>
            ))}
          </p>
        )}
      </header>
    )
    : null;

  const blocks = useMemo(() => buildBlocks(resume, theme), [resume, theme]);
  const { rail: railBlocks, main: mainBlocks } = useMemo(
    () => (isSidebar ? splitForSidebar(blocks) : { rail: [] as PreviewBlock[], main: blocks }),
    [blocks, isSidebar]
  );
  const wordCount = useMemo(() => countResumeWords(resume), [resume]);

  const headerMeasureRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PreviewBlock[][]>([[]]);

  const measureWidthMM = isSidebar ? CONTENT_WIDTH_MM * SIDEBAR_MAIN_WIDTH_RATIO - SIDEBAR_GAP_MM / 2 : CONTENT_WIDTH_MM;

  useLayoutEffect(() => {
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

  useEffect(() => {
    if (pageIndex > pages.length - 1) onPageIndexChange(Math.max(0, pages.length - 1));
  }, [pages, pageIndex, onPageIndexChange]);

  if (isEmpty) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">Your resume preview will appear here</p>
        <p className="mt-1 text-xs text-slate-400">Start filling out the form to see it come together.</p>
      </div>
    );
  }

  const pageCount = pages.length;
  const safeIndex = Math.min(pageIndex, pageCount - 1);
  const currentBlocks = pages[safeIndex] ?? [];

  return (
    <div>
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: `${measureWidthMM}mm`, fontFamily: fontStack }}>
        <div ref={headerMeasureRef} style={{ overflow: "hidden" }}>{headerNode}</div>
        <div ref={measureRef} style={{ overflow: "hidden" }}>
          {mainBlocks.map((block) => (
            <div key={block.id}>{block.node}</div>
          ))}
        </div>
        <div ref={contentAreaRef} style={{ height: `${CONTENT_HEIGHT_MM}mm` }} />
      </div>

      <div className="w-full" style={{ aspectRatio: `${PAGE_WIDTH_MM} / ${PAGE_HEIGHT_MM}`, maxHeight }}>
        <A4Page fontStack={fontStack}>
          {safeIndex === 0 && headerNode}
          {isSidebar ? (
            <div className="mt-3 flex" style={{ gap: `${SIDEBAR_GAP_MM}mm` }}>
              {safeIndex === 0 && (
                <aside style={{ width: `${CONTENT_WIDTH_MM * SIDEBAR_RAIL_WIDTH_RATIO}mm` }} className="shrink-0 rounded-lg bg-blue-50/60 p-3">
                  {contactLine && <p className="text-xs leading-5 text-slate-600">{contactLine}</p>}
                  {links.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {links.map((link) => (
                        <a key={link.id} href={normalizeUrl(link.url)} target="_blank" rel="noreferrer" className="block text-xs leading-5 text-blue-700 underline">
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}
                  {railBlocks.map((block) => (
                    <div key={block.id} className="mt-3 first:mt-0">{block.node}</div>
                  ))}
                </aside>
              )}
              <div style={{ width: `${measureWidthMM}mm` }} className="min-w-0">
                {currentBlocks.map((block, index) => (
                  <div key={block.id} style={safeIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>
                    {block.node}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            currentBlocks.map((block, index) => (
              <div key={block.id} style={safeIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>
                {block.node}
              </div>
            ))
          )}
        </A4Page>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        {pageCount > 1 && <PageNavButton direction="prev" onClick={() => onPageIndexChange(Math.max(0, safeIndex - 1))} disabled={safeIndex === 0} />}
        <span>Page {safeIndex + 1} of {pageCount}</span>
        {pageCount > 1 && <PageNavButton direction="next" onClick={() => onPageIndexChange(Math.min(pageCount - 1, safeIndex + 1))} disabled={safeIndex >= pageCount - 1} />}
      </div>
      <p className="mt-1 text-center text-xs text-slate-400">{wordCount} {wordCount === 1 ? "word" : "words"}</p>
    </div>
  );
}