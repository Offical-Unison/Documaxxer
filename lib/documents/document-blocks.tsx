import type { ReactNode } from "react";
import { formatDateRange, formatPartialDate } from "@/lib/format";
import { getResumeLayout, normalizeUrl, selectVisibleEntries, type LayoutSectionKey } from "@/lib/documents/document-layout";
import type { Education, Experience, DocumentData } from "@/types/document";
import {
  sectionHeadingStyle, entryTitleStyle, entrySubtitleStyle,
  bodyStyle, dateStyle,
} from "@/lib/documents/document-typography";

export const PAGE_WIDTH_MM = 210; // A4 width in mm
export const PAGE_HEIGHT_MM = 297; // A4 height in mm
export const MARGIN_MM = 25.4; // 1 inch
export const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
export const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_MM * 2;

export const SIDEBAR_MAIN_WIDTH_RATIO = 0.65;
export const SIDEBAR_RAIL_WIDTH_RATIO = 1 - SIDEBAR_MAIN_WIDTH_RATIO;
export const SIDEBAR_GAP_MM = 8;

export interface PreviewBlock {
  id: string;
  type: "header" | "content";
  node: ReactNode;
}

export const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
export const hasEducationContent = (item: Education) => item.institution.trim();

function sectionHeader(key: string, title: string, customStyle?: React.CSSProperties): PreviewBlock {
  return {
    id: `${key}-header`,
    type: "header",
    node: <h3 style={{ ...sectionHeadingStyle, ...customStyle }}>{title}</h3>,
  };
}
function sectionContent(id: string, node: ReactNode, customStyle?: React.CSSProperties): PreviewBlock {
  return { id, type: "content", node: <div style={{ marginTop: "8px", ...customStyle }}>{node}</div> };
}

export { normalizeUrl };

export function EntryHeading({ primary, secondary, dateRange, subItems, customPrimaryStyle, customSecondaryStyle }: { primary: ReactNode; secondary?: string; dateRange?: string; subItems?: ReactNode; customPrimaryStyle?: React.CSSProperties; customSecondaryStyle?: React.CSSProperties; }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0 12px" }}>
      <div>
        <p style={{ ...entryTitleStyle, ...customPrimaryStyle }}>{primary}</p>
        {secondary && <p style={{ ...entrySubtitleStyle, ...customSecondaryStyle }}>{secondary}</p>}
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        {dateRange && <p style={dateStyle}>{dateRange}</p>}
        {subItems}
      </div>
    </div>
  );
}

/** 
 * Central builder for all templates.
 * Returns the main blocks, and optionally rail blocks if it's a two-column template.
 */
export function buildTemplateBlocks(document: DocumentData, templateId: string): { main: PreviewBlock[]; rail: PreviewBlock[] } {
  const { professionalSummary, sectionTitles } = document;

  const {
    experiences, education, projects, certifications, awards, volunteerExperiences: volunteering, organizations, leadership,
    teachingExperiences: teaching, grants, memberships, references, languages, publications, presentations,
    researchExperiences: research, otherEntries,
  } = selectVisibleEntries(document);

  const main: PreviewBlock[] = [];
  const rail: PreviewBlock[] = [];

  const addSummary = (target: PreviewBlock[]) => {
    if (professionalSummary.trim()) {
      target.push(sectionHeader("summary", sectionTitles.summary));
      target.push(sectionContent("summary-content", <p style={bodyStyle}>{professionalSummary}</p>));
    }
  };

  const addExperiences = (target: PreviewBlock[]) => {
    if (experiences.length === 0) return;
    target.push(sectionHeader("experience", sectionTitles.experience));
    experiences.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`experience-${item.id}`, (
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
  };

  const addEducation = (target: PreviewBlock[]) => {
    if (education.length === 0) return;
    target.push(sectionHeader("education", sectionTitles.education));
    education.forEach((item) => {
      const eduAwards = item.awards.filter((award) => award.name.trim());
      const rightSecondary = item.gradeLabel && item.gradeValue ? `${item.gradeLabel.trim()}: ${item.gradeValue.trim()}` : undefined;
      target.push(sectionContent(`education-${item.id}`, (
        <div>
          <EntryHeading
            primary={item.institution}
            secondary={[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
            dateRange={formatDateRange(item.startDate, item.endDate, item.current)}
            subItems={rightSecondary ? <p style={{ ...bodyStyle, marginTop: "0" }}>{rightSecondary}</p> : null}
          />
          {eduAwards.length > 0 && <p style={{ ...bodyStyle, marginTop: "4px" }}>{eduAwards.map((a) => a.name).join(" • ")}</p>}
        </div>
      )));
    });
  };

  const addSkills = (target: PreviewBlock[], techStyle: boolean = false) => {
    if (document.skills.length === 0) return;
    target.push(sectionHeader("skills", sectionTitles.skills));
    
    if (techStyle) {
      target.push(sectionContent("skills-content", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {document.skills.map((skill, index) => (
            <span key={`${skill}-${index}`} style={{ ...bodyStyle, fontWeight: 500, padding: "2px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>{skill}</span>
          ))}
        </div>
      )));
    } else {
      target.push(sectionContent("skills-content", (
        <p style={bodyStyle}>{document.skills.join(" • ")}</p>
      )));
    }
  };

  const addProjects = (target: PreviewBlock[]) => {
    if (projects.length === 0 || !document.optionalSections.includes("projects")) return;
    target.push(sectionHeader("projects", sectionTitles.projects));
    projects.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      const techLine = item.technologies.filter(Boolean).join(", ");
      const primaryNode = <span>{item.name}{techLine && <span style={{ fontWeight: "normal" }}> | {techLine}</span>}</span>;
      target.push(sectionContent(`project-${item.id}`, (
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
  };

  const addResearch = (target: PreviewBlock[]) => {
    if (research.length === 0 || !document.optionalSections.includes("researchExperiences")) return;
    target.push(sectionHeader("researchExperiences", sectionTitles.researchExperiences));
    research.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`research-${item.id}`, (
        <div>
          <EntryHeading primary={item.role} secondary={[item.organization, item.project].filter(Boolean).join(" | ")} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && (
            <div style={{ marginTop: "4px" }}>
              {highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}
            </div>
          )}
        </div>
      )));
    });
  };

  const addPublications = (target: PreviewBlock[]) => {
    if (publications.length === 0 || !document.optionalSections.includes("publications")) return;
    target.push(sectionHeader("publications", sectionTitles.publications));
    publications.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`publication-${item.id}`, (
        <div>
          <EntryHeading primary={item.title} secondary={item.publisher} dateRange={formatPartialDate(item.date)} />
          {item.authors.trim() && <p style={{ ...bodyStyle, marginTop: "2px" }}>Authors: {item.authors}</p>}
          {item.url.trim() && <p style={{ ...bodyStyle, marginTop: "2px" }}><a href={normalizeUrl(item.url)} target="_blank" rel="noreferrer" style={{color: "inherit", textDecoration: "underline"}}>{item.url}</a></p>}
          {highlights.length > 0 && (
            <div style={{ marginTop: "4px" }}>
              {highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}
            </div>
          )}
        </div>
      )));
    });
  };
  
  const addCertifications = (target: PreviewBlock[]) => {
    if (certifications.length === 0 || !document.optionalSections.includes("certifications")) return;
    target.push(sectionHeader("certifications", sectionTitles.certifications));
    certifications.forEach((item) => {
      const org = item.issuingOrganization?.trim();
      target.push(sectionContent(`certification-${item.id}`, (
        <div>
          <EntryHeading primary={item.name} dateRange={formatPartialDate(item.date)} />
          {org && <p style={{ ...bodyStyle, marginTop: "2px" }}>{org}</p>}
        </div>
      )));
    });
  };

  const addLanguages = (target: PreviewBlock[]) => {
    if (languages.length === 0 || !document.optionalSections.includes("languages")) return;
    target.push(sectionHeader("languages", sectionTitles.languages));
    target.push(sectionContent("languages-content", <p style={bodyStyle}>{languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • ")}</p>));
  };
  
  const addAwards = (target: PreviewBlock[]) => {
    if (awards.length === 0 || !document.optionalSections.includes("awards")) return;
    target.push(sectionHeader("awards", sectionTitles.awards));
    awards.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`award-${item.id}`, (
        <div>
          <EntryHeading primary={item.title} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };
  
  const addVolunteering = (target: PreviewBlock[]) => {
    if (volunteering.length === 0 || !document.optionalSections.includes("volunteerExperiences")) return;
    target.push(sectionHeader("volunteering", sectionTitles.volunteerExperiences));
    volunteering.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`volunteer-${item.id}`, (
        <div>
          <EntryHeading primary={[item.role, item.organization].filter(Boolean).join(" | ")} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const addPresentations = (target: PreviewBlock[]) => {
    if (presentations.length === 0 || !document.optionalSections.includes("presentations")) return;
    target.push(sectionHeader("presentations", sectionTitles.presentations));
    presentations.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`presentation-${item.id}`, (
        <div>
          <EntryHeading primary={item.title} secondary={item.event} dateRange={formatPartialDate(item.date)} />
          {item.location.trim() && <p style={{ ...bodyStyle, marginTop: "2px" }}>Location: {item.location}</p>}
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };
  
  const addTeaching = (target: PreviewBlock[]) => {
    if (teaching.length === 0 || !document.optionalSections.includes("teachingExperiences")) return;
    target.push(sectionHeader("teachingExperiences", sectionTitles.teachingExperiences));
    teaching.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`teaching-${item.id}`, (
        <div>
          <EntryHeading primary={item.role} secondary={item.institution} dateRange={formatPartialDate(item.date)} />
          {item.location.trim() && <p style={{ ...bodyStyle, marginTop: "2px" }}>Location: {item.location}</p>}
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const addGrants = (target: PreviewBlock[]) => {
    if (grants.length === 0 || !document.optionalSections.includes("grants")) return;
    target.push(sectionHeader("grants", sectionTitles.grants));
    grants.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`grant-${item.id}`, (
        <div>
          <EntryHeading primary={item.name} secondary={item.issuer} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const addMemberships = (target: PreviewBlock[]) => {
    if (memberships.length === 0 || !document.optionalSections.includes("memberships")) return;
    target.push(sectionHeader("memberships", sectionTitles.memberships));
    memberships.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`membership-${item.id}`, (
        <div>
          <EntryHeading primary={item.role} secondary={item.organization} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const addOrganizations = (target: PreviewBlock[]) => {
    if (organizations.length === 0 || !document.optionalSections.includes("organizations")) return;
    target.push(sectionHeader("organizations", sectionTitles.organizations));
    organizations.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`organization-${item.id}`, (
        <div>
          <EntryHeading primary={item.role} secondary={item.organization} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const addLeadership = (target: PreviewBlock[]) => {
    if (leadership.length === 0 || !document.optionalSections.includes("leadership")) return;
    target.push(sectionHeader("leadership", sectionTitles.leadership));
    leadership.forEach((item) => {
      const highlights = item.highlights.filter((line) => line.trim());
      target.push(sectionContent(`leadership-${item.id}`, (
        <div>
          <EntryHeading primary={item.role} secondary={item.organization} dateRange={formatPartialDate(item.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const addReferences = (target: PreviewBlock[]) => {
    if (references.length === 0 || !document.optionalSections.includes("references")) return;
    target.push(sectionHeader("references", sectionTitles.references));
    target.push(sectionContent("references-content", (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {references.map((item) => (
          <div key={item.id}>
            <p style={{ ...entryTitleStyle }}>{item.name}</p>
            {item.title && <p style={{ ...bodyStyle, marginTop: "2px" }}>{item.title}</p>}
            {item.company && <p style={{ ...bodyStyle, marginTop: "2px" }}>{item.company}</p>}
            {item.contactInfo && <p style={{ ...bodyStyle, marginTop: "2px" }}>{item.contactInfo}</p>}
          </div>
        ))}
      </div>
    )));
  };
  
  const addOther = (target: PreviewBlock[]) => {
    if (otherEntries.length === 0 || !document.optionalSections.includes("other")) return;
    target.push(sectionHeader("other", sectionTitles.other));
    otherEntries.forEach((entry) => {
      const highlights = entry.highlights.filter((line) => line.trim());
      target.push(sectionContent(`other-entry-${entry.id}`, (
        <div>
          <EntryHeading primary={entry.name} dateRange={formatPartialDate(entry.date)} />
          {highlights.length > 0 && <div style={{ marginTop: "4px" }}>{highlights.map((line, i) => <p key={i} style={{ ...bodyStyle, marginBottom: "2px" }}>{line}</p>)}</div>}
        </div>
      )));
    });
  };

  const layout = getResumeLayout(templateId, document.optionalSections);
  const sectionBuilders: Record<LayoutSectionKey, (target: PreviewBlock[]) => void> = {
    summary: addSummary,
    experience: addExperiences,
    education: addEducation,
    skills: (target) => addSkills(target, layout.skillChips),
    projects: addProjects,
    certifications: addCertifications,
    awards: addAwards,
    volunteerExperiences: addVolunteering,
    languages: addLanguages,
    publications: addPublications,
    presentations: addPresentations,
    researchExperiences: addResearch,
    teachingExperiences: addTeaching,
    grants: addGrants,
    memberships: addMemberships,
    organizations: addOrganizations,
    leadership: addLeadership,
    references: addReferences,
    other: addOther,
  };
  layout.main.forEach((key) => sectionBuilders[key](main));
  layout.rail.forEach((key) => sectionBuilders[key](rail));

  return { main, rail };
}

/**
 * Greedily fills pages up to the measured content-area height in a single
 * pass. Blocks are atomic (never split). A section header is kept with the
 * block that follows it, so a heading is never orphaned at the bottom of a
 * page. A block taller than a whole page gets a page of its own (and is
 * clipped) rather than being moved forever.
 *
 * A small safety margin (PAGINATION_SAFETY_PX) is subtracted from the
 * available content height to account for subpixel rounding drift between
 * the off-screen measuring container and the actual print render.
 */
const PAGINATION_SAFETY_PX = 3;

export function paginateBlocks(
  blocks: PreviewBlock[],
  heights: Record<string, number>,
  firstPageReservedHeight: number,
  contentHeight: number,
  pageReservedHeight = 0,
): PreviewBlock[][] {
  if (blocks.length === 0) return [[]];
  const safeHeight = contentHeight - PAGINATION_SAFETY_PX;
  // Nothing measurable (e.g. measuring container not mounted yet): keep everything on one page.
  if (!Number.isFinite(safeHeight) || safeHeight <= 0) return [blocks];

  const heightOf = (block: PreviewBlock | undefined) => (block ? Math.max(0, heights[block.id] ?? 0) : 0);
  const pages: PreviewBlock[][] = [[]];
  let used = firstPageReservedHeight;

  blocks.forEach((block, index) => {
    const height = heightOf(block);
    // Keep a header together with the block that follows it.
    const needed = block.type === "header" ? height + heightOf(blocks[index + 1]) : height;
    const current = pages[pages.length - 1];
    // Never break directly after a header — it already reserved room for this block.
    if (current.length > 0 && used + needed > safeHeight && current[current.length - 1].type !== "header") {
      pages.push([]);
      used = pageReservedHeight;
    }
    pages[pages.length - 1].push(block);
    used += height;
  });

  const nonEmpty = pages.filter((page) => page.length > 0);
  return nonEmpty.length > 0 ? nonEmpty : [[]];
}
