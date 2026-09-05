/**
 * Full schema definitions for all built-in templates.
 *
 * Each TemplateDefinition declaratively describes the sections, fields,
 * layout, and ordering of a template — derived from the rendering logic
 * previously hardcoded in document-blocks.tsx.
 *
 * This file is the single source of truth for template structure.
 */

import type { TemplateDefinition, TemplateField, TemplateSection } from "@/types/template";
import type { SectionId } from "@/types/document";
import type { TemplateId } from "./templates";

// ── Shared Field Definitions ─────────────────────────────────
// Reusable field sets for common section types. Each section that
// appears in multiple templates shares the same field schema.

const personalFields: TemplateField[] = [
  { id: "firstName", key: "personalDetails.firstName", label: "First Name", type: "text", required: true, placeholder: "Juan", profileMapping: "profile.firstName" },
  { id: "lastName", key: "personalDetails.lastName", label: "Last Name", type: "text", required: true, placeholder: "Dela Cruz", profileMapping: "profile.lastName" },
  { id: "headline", key: "personalDetails.headline", label: "Professional Headline", type: "text", required: false, placeholder: "Software Engineer" },
  { id: "email", key: "personalDetails.contact.email", label: "Email", type: "email", required: true, placeholder: "juan@email.com", profileMapping: "profile.email" },
  { id: "phone", key: "personalDetails.contact.phoneNumber", label: "Phone Number", type: "phone", required: false, placeholder: "0917 123 4567", profileMapping: "profile.phone" },
  { id: "location", key: "personalDetails.contact.location", label: "Location", type: "text", required: false, placeholder: "Manila, Philippines", profileMapping: "profile.location" },
  { id: "links", key: "personalDetails.links", label: "Links", type: "list", required: false, placeholder: "linkedin.com/in/juandelacruz" },
];

const summaryFields: TemplateField[] = [
  { id: "summary", key: "professionalSummary", label: "Professional Summary", type: "textarea", required: false, placeholder: "Briefly describe your professional background and key strengths..." },
];

const experienceFields: TemplateField[] = [
  { id: "role", key: "role", label: "Job Title", type: "text", required: true, placeholder: "Software Engineer" },
  { id: "employer", key: "employer", label: "Company", type: "text", required: true, placeholder: "Accenture Philippines" },
  { id: "location", key: "location", label: "Location", type: "text", required: false, placeholder: "Makati, Metro Manila" },
  { id: "startDate", key: "startDate", label: "Start Date", type: "date", required: false },
  { id: "endDate", key: "endDate", label: "End Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Key Achievements", type: "list", required: false, placeholder: "Describe what you accomplished..." },
];

const educationFields: TemplateField[] = [
  { id: "institution", key: "institution", label: "School / University", type: "text", required: true, placeholder: "University of the Philippines" },
  { id: "degree", key: "degree", label: "Degree", type: "text", required: false, placeholder: "Bachelor of Science" },
  { id: "fieldOfStudy", key: "fieldOfStudy", label: "Field of Study", type: "text", required: false, placeholder: "Computer Science" },
  { id: "location", key: "location", label: "Location", type: "text", required: false, placeholder: "Quezon City" },
  { id: "startDate", key: "startDate", label: "Start Date", type: "date", required: false },
  { id: "endDate", key: "endDate", label: "End Date", type: "date", required: false },
  { id: "gradeLabel", key: "gradeLabel", label: "Grade Label", type: "text", required: false, placeholder: "GWA" },
  { id: "gradeValue", key: "gradeValue", label: "Grade Value", type: "text", required: false, placeholder: "1.50" },
  { id: "awards", key: "awards", label: "Academic Awards", type: "list", required: false, placeholder: "Dean's List, Cum Laude" },
];

const skillsFields: TemplateField[] = [
  { id: "skills", key: "skills", label: "Skills", type: "list", required: false, placeholder: "Add a skill..." },
];

const projectFields: TemplateField[] = [
  { id: "name", key: "name", label: "Project Name", type: "text", required: true, placeholder: "Portfolio Website" },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "technologies", key: "technologies", label: "Technologies", type: "list", required: false, placeholder: "React, TypeScript" },
  { id: "highlights", key: "highlights", label: "Description", type: "list", required: false, placeholder: "Describe the project..." },
];

const certificationFields: TemplateField[] = [
  { id: "name", key: "name", label: "Certification Name", type: "text", required: true, placeholder: "AWS Solutions Architect" },
  { id: "issuingOrganization", key: "issuingOrganization", label: "Issuing Organization", type: "text", required: false, placeholder: "Amazon Web Services" },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
];

const awardFields: TemplateField[] = [
  { id: "title", key: "title", label: "Award Title", type: "text", required: true, placeholder: "Employee of the Year" },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const volunteerFields: TemplateField[] = [
  { id: "organization", key: "organization", label: "Organization", type: "text", required: true, placeholder: "Red Cross Philippines" },
  { id: "role", key: "role", label: "Role", type: "text", required: false, placeholder: "Volunteer Coordinator" },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const languageFields: TemplateField[] = [
  { id: "name", key: "name", label: "Language", type: "text", required: true, placeholder: "Filipino" },
  { id: "proficiency", key: "proficiency", label: "Proficiency", type: "select", required: false, options: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"] },
];

const publicationFields: TemplateField[] = [
  { id: "title", key: "title", label: "Title", type: "text", required: true, placeholder: "A Study on..." },
  { id: "authors", key: "authors", label: "Authors", type: "text", required: false },
  { id: "publisher", key: "publisher", label: "Publisher / Journal", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "url", key: "url", label: "URL", type: "url", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const presentationFields: TemplateField[] = [
  { id: "title", key: "title", label: "Title", type: "text", required: true },
  { id: "event", key: "event", label: "Event / Conference", type: "text", required: false },
  { id: "location", key: "location", label: "Location", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const researchFields: TemplateField[] = [
  { id: "role", key: "role", label: "Role", type: "text", required: true, placeholder: "Research Assistant" },
  { id: "organization", key: "organization", label: "Organization", type: "text", required: false },
  { id: "project", key: "project", label: "Project", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const teachingFields: TemplateField[] = [
  { id: "role", key: "role", label: "Role", type: "text", required: true, placeholder: "Teaching Assistant" },
  { id: "institution", key: "institution", label: "Institution", type: "text", required: false },
  { id: "location", key: "location", label: "Location", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const grantFields: TemplateField[] = [
  { id: "name", key: "name", label: "Grant Name", type: "text", required: true },
  { id: "issuer", key: "issuer", label: "Issuer", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const membershipFields: TemplateField[] = [
  { id: "organization", key: "organization", label: "Organization", type: "text", required: true },
  { id: "role", key: "role", label: "Role", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const organizationFields: TemplateField[] = [
  { id: "organization", key: "organization", label: "Organization", type: "text", required: true },
  { id: "role", key: "role", label: "Role", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const leadershipFields: TemplateField[] = [
  { id: "role", key: "role", label: "Role", type: "text", required: true },
  { id: "organization", key: "organization", label: "Organization", type: "text", required: false },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

const referenceFields: TemplateField[] = [
  { id: "name", key: "name", label: "Name", type: "text", required: true },
  { id: "title", key: "title", label: "Title", type: "text", required: false },
  { id: "company", key: "company", label: "Company", type: "text", required: false },
  { id: "contactInfo", key: "contactInfo", label: "Contact Info", type: "text", required: false },
];

const otherFields: TemplateField[] = [
  { id: "name", key: "name", label: "Entry Name", type: "text", required: true },
  { id: "date", key: "date", label: "Date", type: "date", required: false },
  { id: "highlights", key: "highlights", label: "Details", type: "list", required: false },
];

// ── Section Builder ──────────────────────────────────────────
// Helper to build a TemplateSection with defaults.

interface SectionDef {
  type: SectionId;
  title: string;
  fields: TemplateField[];
  required?: boolean;
  repeatable?: boolean;
  column?: "main" | "rail";
}

function buildSections(defs: SectionDef[]): TemplateSection[] {
  return defs.map((def, i) => ({
    id: def.type,
    type: def.type,
    title: def.title,
    order: i,
    required: def.required ?? false,
    fields: def.fields,
    repeatable: def.repeatable,
    column: def.column,
  }));
}

// ── Common Section Definitions ───────────────────────────────
// Ordered arrays of sections per template. The ordering matches
// exactly what document-blocks.tsx renders for each template.

const CORE_SECTIONS: SectionDef[] = [
  { type: "personal", title: "Personal Information", fields: personalFields, required: true },
];

const OPTIONAL_SECTIONS_STANDARD: SectionDef[] = [
  { type: "projects", title: "Projects", fields: projectFields, repeatable: true },
  { type: "certifications", title: "Certifications", fields: certificationFields, repeatable: true },
  { type: "awards", title: "Awards", fields: awardFields, repeatable: true },
  { type: "leadership", title: "Leadership", fields: leadershipFields, repeatable: true },
  { type: "organizations", title: "Organizations", fields: organizationFields, repeatable: true },
  { type: "volunteerExperiences", title: "Volunteer Experience", fields: volunteerFields, repeatable: true },
  { type: "languages", title: "Languages", fields: languageFields, repeatable: true },
  { type: "publications", title: "Publications", fields: publicationFields, repeatable: true },
  { type: "researchExperiences", title: "Research Experience", fields: researchFields, repeatable: true },
  { type: "teachingExperiences", title: "Teaching Experience", fields: teachingFields, repeatable: true },
  { type: "presentations", title: "Presentations", fields: presentationFields, repeatable: true },
  { type: "grants", title: "Grants & Fellowships", fields: grantFields, repeatable: true },
  { type: "memberships", title: "Professional Memberships", fields: membershipFields, repeatable: true },
  { type: "references", title: "References", fields: referenceFields, repeatable: true },
  { type: "other", title: "Other", fields: otherFields, repeatable: true },
];

const ISO_NOW = "2025-01-01T00:00:00Z";

// ── Template Definitions ─────────────────────────────────────

/**
 * ATS Classic — single-column, center-aligned, traditional ordering.
 * Best for: ATS parsing, traditional industries.
 */
const atsClassic: TemplateDefinition = {
  id: "ats-classic",
  name: "ATS Classic",
  description: "A traditional, highly readable, ATS-friendly document.",
  documentType: "resume",
  builtIn: true,
  layout: { columns: 1, headerAlignment: "center" },
  sections: buildSections([
    ...CORE_SECTIONS,
    { type: "summary", title: "Professional Summary", fields: summaryFields },
    { type: "experience", title: "Work Experience", fields: experienceFields, repeatable: true },
    { type: "education", title: "Education", fields: educationFields, repeatable: true },
    { type: "skills", title: "Skills", fields: skillsFields },
    ...OPTIONAL_SECTIONS_STANDARD,
  ]),
  createdAt: ISO_NOW,
  updatedAt: ISO_NOW,
};

/**
 * Modern Tech — single-column, left-aligned, projects-first ordering.
 * Best for: Software engineers, IT professionals, tech roles.
 */
const modernTech: TemplateDefinition = {
  id: "modern-tech",
  name: "Modern Tech",
  description: "Modern document suited for Information Technology and software.",
  documentType: "resume",
  builtIn: true,
  layout: { columns: 1, headerAlignment: "left" },
  sections: buildSections([
    ...CORE_SECTIONS,
    { type: "summary", title: "Professional Summary", fields: summaryFields },
    { type: "projects", title: "Projects", fields: projectFields, repeatable: true },
    { type: "experience", title: "Work Experience", fields: experienceFields, repeatable: true },
    { type: "education", title: "Education", fields: educationFields, repeatable: true },
    { type: "skills", title: "Skills", fields: skillsFields },
    { type: "certifications", title: "Certifications", fields: certificationFields, repeatable: true },
    { type: "awards", title: "Awards", fields: awardFields, repeatable: true },
    { type: "leadership", title: "Leadership", fields: leadershipFields, repeatable: true },
    { type: "organizations", title: "Organizations", fields: organizationFields, repeatable: true },
    { type: "volunteerExperiences", title: "Volunteer Experience", fields: volunteerFields, repeatable: true },
    { type: "languages", title: "Languages", fields: languageFields, repeatable: true },
    { type: "publications", title: "Publications", fields: publicationFields, repeatable: true },
    { type: "researchExperiences", title: "Research Experience", fields: researchFields, repeatable: true },
    { type: "teachingExperiences", title: "Teaching Experience", fields: teachingFields, repeatable: true },
    { type: "presentations", title: "Presentations", fields: presentationFields, repeatable: true },
    { type: "grants", title: "Grants & Fellowships", fields: grantFields, repeatable: true },
    { type: "memberships", title: "Professional Memberships", fields: membershipFields, repeatable: true },
    { type: "references", title: "References", fields: referenceFields, repeatable: true },
    { type: "other", title: "Other", fields: otherFields, repeatable: true },
  ]),
  createdAt: ISO_NOW,
  updatedAt: ISO_NOW,
};

/**
 * Executive — two-column, left-aligned, experience-focused.
 * Best for: Senior professionals, managers, executives.
 */
const executive: TemplateDefinition = {
  id: "executive",
  name: "Executive",
  description: "Polished two-column document for experienced professionals.",
  documentType: "resume",
  builtIn: true,
  layout: { columns: 2, headerAlignment: "left", sidebarRatio: 0.65 },
  sections: buildSections([
    ...CORE_SECTIONS,
    // Main column
    { type: "summary", title: "Professional Summary", fields: summaryFields, column: "main" },
    { type: "experience", title: "Work Experience", fields: experienceFields, repeatable: true, column: "main" },
    { type: "projects", title: "Projects", fields: projectFields, repeatable: true, column: "main" },
    // Rail column
    { type: "education", title: "Education", fields: educationFields, repeatable: true, column: "rail" },
    { type: "skills", title: "Skills", fields: skillsFields, column: "rail" },
    { type: "certifications", title: "Certifications", fields: certificationFields, repeatable: true, column: "rail" },
    { type: "languages", title: "Languages", fields: languageFields, repeatable: true, column: "rail" },
    { type: "awards", title: "Awards", fields: awardFields, repeatable: true, column: "rail" },
    { type: "leadership", title: "Leadership", fields: leadershipFields, repeatable: true, column: "rail" },
    { type: "organizations", title: "Organizations", fields: organizationFields, repeatable: true, column: "rail" },
    { type: "volunteerExperiences", title: "Volunteer Experience", fields: volunteerFields, repeatable: true, column: "rail" },
    { type: "publications", title: "Publications", fields: publicationFields, repeatable: true, column: "rail" },
    { type: "researchExperiences", title: "Research Experience", fields: researchFields, repeatable: true, column: "rail" },
    { type: "teachingExperiences", title: "Teaching Experience", fields: teachingFields, repeatable: true, column: "rail" },
    { type: "presentations", title: "Presentations", fields: presentationFields, repeatable: true, column: "rail" },
    { type: "grants", title: "Grants & Fellowships", fields: grantFields, repeatable: true, column: "rail" },
    { type: "memberships", title: "Professional Memberships", fields: membershipFields, repeatable: true, column: "rail" },
    { type: "references", title: "References", fields: referenceFields, repeatable: true, column: "rail" },
    { type: "other", title: "Other", fields: otherFields, repeatable: true, column: "rail" },
  ]),
  createdAt: ISO_NOW,
  updatedAt: ISO_NOW,
};

/**
 * Academic — single-column, center-aligned, education & research first.
 * Best for: Faculty applications, university positions.
 */
const academic: TemplateDefinition = {
  id: "academic",
  name: "Academic",
  description: "Traditional academic document for university and faculty applications.",
  documentType: "cv",
  builtIn: true,
  layout: { columns: 1, headerAlignment: "center" },
  sections: buildSections([
    ...CORE_SECTIONS,
    { type: "summary", title: "Professional Summary", fields: summaryFields },
    { type: "education", title: "Education", fields: educationFields, repeatable: true },
    { type: "skills", title: "Skills", fields: skillsFields },
    { type: "experience", title: "Work Experience", fields: experienceFields, repeatable: true },
    { type: "researchExperiences", title: "Research Experience", fields: researchFields, repeatable: true },
    { type: "teachingExperiences", title: "Teaching Experience", fields: teachingFields, repeatable: true },
    { type: "publications", title: "Publications", fields: publicationFields, repeatable: true },
    { type: "presentations", title: "Presentations", fields: presentationFields, repeatable: true },
    { type: "awards", title: "Awards", fields: awardFields, repeatable: true },
    { type: "grants", title: "Grants & Fellowships", fields: grantFields, repeatable: true },
    { type: "memberships", title: "Professional Memberships", fields: membershipFields, repeatable: true },
    { type: "certifications", title: "Certifications", fields: certificationFields, repeatable: true },
    { type: "languages", title: "Languages", fields: languageFields, repeatable: true },
    { type: "projects", title: "Projects", fields: projectFields, repeatable: true },
    { type: "leadership", title: "Leadership", fields: leadershipFields, repeatable: true },
    { type: "organizations", title: "Organizations", fields: organizationFields, repeatable: true },
    { type: "volunteerExperiences", title: "Volunteer Experience", fields: volunteerFields, repeatable: true },
    { type: "references", title: "References", fields: referenceFields, repeatable: true },
    { type: "other", title: "Other", fields: otherFields, repeatable: true },
  ]),
  createdAt: ISO_NOW,
  updatedAt: ISO_NOW,
};

/**
 * Research — single-column, left-aligned, research & publications first.
 * Best for: Scientists, researchers, technical professionals.
 */
const research: TemplateDefinition = {
  id: "research",
  name: "Research",
  description: "Research-focused document for scientists and technical professionals.",
  documentType: "cv",
  builtIn: true,
  layout: { columns: 1, headerAlignment: "left" },
  sections: buildSections([
    ...CORE_SECTIONS,
    { type: "summary", title: "Professional Summary", fields: summaryFields },
    { type: "researchExperiences", title: "Research Experience", fields: researchFields, repeatable: true },
    { type: "teachingExperiences", title: "Teaching Experience", fields: teachingFields, repeatable: true },
    { type: "publications", title: "Publications", fields: publicationFields, repeatable: true },
    { type: "presentations", title: "Presentations", fields: presentationFields, repeatable: true },
    { type: "education", title: "Education", fields: educationFields, repeatable: true },
    { type: "skills", title: "Skills", fields: skillsFields },
    { type: "experience", title: "Work Experience", fields: experienceFields, repeatable: true },
    { type: "projects", title: "Projects", fields: projectFields, repeatable: true },
    { type: "awards", title: "Awards", fields: awardFields, repeatable: true },
    { type: "grants", title: "Grants & Fellowships", fields: grantFields, repeatable: true },
    { type: "memberships", title: "Professional Memberships", fields: membershipFields, repeatable: true },
    { type: "certifications", title: "Certifications", fields: certificationFields, repeatable: true },
    { type: "leadership", title: "Leadership", fields: leadershipFields, repeatable: true },
    { type: "organizations", title: "Organizations", fields: organizationFields, repeatable: true },
    { type: "volunteerExperiences", title: "Volunteer Experience", fields: volunteerFields, repeatable: true },
    { type: "languages", title: "Languages", fields: languageFields, repeatable: true },
    { type: "references", title: "References", fields: referenceFields, repeatable: true },
    { type: "other", title: "Other", fields: otherFields, repeatable: true },
  ]),
  createdAt: ISO_NOW,
  updatedAt: ISO_NOW,
};

/**
 * Professional — two-column, left-aligned, comprehensive CV.
 * Best for: Experienced professionals with broad career histories.
 */
const professional: TemplateDefinition = {
  id: "professional",
  name: "Professional",
  description: "Comprehensive professional history for experienced professionals.",
  documentType: "cv",
  builtIn: true,
  layout: { columns: 2, headerAlignment: "left", sidebarRatio: 0.65 },
  sections: buildSections([
    ...CORE_SECTIONS,
    // Main column
    { type: "summary", title: "Professional Summary", fields: summaryFields, column: "main" },
    { type: "experience", title: "Work Experience", fields: experienceFields, repeatable: true, column: "main" },
    { type: "projects", title: "Projects", fields: projectFields, repeatable: true, column: "main" },
    // Rail column
    { type: "education", title: "Education", fields: educationFields, repeatable: true, column: "rail" },
    { type: "skills", title: "Skills", fields: skillsFields, column: "rail" },
    { type: "certifications", title: "Certifications", fields: certificationFields, repeatable: true, column: "rail" },
    { type: "languages", title: "Languages", fields: languageFields, repeatable: true, column: "rail" },
    { type: "awards", title: "Awards", fields: awardFields, repeatable: true, column: "rail" },
    { type: "leadership", title: "Leadership", fields: leadershipFields, repeatable: true, column: "rail" },
    { type: "organizations", title: "Organizations", fields: organizationFields, repeatable: true, column: "rail" },
    { type: "volunteerExperiences", title: "Volunteer Experience", fields: volunteerFields, repeatable: true, column: "rail" },
    { type: "publications", title: "Publications", fields: publicationFields, repeatable: true, column: "rail" },
    { type: "researchExperiences", title: "Research Experience", fields: researchFields, repeatable: true, column: "rail" },
    { type: "teachingExperiences", title: "Teaching Experience", fields: teachingFields, repeatable: true, column: "rail" },
    { type: "presentations", title: "Presentations", fields: presentationFields, repeatable: true, column: "rail" },
    { type: "grants", title: "Grants & Fellowships", fields: grantFields, repeatable: true, column: "rail" },
    { type: "memberships", title: "Professional Memberships", fields: membershipFields, repeatable: true, column: "rail" },
    { type: "references", title: "References", fields: referenceFields, repeatable: true, column: "rail" },
    { type: "other", title: "Other", fields: otherFields, repeatable: true, column: "rail" },
  ]),
  createdAt: ISO_NOW,
  updatedAt: ISO_NOW,
};

// ── Exported Registry ────────────────────────────────────────

/** Full schema definitions for all built-in templates, keyed by TemplateId */
export const TEMPLATE_DEFINITIONS: Record<TemplateId, TemplateDefinition> = {
  "ats-classic": atsClassic,
  "modern-tech": modernTech,
  executive,
  academic,
  research,
  professional,
};

