import type { ReactNode } from "react";
import { formatDateRange, formatPartialDate, sortByDateDesc, sortEntriesByRecency } from "@/lib/format";
import type { TemplateId } from "@/lib/templates";
import type { Education, Experience, Project, ResumeData, VolunteerExperience } from "@/types/resume";

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
export const MARGIN_MM = 20;
export const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
export const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_MM * 2;
const FONT_STACK_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_STACK_SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

export interface TemplateTheme {
  fontStack: string;
  headerAlign: "left" | "center";
  labelColor: string;
  ruleColor: string;
}

export const TEMPLATE_THEMES: Record<TemplateId, TemplateTheme> = {
  classic: { fontStack: FONT_STACK_SERIF, headerAlign: "center", labelColor: "text-black", ruleColor: "border-slate-300" },
  modern: { fontStack: FONT_STACK_SANS, headerAlign: "left", labelColor: "text-black", ruleColor: "border-blue-200" },
  sidebar: { fontStack: FONT_STACK_SANS, headerAlign: "left", labelColor: "text-black", ruleColor: "border-blue-200" },
};

const RAIL_SECTION_PREFIXES = ["education", "skills", "languages"];
export function splitForSidebar(blocks: PreviewBlock[]) {
  const rail: PreviewBlock[] = [];
  const main: PreviewBlock[] = [];
  blocks.forEach((block) => (RAIL_SECTION_PREFIXES.some((prefix) => block.id.startsWith(prefix)) ? rail : main).push(block));
  return { rail, main };
}

export const SIDEBAR_MAIN_WIDTH_RATIO = 0.62;
export const SIDEBAR_RAIL_WIDTH_RATIO = 1 - SIDEBAR_MAIN_WIDTH_RATIO;
export const SIDEBAR_GAP_MM = 6;

export interface PreviewBlock {
  id: string;
  type: "header" | "content";
  node: ReactNode;
}

export function EntryHeading({ primary, secondary, dateRange }: { primary: string; secondary?: string; dateRange?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
      <div>
        <p className="text-sm font-semibold text-black">{primary}</p>
        {secondary && <p className="text-sm text-black">{secondary}</p>}
      </div>
      {dateRange && <p className="shrink-0 text-xs font-medium text-black">{dateRange}</p>}
    </div>
  );
}

export const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
export const hasEducationContent = (item: Education) => item.institution.trim();

function sectionHeader(key: string, title: string, theme: TemplateTheme): PreviewBlock {
  return {
    id: `${key}-header`,
    type: "header",
    node: <h3 className={`mt-5 border-b ${theme.ruleColor} pb-1 text-xs font-bold uppercase tracking-wider ${theme.labelColor}`}>{title}</h3>,
  };
}
function sectionContent(id: string, node: ReactNode): PreviewBlock {
  return { id, type: "content", node: <div className="mt-2.5">{node}</div> };
}

export function normalizeUrl(url: string): string {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Builds an ordered, flat list of atomic preview blocks (never split across pages). */
export function buildBlocks(resume: ResumeData, theme: TemplateTheme): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  const { professionalSummary, sectionTitles } = resume;

  const experiences = sortEntriesByRecency(resume.experiences.filter(hasExperienceContent));
  const education = sortEntriesByRecency(resume.education.filter(hasEducationContent));

  if (professionalSummary.trim()) {
    blocks.push(sectionHeader("summary", sectionTitles.summary, theme));
    blocks.push(sectionContent("summary-content", <p className="text-sm leading-6 text-black">{professionalSummary}</p>));
  }

  if (experiences.length > 0) {
    blocks.push(sectionHeader("experience", sectionTitles.experience, theme));
    experiences.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      blocks.push(sectionContent(`experience-${item.id}`, (
        <div>
          <EntryHeading primary={item.role || "—"} secondary={[item.employer, item.location].filter(Boolean).join(", ")} dateRange={formatDateRange(item.startDate, item.endDate, item.current)} />
          {highlights.length > 0 && <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-6 text-black">{highlights.map((line, i) => <li key={i}>{line}</li>)}</ul>}
        </div>
      )));
    });
  }

  if (education.length > 0) {
    blocks.push(sectionHeader("education", sectionTitles.education, theme));
    education.forEach((item) => {
      const awards = item.awards.filter((award) => award.name.trim());
      blocks.push(sectionContent(`education-${item.id}`, (
        <div>
          <EntryHeading primary={item.institution} secondary={[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")} dateRange={formatDateRange(item.startDate, item.endDate, item.current)} />
          {awards.length > 0 && <p className="mt-1 text-xs text-black">{awards.map((award) => award.name).join(" • ")}</p>}
        </div>
      )));
    });
  }

  if (resume.skills.length > 0) {
    blocks.push(sectionHeader("skills", sectionTitles.skills, theme));
    blocks.push(sectionContent("skills-content", (
      <ul className="list-disc space-y-0.5 pl-4 text-sm leading-6 text-black">
        {resume.skills.map((skill) => <li key={skill}>{skill}</li>)}
      </ul>
    )));
  }

  resume.optionalSections.forEach((sectionKey) => {
    if (sectionKey === "projects") {
      const hasProjectContent = (item: Project) => item.name.trim();
      const projects = sortByDateDesc(resume.projects.filter(hasProjectContent));
      if (projects.length === 0) return;
      blocks.push(sectionHeader("projects", sectionTitles.projects, theme));
      projects.forEach((item) => {
        const highlights = item.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`project-${item.id}`, (
          <div>
            <EntryHeading primary={[item.name, item.technologies.join(", ")].filter(Boolean).join(" | ")} dateRange={formatPartialDate(item.date)} />
            {highlights.length > 0 && <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-6 text-black">{highlights.map((line, i) => <li key={i}>{line}</li>)}</ul>}
          </div>
        )));
      });
    }
    if (sectionKey === "certifications") {
      const certifications = sortByDateDesc(resume.certifications.filter((item) => item.name.trim()));
      if (certifications.length === 0) return;
      blocks.push(sectionHeader("certifications", sectionTitles.certifications, theme));
      certifications.forEach((item) => blocks.push(sectionContent(`certification-${item.id}`, <EntryHeading primary={item.name} dateRange={formatPartialDate(item.date)} />)));
    }
    if (sectionKey === "awards") {
      const awards = sortByDateDesc(resume.awards.filter((item) => item.title.trim()));
      if (awards.length === 0) return;
      blocks.push(sectionHeader("awards", sectionTitles.awards, theme));
      awards.forEach((item) => {
        const highlights = item.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`award-${item.id}`, (
          <div>
            <EntryHeading primary={item.title} dateRange={formatPartialDate(item.date)} />
            {highlights.length > 0 && <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-6 text-black">{highlights.map((line, i) => <li key={i}>{line}</li>)}</ul>}
          </div>
        )));
      });
    }
    if (sectionKey === "volunteerExperiences") {
      const hasVolunteerContent = (item: VolunteerExperience) => item.organization.trim() || item.role.trim();
      const volunteering = sortByDateDesc(resume.volunteerExperiences.filter(hasVolunteerContent));
      if (volunteering.length === 0) return;
      blocks.push(sectionHeader("volunteering", sectionTitles.volunteerExperiences, theme));
      volunteering.forEach((item) => {
        const highlights = item.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`volunteer-${item.id}`, (
          <div>
            <EntryHeading primary={[item.role, item.organization].filter(Boolean).join(" | ")} dateRange={formatPartialDate(item.date)} />
            {highlights.length > 0 && <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-6 text-black">{highlights.map((line, i) => <li key={i}>{line}</li>)}</ul>}
          </div>
        )));
      });
    }
    if (sectionKey === "languages") {
      const languages = resume.languages.filter((item) => item.name.trim());
      if (languages.length === 0) return;
      blocks.push(sectionHeader("languages", sectionTitles.languages, theme));
      blocks.push(sectionContent("languages-content", <p className="text-sm leading-6 text-black">{languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • ")}</p>));
    }
    if (sectionKey === "other") {
      const entries = sortByDateDesc(resume.otherEntries.filter((entry) => entry.name.trim()));
      if (entries.length === 0) return;
      blocks.push(sectionHeader("other", sectionTitles.other, theme));
      entries.forEach((entry) => {
        const highlights = entry.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`other-entry-${entry.id}`, (
          <div>
            <EntryHeading primary={entry.name} dateRange={formatPartialDate(entry.date)} />
            {highlights.length > 0 && <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-6 text-black">{highlights.map((line, i) => <li key={i}>{line}</li>)}</ul>}
          </div>
        )));
      });
    }
  });

  return blocks;
}

/**
 * Greedily fills pages up to the measured content-area height. Blocks are
 * atomic (never split). A trailing section header left alone at the bottom
 * of a page is pushed onto the next page so it isn't orphaned from its content.
 */
export function paginateBlocks(blocks: PreviewBlock[], heights: Record<string, number>, headerHeight: number, contentHeight: number): PreviewBlock[][] {
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