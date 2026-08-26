import type { ReactNode } from "react";
import { formatDateRange, formatPartialDate, sortByDateDesc, sortEntriesByRecency } from "@/lib/format";
import type { TemplateId } from "@/lib/templates";
import type { Education, Experience, Project, ResumeData, VolunteerExperience } from "@/types/resume";
import {
  sectionHeadingStyle, entryTitleStyle, entrySubtitleStyle,
  bodyStyle, dateStyle,
} from "@/lib/resume-typography";

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
export const MARGIN_MM = 20;
export const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
export const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_MM * 2;

export interface TemplateTheme {
  fontStack: string;
  headerAlign: "left" | "center";
}

const FONT_STACK_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_STACK_SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

export const TEMPLATE_THEMES: Record<TemplateId, TemplateTheme> = {
  classic: { fontStack: FONT_STACK_SERIF, headerAlign: "center" },
  modern: { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  sidebar: { fontStack: FONT_STACK_SANS, headerAlign: "left" },
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

export function EntryHeading({ primary, secondary, dateRange, subItems }: { primary: ReactNode; secondary?: string; dateRange?: string; subItems?: ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0 12px" }}>
      <div>
        <p style={entryTitleStyle}>{primary}</p>
        {secondary && <p style={entrySubtitleStyle}>{secondary}</p>}
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        {dateRange && <p style={dateStyle}>{dateRange}</p>}
        {subItems}
      </div>
    </div>
  );
}

export const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
export const hasEducationContent = (item: Education) => item.institution.trim();

function sectionHeader(key: string, title: string): PreviewBlock {
  return {
    id: `${key}-header`,
    type: "header",
    node: <h3 style={sectionHeadingStyle}>{title}</h3>,
  };
}
function sectionContent(id: string, node: ReactNode): PreviewBlock {
  return { id, type: "content", node: <div style={{ marginTop: "8px" }}>{node}</div> };
}

export function normalizeUrl(url: string): string {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Builds an ordered, flat list of atomic preview blocks (never split across pages). */
export function buildBlocks(resume: ResumeData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  const { professionalSummary, sectionTitles } = resume;

  const experiences = sortEntriesByRecency(resume.experiences.filter(hasExperienceContent));
  const education = sortEntriesByRecency(resume.education.filter(hasEducationContent));

  if (professionalSummary.trim()) {
    blocks.push(sectionHeader("summary", sectionTitles.summary));
    blocks.push(sectionContent("summary-content", <p style={bodyStyle}>{professionalSummary}</p>));
  }

  if (experiences.length > 0) {
    blocks.push(sectionHeader("experience", sectionTitles.experience));
    experiences.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      blocks.push(sectionContent(`experience-${item.id}`, (
        <div>
          <EntryHeading primary={item.role || "—"} secondary={[item.employer, item.location].filter(Boolean).join(", ")} dateRange={formatDateRange(item.startDate, item.endDate, item.current)} />
          {highlights.length > 0 && (
            <ul style={{ marginTop: "4px", paddingLeft: "16px", listStyleType: "disc", ...bodyStyle }}>
              {highlights.map((line, i) => <li key={i} style={{ paddingLeft: "2px", marginBottom: "2px" }}>{line}</li>)}
            </ul>
          )}
        </div>
      )));
    });
  }

  if (education.length > 0) {
    blocks.push(sectionHeader("education", sectionTitles.education));
    education.forEach((item) => {
      const awards = item.awards.filter((award) => award.name.trim());
      const gradeLabel = item.gradeLabel?.trim();
      const gradeValue = item.gradeValue?.trim();
      const rightSecondary = gradeLabel && gradeValue ? `${gradeLabel}: ${gradeValue}` : undefined;
      const subItemsNode = rightSecondary ? (
        <p style={{ ...bodyStyle, marginTop: "0" }}>{rightSecondary}</p>
      ) : null;
      blocks.push(sectionContent(`education-${item.id}`, (
        <div>
          <EntryHeading
            primary={item.institution}
            secondary={[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
            dateRange={formatDateRange(item.startDate, item.endDate, item.current)}
            subItems={subItemsNode}
          />
          {awards.length > 0 && <p style={{ ...bodyStyle, marginTop: "4px" }}>{awards.map((award) => award.name).join(" • ")}</p>}
        </div>
      )));
    });
  }

  if (resume.skills.length > 0) {
    blocks.push(sectionHeader("skills", sectionTitles.skills));
    blocks.push(sectionContent("skills-content", (
      <ul style={{ paddingLeft: "16px", listStyleType: "disc", ...bodyStyle }}>
        {resume.skills.map((skill) => <li key={skill} style={{ paddingLeft: "2px", marginBottom: "2px" }}>{skill}</li>)}
      </ul>
    )));
  }

  resume.optionalSections.forEach((sectionKey) => {
    if (sectionKey === "projects") {
      const hasProjectContent = (item: Project) => item.name.trim();
      const projects = sortByDateDesc(resume.projects.filter(hasProjectContent));
      if (projects.length === 0) return;
      blocks.push(sectionHeader("projects", sectionTitles.projects));
      projects.forEach((item) => {
        const highlights = item.highlights.filter((line) => line.trim());
        const techLine = item.technologies.filter(Boolean).join(", ");
        const primaryNode = (
          <span>
            {item.name}
            {techLine && <span style={{ fontWeight: "normal" }}> | {techLine}</span>}
          </span>
        );
        blocks.push(sectionContent(`project-${item.id}`, (
          <div>
            <EntryHeading primary={primaryNode} dateRange={formatPartialDate(item.date)} />
            {highlights.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}
              </div>
            )}
          </div>
        )));
      });
    }
    if (sectionKey === "certifications") {
      const certifications = sortByDateDesc(resume.certifications.filter((item) => item.name.trim()));
      if (certifications.length === 0) return;
      blocks.push(sectionHeader("certifications", sectionTitles.certifications));
      certifications.forEach((item) => {
        const org = item.issuingOrganization?.trim();
        blocks.push(sectionContent(`certification-${item.id}`, (
          <div>
            <EntryHeading primary={item.name} dateRange={formatPartialDate(item.date)} />
            {org && <p style={{ ...bodyStyle, marginTop: "2px" }}>{org}</p>}
          </div>
        )));
      });
    }
    if (sectionKey === "awards") {
      const awards = sortByDateDesc(resume.awards.filter((item) => item.title.trim()));
      if (awards.length === 0) return;
      blocks.push(sectionHeader("awards", sectionTitles.awards));
      awards.forEach((item) => {
        const highlights = item.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`award-${item.id}`, (
          <div>
            <EntryHeading primary={item.title} dateRange={formatPartialDate(item.date)} />
            {highlights.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}
              </div>
            )}
          </div>
        )));
      });
    }
    if (sectionKey === "volunteerExperiences") {
      const hasVolunteerContent = (item: VolunteerExperience) => item.organization.trim() || item.role.trim();
      const volunteering = sortByDateDesc(resume.volunteerExperiences.filter(hasVolunteerContent));
      if (volunteering.length === 0) return;
      blocks.push(sectionHeader("volunteering", sectionTitles.volunteerExperiences));
      volunteering.forEach((item) => {
        const highlights = item.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`volunteer-${item.id}`, (
          <div>
            <EntryHeading primary={[item.role, item.organization].filter(Boolean).join(" | ")} dateRange={formatPartialDate(item.date)} />
            {highlights.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}
              </div>
            )}
          </div>
        )));
      });
    }
    if (sectionKey === "languages") {
      const languages = resume.languages.filter((item) => item.name.trim());
      if (languages.length === 0) return;
      blocks.push(sectionHeader("languages", sectionTitles.languages));
      blocks.push(sectionContent("languages-content", <p style={bodyStyle}>{languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • ")}</p>));
    }
    if (sectionKey === "other") {
      const entries = sortByDateDesc(resume.otherEntries.filter((entry) => entry.name.trim()));
      if (entries.length === 0) return;
      blocks.push(sectionHeader("other", sectionTitles.other));
      entries.forEach((entry) => {
        const highlights = entry.highlights.filter((line) => line.trim());
        blocks.push(sectionContent(`other-entry-${entry.id}`, (
          <div>
            <EntryHeading primary={entry.name} dateRange={formatPartialDate(entry.date)} />
            {highlights.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}
              </div>
            )}
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