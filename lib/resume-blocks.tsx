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
  "ats-classic": { fontStack: FONT_STACK_SERIF, headerAlign: "center" },
  "modern-tech": { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  executive: { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  academic: { fontStack: FONT_STACK_SERIF, headerAlign: "center" },
  research: { fontStack: FONT_STACK_SANS, headerAlign: "left" },
  professional: { fontStack: FONT_STACK_SANS, headerAlign: "left" },
};

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

export function normalizeUrl(url: string): string {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

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
export function buildTemplateBlocks(resume: ResumeData, templateId: TemplateId): { main: PreviewBlock[]; rail: PreviewBlock[] } {
  const { professionalSummary, sectionTitles } = resume;

  const experiences = sortEntriesByRecency(resume.experiences.filter(hasExperienceContent));
  const education = sortEntriesByRecency(resume.education.filter(hasEducationContent));
  
  const hasProjectContent = (item: Project) => item.name.trim();
  const projects = sortByDateDesc(resume.projects.filter(hasProjectContent));
  const certifications = sortByDateDesc(resume.certifications.filter((item) => item.name.trim()));
  const awards = sortByDateDesc(resume.awards.filter((item) => item.title.trim()));
  const hasVolunteerContent = (item: VolunteerExperience) => item.organization.trim() || item.role.trim();
  const volunteering = sortByDateDesc(resume.volunteerExperiences.filter(hasVolunteerContent));
  const organizations = sortByDateDesc(resume.organizations.filter((item) => item.organization.trim() || item.role.trim()));
  const leadership = sortByDateDesc(resume.leadership.filter((item) => item.organization.trim() || item.role.trim()));
  const teaching = sortByDateDesc(resume.teachingExperiences.filter((item) => item.role.trim() || item.institution.trim()));
  const grants = sortByDateDesc(resume.grants.filter((item) => item.name.trim() || item.issuer.trim()));
  const memberships = sortByDateDesc(resume.memberships.filter((item) => item.organization.trim() || item.role.trim()));
  const references = resume.references.filter((item) => item.name.trim());
  const languages = resume.languages.filter((item) => item.name.trim());
  const publications = sortByDateDesc(resume.publications.filter((item) => item.title.trim()));
  const presentations = sortByDateDesc(resume.presentations.filter((item) => item.title.trim()));
  const research = sortByDateDesc(resume.researchExperiences.filter((item) => item.role.trim() || item.project.trim()));
  const otherEntries = sortByDateDesc(resume.otherEntries.filter((entry) => entry.name.trim()));

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
    if (resume.skills.length === 0) return;
    target.push(sectionHeader("skills", sectionTitles.skills));
    
    if (techStyle) {
      target.push(sectionContent("skills-content", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {resume.skills.map((skill) => (
            <span key={skill} style={{ ...bodyStyle, fontWeight: 500, padding: "2px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>{skill}</span>
          ))}
        </div>
      )));
    } else {
      target.push(sectionContent("skills-content", (
        <p style={bodyStyle}>{resume.skills.join(" • ")}</p>
      )));
    }
  };

  const addProjects = (target: PreviewBlock[]) => {
    if (projects.length === 0 || !resume.optionalSections.includes("projects")) return;
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
    if (research.length === 0 || !resume.optionalSections.includes("researchExperiences")) return;
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
    if (publications.length === 0 || !resume.optionalSections.includes("publications")) return;
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
    if (certifications.length === 0 || !resume.optionalSections.includes("certifications")) return;
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
    if (languages.length === 0 || !resume.optionalSections.includes("languages")) return;
    target.push(sectionHeader("languages", sectionTitles.languages));
    target.push(sectionContent("languages-content", <p style={bodyStyle}>{languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • ")}</p>));
  };
  
  const addAwards = (target: PreviewBlock[]) => {
    if (awards.length === 0 || !resume.optionalSections.includes("awards")) return;
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
    if (volunteering.length === 0 || !resume.optionalSections.includes("volunteerExperiences")) return;
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
    if (presentations.length === 0 || !resume.optionalSections.includes("presentations")) return;
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
    if (teaching.length === 0 || !resume.optionalSections.includes("teachingExperiences")) return;
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
    if (grants.length === 0 || !resume.optionalSections.includes("grants")) return;
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
    if (memberships.length === 0 || !resume.optionalSections.includes("memberships")) return;
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
    if (organizations.length === 0 || !resume.optionalSections.includes("organizations")) return;
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
    if (leadership.length === 0 || !resume.optionalSections.includes("leadership")) return;
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
    if (references.length === 0 || !resume.optionalSections.includes("references")) return;
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
    if (otherEntries.length === 0 || !resume.optionalSections.includes("other")) return;
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

  // Build based on template
  if (templateId === "ats-classic") {
    addSummary(main);
    addExperiences(main);
    addEducation(main);
    addProjects(main);
    addSkills(main);
    addCertifications(main);
    addAwards(main);
    addLeadership(main);
    addOrganizations(main);
    addVolunteering(main);
    addLanguages(main);
    addPublications(main);
    addResearch(main);
    addTeaching(main);
    addPresentations(main);
    addGrants(main);
    addMemberships(main);
    addReferences(main);
    addOther(main);
  } 
  else if (templateId === "modern-tech") {
    addSummary(main);
    addSkills(main, true); // tech style
    addProjects(main);
    addExperiences(main);
    addEducation(main);
    addCertifications(main);
    addAwards(main);
    addLeadership(main);
    addOrganizations(main);
    addVolunteering(main);
    addLanguages(main);
    addPublications(main);
    addResearch(main);
    addTeaching(main);
    addPresentations(main);
    addGrants(main);
    addMemberships(main);
    addReferences(main);
    addOther(main);
  } 
  else if (templateId === "executive") {
    // 2 columns
    addSummary(main);
    addExperiences(main);
    addProjects(main);
    
    addSkills(rail);
    addEducation(rail);
    addCertifications(rail);
    addLanguages(rail);
    addAwards(rail);
    addLeadership(rail);
    addOrganizations(rail);
    addVolunteering(rail);
    addPublications(rail);
    addResearch(rail);
    addTeaching(rail);
    addPresentations(rail);
    addGrants(rail);
    addMemberships(rail);
    addReferences(rail);
    addOther(rail);
  }
  else if (templateId === "academic") {
    addSummary(main);
    addEducation(main);
    addExperiences(main);
    addResearch(main);
    addTeaching(main);
    addPublications(main);
    addPresentations(main);
    addAwards(main);
    addGrants(main);
    addMemberships(main);
    addCertifications(main);
    addSkills(main);
    addLanguages(main);
    addProjects(main);
    addLeadership(main);
    addOrganizations(main);
    addVolunteering(main);
    addReferences(main);
    addOther(main);
  }
  else if (templateId === "research") {
    // Research focuses on research and publications first
    addSummary(main);
    addResearch(main);
    addTeaching(main);
    addPublications(main);
    addPresentations(main);
    addEducation(main);
    addSkills(main);
    addExperiences(main);
    addProjects(main);
    addAwards(main);
    addGrants(main);
    addMemberships(main);
    addCertifications(main);
    addLeadership(main);
    addOrganizations(main);
    addVolunteering(main);
    addLanguages(main);
    addReferences(main);
    addOther(main);
  }
  else if (templateId === "professional") {
    // Modern 2-column professional CV
    addSummary(main);
    addExperiences(main);
    addProjects(main);
    
    addSkills(rail);
    addEducation(rail);
    addCertifications(rail);
    addLanguages(rail);
    addAwards(rail);
    addLeadership(rail);
    addOrganizations(rail);
    addVolunteering(rail);
    addPublications(rail);
    addResearch(rail);
    addTeaching(rail);
    addPresentations(rail);
    addGrants(rail);
    addMemberships(rail);
    addReferences(rail);
    addOther(rail);
  }

  return { main, rail };
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