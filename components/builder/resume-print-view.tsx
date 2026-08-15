"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useResumeContext } from "@/context/resume-context";
import { COUNTRIES } from "@/lib/countries";
import { getTemplate } from "@/lib/templates";
import { getFont } from "@/lib/fonts";
import {
  CONTENT_HEIGHT_MM, CONTENT_WIDTH_MM, MARGIN_MM, PAGE_HEIGHT_MM, PAGE_WIDTH_MM,
  SIDEBAR_GAP_MM, SIDEBAR_MAIN_WIDTH_RATIO, SIDEBAR_RAIL_WIDTH_RATIO, TEMPLATE_THEMES,
  buildBlocks, hasEducationContent, hasExperienceContent, normalizeUrl, paginateBlocks, splitForSidebar,
  type PreviewBlock,
} from "@/lib/resume-blocks";

/**
 * Print-only, full-fidelity render of every resume page at true A4 size
 * (no on-screen scaling). Hidden on screen via `.print-only` in
 * globals.css and revealed only inside `@media print`, so window.print()
 * produces a real, multi-page, text-based PDF built from the same
 * buildBlocks/paginateBlocks logic as the live preview.
 */
export function ResumePrintView() {
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

  const headerNode = fullName || personal.headline.trim() || contactLine || links.length > 0 ? (
    <header className={`border-b border-slate-300 pb-3 ${theme.headerAlign === "center" ? "text-center" : "text-left"}`}>
      {fullName && <h2 className="text-2xl font-bold tracking-tight text-black">{fullName}</h2>}
      {personal.headline.trim() && <p className="mt-1 text-sm font-medium text-black">{personal.headline}</p>}
      {!isSidebar && contactLine && <p className="mt-2 text-xs text-black">{contactLine}</p>}
      {!isSidebar && links.length > 0 && (
        <p className="mt-0.5 text-xs text-black">
          {links.map((link, index) => (
            <span key={link.id}>{index > 0 && "  •  "}<a href={normalizeUrl(link.url)} className="text-black underline">{link.name}</a></span>
          ))}
        </p>
      )}
    </header>
  ) : null;

  const blocks = useMemo(() => buildBlocks(resume, theme), [resume, theme]);
  const { rail: railBlocks, main: mainBlocks } = useMemo(
    () => (isSidebar ? splitForSidebar(blocks) : { rail: [] as PreviewBlock[], main: blocks }),
    [blocks, isSidebar]
  );

  const headerMeasureRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PreviewBlock[][]>([[]]);

  const contentWidthMM = isSidebar ? CONTENT_WIDTH_MM * SIDEBAR_MAIN_WIDTH_RATIO - SIDEBAR_GAP_MM / 2 : CONTENT_WIDTH_MM;

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

  if (isEmpty) return null;

  return (
    <div className="print-only" style={{ fontFamily: fontStack }}>
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: `${contentWidthMM}mm` }}>
        <div ref={headerMeasureRef} style={{ overflow: "hidden" }}>{headerNode}</div>
        <div ref={measureRef} style={{ overflow: "hidden" }}>
          {mainBlocks.map((block) => <div key={block.id}>{block.node}</div>)}
        </div>
        <div ref={contentAreaRef} style={{ height: `${CONTENT_HEIGHT_MM}mm` }} />
      </div>

      {pages.map((pageBlocks, pageIndex) => (
        <div
          key={pageIndex}
          className="text-slate-900"
          style={{
            width: `${PAGE_WIDTH_MM}mm`,
            height: `${PAGE_HEIGHT_MM}mm`,
            padding: `${MARGIN_MM}mm`,
            boxSizing: "border-box",
            overflow: "hidden",
            breakAfter: pageIndex < pages.length - 1 ? "page" : "auto",
          }}
        >
          {pageIndex === 0 && headerNode}
          {isSidebar ? (
            <div className="mt-3 flex" style={{ gap: `${SIDEBAR_GAP_MM}mm` }}>
              {pageIndex === 0 && (
                <aside style={{ width: `${CONTENT_WIDTH_MM * SIDEBAR_RAIL_WIDTH_RATIO}mm` }} className="shrink-0 rounded-lg bg-blue-50/60 p-3">
                  {contactLine && <p className="text-xs leading-5 text-slate-600">{contactLine}</p>}
                  {links.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {links.map((link) => <a key={link.id} href={normalizeUrl(link.url)} className="block text-xs leading-5 text-blue-700 underline">{link.name}</a>)}
                    </div>
                  )}
                  {railBlocks.map((block) => <div key={block.id} className="mt-3 first:mt-0">{block.node}</div>)}
                </aside>
              )}
              <div style={{ width: `${contentWidthMM}mm` }} className="min-w-0">
                {pageBlocks.map((block, index) => <div key={block.id} style={pageIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>{block.node}</div>)}
              </div>
            </div>
          ) : (
            pageBlocks.map((block, index) => <div key={block.id} style={pageIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>{block.node}</div>)
          )}
        </div>
      ))}
    </div>
  );
}