"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useResumeContext } from "@/context/resume-context";
import { formatDateRange, sortEntriesByRecency } from "@/lib/format";
import type { Education, Experience, Project, ResumeData, VolunteerExperience } from "@/types/resume";

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MARGIN_MM = 20;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_MM * 2;
const FONT_STACK = "Georgia, 'Times New Roman', serif";

interface PreviewBlock {
  id: string;
  type: "header" | "content";
  node: ReactNode;
}

function EntryHeading({ primary, secondary, dateRange }: { primary: string; secondary?: string; dateRange?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
      <div>
        <p className="text-sm font-semibold text-slate-900">{primary}</p>
        {secondary && <p className="text-sm text-slate-600">{secondary}</p>}
      </div>
      {dateRange && <p className="shrink-0 text-xs font-medium text-slate-500">{dateRange}</p>}
    </div>
  );
}

const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
const hasEducationContent = (item: Education) => item.institution.trim();
const hasProjectContent = (item: Project) => item.name.trim();
const hasVolunteerContent = (item: VolunteerExperience) => item.organization.trim() || item.role.trim();

function sectionHeader(key: string, title: string): PreviewBlock {
  return {
    id: `${key}-header`,
    type: "header",
    node: <h3 className="mt-5 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h3>,
  };
}
function sectionContent(id: string, node: ReactNode): PreviewBlock {
  return { id, type: "content", node: <div className="mt-2.5">{node}</div> };
}

/** Builds an ordered, flat list of atomic preview blocks (never split across pages). */
function buildBlocks(resume: ResumeData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  const { professionalSummary } = resume;

  // Work experience and education are sorted here for display only — the
  // arrays in central state are never mutated.
  const experiences = sortEntriesByRecency(resume.experiences.filter(hasExperienceContent));
  const education = sortEntriesByRecency(resume.education.filter(hasEducationContent));
  const skills = resume.skillGroups.find((group) => group.id === "primary")?.skills ?? [];
  const projects = resume.optionalSections.includes("projects") ? resume.projects.filter(hasProjectContent) : [];
  const certifications = resume.optionalSections.includes("certifications") ? resume.certifications.filter((item) => item.name.trim()) : [];
  const awards = resume.optionalSections.includes("awards") ? resume.awards.filter((item) => item.title.trim()) : [];
  const volunteering = resume.optionalSections.includes("volunteerExperiences") ? resume.volunteerExperiences.filter(hasVolunteerContent) : [];
  const languages = resume.optionalSections.includes("languages") ? resume.languages.filter((item) => item.name.trim()) : [];
  const interests = resume.optionalSections.includes("interests") ? resume.interests.filter(Boolean) : [];

  if (professionalSummary.trim()) {
    blocks.push(sectionHeader("summary", "Summary"));
    blocks.push(sectionContent("summary-content", <p className="text-sm leading-6 text-slate-700">{professionalSummary}</p>));
  }

  if (experiences.length > 0) {
    blocks.push(sectionHeader("experience", "Experience"));
    experiences.forEach((item) => {
      blocks.push(
        sectionContent(
          `experience-${item.id}`,
          <div>
            <EntryHeading primary={item.role || "—"} secondary={[item.employer, item.location].filter(Boolean).join(", ")} dateRange={formatDateRange(item.startDate, item.endDate, item.current)} />
            {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
          </div>
        )
      );
    });
  }

  if (education.length > 0) {
    blocks.push(sectionHeader("education", "Education"));
    education.forEach((item) => {
      blocks.push(
        sectionContent(
          `education-${item.id}`,
          <div>
            <EntryHeading primary={item.institution} secondary={[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")} dateRange={formatDateRange(item.startDate, item.endDate, item.current)} />
            {item.awards.some((award) => award.name.trim()) && (
              <p className="mt-1 text-xs text-slate-600">{item.awards.filter((award) => award.name.trim()).map((award) => award.name).join(", ")}</p>
            )}
          </div>
        )
      );
    });
  }

  if (skills.length > 0) {
    blocks.push(sectionHeader("skills", "Skills"));
    blocks.push(sectionContent("skills-content", <p className="text-sm leading-6 text-slate-700">{skills.join(" • ")}</p>));
  }

  if (projects.length > 0) {
    blocks.push(sectionHeader("projects", "Projects"));
    projects.forEach((item) => {
      blocks.push(
        sectionContent(
          `project-${item.id}`,
          <div>
            <EntryHeading primary={item.name} secondary={item.role} dateRange={formatDateRange(item.startDate, item.endDate, false)} />
            {item.technologies.length > 0 && <p className="mt-0.5 text-xs text-slate-500">{item.technologies.join(", ")}</p>}
            {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
          </div>
        )
      );
    });
  }

  if (certifications.length > 0) {
    blocks.push(sectionHeader("certifications", "Certifications"));
    certifications.forEach((item) => {
      blocks.push(
        sectionContent(
          `certification-${item.id}`,
          <EntryHeading primary={item.name} secondary={item.issuer} dateRange={formatDateRange(item.issueDate, item.expiryDate, false)} />
        )
      );
    });
  }

  if (awards.length > 0) {
    blocks.push(sectionHeader("awards", "Awards"));
    awards.forEach((item) => {
      blocks.push(
        sectionContent(
          `award-${item.id}`,
          <div>
            <EntryHeading primary={item.title} secondary={item.issuer} dateRange={formatDateRange(item.date, "", false)} />
            {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
          </div>
        )
      );
    });
  }

  if (volunteering.length > 0) {
    blocks.push(sectionHeader("volunteering", "Volunteer Experience"));
    volunteering.forEach((item) => {
      blocks.push(
        sectionContent(
          `volunteer-${item.id}`,
          <div>
            <EntryHeading primary={item.role || item.organization} secondary={item.role ? item.organization : undefined} dateRange={formatDateRange(item.startDate, item.endDate, false)} />
            {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
          </div>
        )
      );
    });
  }

  if (languages.length > 0) {
    blocks.push(sectionHeader("languages", "Languages"));
    blocks.push(
      sectionContent(
        "languages-content",
        <p className="text-sm leading-6 text-slate-700">{languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • ")}</p>
      )
    );
  }

  if (interests.length > 0) {
    blocks.push(sectionHeader("interests", "Interests"));
    blocks.push(sectionContent("interests-content", <p className="text-sm leading-6 text-slate-700">{interests.join(" • ")}</p>));
  }

  return blocks;
}

/**
 * Greedily fills pages up to the measured content-area height. Blocks are
 * atomic (never split). A trailing section header left alone at the bottom
 * of a page is pushed onto the next page so it isn't orphaned from its content.
 */
function paginateBlocks(blocks: PreviewBlock[], heights: Record<string, number>, headerHeight: number, contentHeight: number): PreviewBlock[][] {
  if (blocks.length === 0) return [[]];
  const pages: PreviewBlock[][] = [[]];
  let used = headerHeight;
  let pageIndex = 0;

  blocks.forEach((block) => {
    const h = heights[block.id] ?? 0;
    if (pages[pageIndex].length > 0 && used + h > contentHeight) {
      pageIndex += 1;
      pages[pageIndex] = [];
      used = 0;
    }
    pages[pageIndex].push(block);
    used += h;
  });

  for (let i = 0; i < pages.length - 1; i += 1) {
    const page = pages[i];
    const last = page[page.length - 1];
    if (last?.type === "header") {
      page.pop();
      pages[i + 1].unshift(last);
    }
  }

  const nonEmpty = pages.filter((page) => page.length > 0);
  return nonEmpty.length > 0 ? nonEmpty : [[]];
}

/** Renders one A4 sheet, scaled uniformly (never stretched) to fit its container. */
function A4Page({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null); // fixed-size viewport, bounded on both axes
  const sizerRef = useRef<HTMLDivElement>(null); // learns the px equivalent of 210mm, once
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
      // Fit inside BOTH dimensions, never upscale past 100%.
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
          <div className="h-full w-full overflow-hidden text-slate-900" style={{ padding: `${MARGIN_MM}mm`, fontFamily: FONT_STACK }}>
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
  /** Current page (controlled) — lifted so the inline and expanded views share it. */
  pageIndex: number;
  onPageIndexChange: (index: number) => void;
  /** CSS max-height applied to the A4 viewport box, e.g. "70vh". */
  maxHeight?: string;
}

export function ResumePreview({ pageIndex, onPageIndexChange, maxHeight = "70vh" }: ResumePreviewProps) {
  const { state } = useResumeContext();
  const { resume } = state;
  const { personalDetails: personal, professionalSummary } = resume;

  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const contactLine = [personal.contact.location, personal.contact.email, personal.contact.phone].filter(Boolean).join("  •  ");
  const linkLine = [personal.contact.linkedin, personal.contact.github, personal.contact.website].filter(Boolean).join("  •  ");

  const experiencesPresent = resume.experiences.some(hasExperienceContent);
  const educationPresent = resume.education.some(hasEducationContent);
  const skillsPresent = (resume.skillGroups.find((group) => group.id === "primary")?.skills ?? []).length > 0;
  const isEmpty = !fullName && !personal.headline.trim() && !contactLine && !professionalSummary.trim() && !experiencesPresent && !educationPresent && !skillsPresent;

  const headerNode = fullName || personal.headline.trim() || contactLine || linkLine
    ? (
      <header className="border-b border-slate-300 pb-3 text-center">
        {fullName && <h2 className="text-2xl font-bold tracking-tight text-slate-950">{fullName}</h2>}
        {personal.headline.trim() && <p className="mt-1 text-sm font-medium text-slate-600">{personal.headline}</p>}
        {contactLine && <p className="mt-2 text-xs text-slate-500">{contactLine}</p>}
        {linkLine && <p className="mt-0.5 text-xs text-slate-500">{linkLine}</p>}
      </header>
    )
    : null;

  const blocks = useMemo(() => buildBlocks(resume), [resume]);

  const headerMeasureRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PreviewBlock[][]>([[]]);

  useLayoutEffect(() => {
    if (isEmpty) return;
    const heights: Record<string, number> = {};
    const container = measureRef.current;
    if (container) {
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((child, index) => {
        const nextTop = index < children.length - 1 ? children[index + 1].offsetTop : container.scrollHeight;
        const block = blocks[index];
        if (block) heights[block.id] = nextTop - child.offsetTop;
      });
    }
    const headerHeight = headerMeasureRef.current?.offsetHeight ?? 0;
    const contentHeight = contentAreaRef.current?.offsetHeight ?? 1;
    setPages(paginateBlocks(blocks, heights, headerHeight, contentHeight));
  }, [blocks, isEmpty]);

  // Keep the controlled pageIndex valid if the page count shrinks (e.g. after an edit).
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
      {/* Off-screen measurer: unchanged — rendered at the real 170mm content
          width so heights (including margins) match the visible layout. */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: `${CONTENT_WIDTH_MM}mm`, fontFamily: FONT_STACK }}>
        <div ref={headerMeasureRef} style={{ overflow: "hidden" }}>{headerNode}</div>
        <div ref={measureRef} style={{ overflow: "hidden" }}>
          {blocks.map((block) => (
            <div key={block.id}>{block.node}</div>
          ))}
        </div>
        <div ref={contentAreaRef} style={{ height: `${CONTENT_HEIGHT_MM}mm` }} />
      </div>

      {/* Arrows no longer flank the paper — it now gets the card's full width. */}
      <div className="w-full" style={{ aspectRatio: `${PAGE_WIDTH_MM} / ${PAGE_HEIGHT_MM}`, maxHeight }}>
        <A4Page>
          {safeIndex === 0 && headerNode}
          {currentBlocks.map((block, index) => (
            <div key={block.id} style={safeIndex > 0 && index === 0 ? { marginTop: 0 } : undefined}>
              {block.node}
            </div>
          ))}
        </A4Page>
      </div>

      {/* Compact pagination row: chevrons flank the indicator, not the paper. */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        {pageCount > 1 && <PageNavButton direction="prev" onClick={() => onPageIndexChange(Math.max(0, safeIndex - 1))} disabled={safeIndex === 0} />}
        <span>Page {safeIndex + 1} of {pageCount}</span>
        {pageCount > 1 && <PageNavButton direction="next" onClick={() => onPageIndexChange(Math.min(pageCount - 1, safeIndex + 1))} disabled={safeIndex >= pageCount - 1} />}
      </div>
    </div>
  );
}
