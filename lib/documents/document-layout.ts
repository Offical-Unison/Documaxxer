/**
 * Renderer-independent layout rules shared by the live preview, the print/PDF
 * view, and the DOCX exporter, so every output places sections in the same
 * order, the same column, and with the same header alignment.
 */
import type { DocumentData, DocumentType, LetterDetails, OptionalSectionKey } from "@/types/document";
import type { TemplateId } from "@/lib/templates/templates";
import { COUNTRIES } from "@/lib/countries";
import { sortByDateDesc, sortEntriesByRecency } from "@/lib/format";

export type LayoutSectionKey = "summary" | "experience" | "education" | "skills" | OptionalSectionKey;

export interface ResumeLayout {
  headerAlign: "left" | "center";
  /** Sections rendered in the wide column (or the only column). */
  main: LayoutSectionKey[];
  /** Sections rendered in the narrow sidebar. Empty for one-column templates. */
  rail: LayoutSectionKey[];
  /** Renders skills as chips instead of a bullet-separated line. */
  skillChips: boolean;
}

const OPTIONAL_KEYS: OptionalSectionKey[] = [
  "projects", "certifications", "awards", "volunteerExperiences", "languages", "publications", "presentations",
  "researchExperiences", "teachingExperiences", "grants", "memberships", "organizations", "leadership", "references", "other",
];

export function isOptionalSection(key: LayoutSectionKey): key is OptionalSectionKey {
  return (OPTIONAL_KEYS as string[]).includes(key);
}

const RAIL_SECTIONS: LayoutSectionKey[] = [
  "education", "skills", "certifications", "languages", "awards", "leadership", "organizations", "volunteerExperiences",
  "publications", "researchExperiences", "teachingExperiences", "presentations", "grants", "memberships", "references", "other",
];

const RESUME_LAYOUTS: Partial<Record<TemplateId, ResumeLayout>> = {
  "ats-classic": {
    headerAlign: "center",
    skillChips: false,
    rail: [],
    main: ["summary", "experience", "education", "skills", "projects", "certifications", "awards", "leadership", "organizations", "volunteerExperiences", "languages", "publications", "researchExperiences", "teachingExperiences", "presentations", "grants", "memberships", "references", "other"],
  },
  "modern-tech": {
    headerAlign: "left",
    skillChips: true,
    rail: [],
    main: ["summary", "projects", "experience", "education", "skills", "certifications", "awards", "leadership", "organizations", "volunteerExperiences", "languages", "publications", "researchExperiences", "teachingExperiences", "presentations", "grants", "memberships", "references", "other"],
  },
  executive: {
    headerAlign: "left",
    skillChips: false,
    main: ["summary", "experience", "projects"],
    rail: RAIL_SECTIONS,
  },
  academic: {
    headerAlign: "center",
    skillChips: false,
    rail: [],
    main: ["summary", "education", "skills", "experience", "researchExperiences", "teachingExperiences", "publications", "presentations", "awards", "grants", "memberships", "certifications", "languages", "projects", "leadership", "organizations", "volunteerExperiences", "references", "other"],
  },
  research: {
    headerAlign: "left",
    skillChips: false,
    rail: [],
    main: ["summary", "researchExperiences", "teachingExperiences", "publications", "presentations", "education", "skills", "experience", "projects", "awards", "grants", "memberships", "certifications", "leadership", "organizations", "volunteerExperiences", "languages", "references", "other"],
  },
  professional: {
    headerAlign: "left",
    skillChips: false,
    main: ["summary", "experience", "projects"],
    rail: RAIL_SECTIONS,
  },
};

/**
 * Optional sections fill the template's optional slots in the order the user
 * arranged them (drag-to-reorder in the builder), while core sections keep
 * their template positions. Two-column templates reorder within each column.
 */
function applyUserOrder(slots: LayoutSectionKey[], userOrder: OptionalSectionKey[]): LayoutSectionKey[] {
  const optionalInColumn = slots.filter(isOptionalSection);
  const rank = (key: OptionalSectionKey) => {
    const index = userOrder.indexOf(key);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const ordered = [...optionalInColumn].sort((a, b) => rank(a) - rank(b) || optionalInColumn.indexOf(a) - optionalInColumn.indexOf(b));
  let next = 0;
  return slots.map((key) => (isOptionalSection(key) ? ordered[next++] : key));
}

export function getResumeLayout(templateId: string | null | undefined, optionalOrder: OptionalSectionKey[] = []): ResumeLayout {
  const base = RESUME_LAYOUTS[templateId as TemplateId] ?? RESUME_LAYOUTS["ats-classic"]!;
  return { ...base, main: applyUserOrder(base.main, optionalOrder), rail: applyUserOrder(base.rail, optionalOrder) };
}

export function isLetterType(documentType: string): boolean {
  return documentType === "cover-letter" || documentType === "authorization-letter" || documentType === "excuse-letter";
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  resume: "Resume",
  cv: "Curriculum Vitae",
  "cover-letter": "Cover Letter",
  "authorization-letter": "Authorization Letter",
  "excuse-letter": "Excuse Letter",
};

const FILE_SUFFIXES: Record<DocumentType, string> = {
  resume: "Resume",
  cv: "CV",
  "cover-letter": "Cover_Letter",
  "authorization-letter": "Authorization_Letter",
  "excuse-letter": "Excuse_Letter",
};

export function getContactLine(document: DocumentData): string {
  const contact = document.personalDetails.contact;
  const dial = COUNTRIES.find((country) => country.code === contact.phoneCountry)?.dial ?? "+63";
  const phoneLine = contact.phoneNumber ? `${dial} ${contact.phoneNumber}` : "";
  return [contact.location, contact.email, phoneLine].filter(Boolean).join("  •  ");
}

export function getAuthorName(document: DocumentData, documentType: string): string {
  if (isLetterType(documentType)) return document.letterDetails?.senderName.trim() ?? "";
  return `${document.personalDetails.firstName} ${document.personalDetails.lastName}`.trim();
}

/** Builds a filesystem-safe export name, e.g. "Juan_Dela_Cruz_Resume". */
export function getExportBaseName(document: DocumentData, documentType: string): string {
  const suffix = FILE_SUFFIXES[documentType as DocumentType] ?? "Document";
  const author = getAuthorName(document, documentType)
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
  return author ? `${author}_${suffix}` : suffix;
}

/* ── Letters ──────────────────────────────────────────────── */

export type LetterStyle = "classic" | "modern" | "minimal";

const LETTER_STYLES: Record<string, LetterStyle> = {
  "cover-letter-classic": "classic",
  "cover-letter-modern": "modern",
  "cover-letter-minimal": "minimal",
  "authorization-letter-formal": "classic",
  "authorization-letter-business": "modern",
  "authorization-letter-simple": "minimal",
  "excuse-letter-school": "classic",
  "excuse-letter-work": "modern",
  "excuse-letter-medical": "minimal",
};

export function getLetterStyle(templateId: string | null | undefined): LetterStyle {
  return LETTER_STYLES[templateId ?? ""] ?? "classic";
}

const LONG_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Formats an ISO "YYYY-MM-DD" date as "October 30, 2026"; other text is returned unchanged. */
export function formatLetterDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value.trim();
  const month = LONG_MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${Number(match[3])}, ${match[1]}` : value.trim();
}

export interface LetterContent {
  style: LetterStyle;
  senderName: string;
  /** Sender address/email/phone lines (without the name). */
  senderLines: string[];
  date: string;
  recipientLines: string[];
  subject: string;
  salutation: string;
  /** Labelled facts specific to the letter type, e.g. "Authorized person: …". */
  details: string[];
  /** Body split into paragraphs on blank lines; single newlines are kept inside a paragraph. */
  paragraphs: string[];
  closing: string;
}

export function buildLetterContent(details: LetterDetails, documentType: string, templateId: string | null | undefined): LetterContent {
  const facts = documentType === "authorization-letter"
    ? [details.authorizedPerson.trim() && `Authorized person: ${details.authorizedPerson.trim()}`, details.purpose.trim() && `Purpose: ${details.purpose.trim()}`]
    : documentType === "excuse-letter"
      ? [details.absentDate.trim() && `Date of absence: ${formatLetterDate(details.absentDate)}`, details.reason.trim() && `Reason: ${details.reason.trim()}`]
      : [];

  return {
    style: getLetterStyle(templateId),
    senderName: details.senderName.trim(),
    senderLines: [details.senderAddress, details.senderEmail, details.senderPhone].map((line) => line.trim()).filter(Boolean),
    date: formatLetterDate(details.date),
    recipientLines: [details.recipientName, details.recipientTitle, details.recipientOrganization, details.recipientAddress].map((line) => line.trim()).filter(Boolean),
    subject: details.subject.trim(),
    salutation: details.salutation.trim(),
    details: facts.filter((fact): fact is string => Boolean(fact)),
    paragraphs: details.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    closing: details.closing.trim(),
  };
}

/** Closing line, a signature gap, then the sender's name. */
export function getLetterSignOff(letter: LetterContent): string {
  if (letter.closing && letter.senderName) return `${letter.closing}\n\n\n${letter.senderName}`;
  return letter.closing || letter.senderName;
}

/* ── Resume / CV entries ──────────────────────────────────── */

/**
 * Entries that actually render, filtered and sorted exactly as every output
 * shows them. Optional sections that the user has not added are empty.
 */
export function selectVisibleEntries(document: DocumentData) {
  const enabled = new Set(document.optionalSections);
  const optional = <T>(key: OptionalSectionKey, items: T[]): T[] => (enabled.has(key) ? items : []);
  const has = (value: string | undefined) => Boolean(value?.trim());

  return {
    experiences: sortEntriesByRecency(document.experiences.filter((item) => has(item.employer) || has(item.role))),
    education: sortEntriesByRecency(document.education.filter((item) => has(item.institution))),
    skills: document.skills.filter(has),
    projects: optional("projects", sortByDateDesc(document.projects.filter((item) => has(item.name)))),
    certifications: optional("certifications", sortByDateDesc(document.certifications.filter((item) => has(item.name)))),
    awards: optional("awards", sortByDateDesc(document.awards.filter((item) => has(item.title)))),
    volunteerExperiences: optional("volunteerExperiences", sortByDateDesc(document.volunteerExperiences.filter((item) => has(item.organization) || has(item.role)))),
    languages: optional("languages", document.languages.filter((item) => has(item.name))),
    publications: optional("publications", sortByDateDesc(document.publications.filter((item) => has(item.title)))),
    presentations: optional("presentations", sortByDateDesc(document.presentations.filter((item) => has(item.title)))),
    researchExperiences: optional("researchExperiences", sortByDateDesc(document.researchExperiences.filter((item) => has(item.role) || has(item.project)))),
    teachingExperiences: optional("teachingExperiences", sortByDateDesc(document.teachingExperiences.filter((item) => has(item.role) || has(item.institution)))),
    grants: optional("grants", sortByDateDesc(document.grants.filter((item) => has(item.name) || has(item.issuer)))),
    memberships: optional("memberships", sortByDateDesc(document.memberships.filter((item) => has(item.organization) || has(item.role)))),
    organizations: optional("organizations", sortByDateDesc(document.organizations.filter((item) => has(item.organization) || has(item.role)))),
    leadership: optional("leadership", sortByDateDesc(document.leadership.filter((item) => has(item.organization) || has(item.role)))),
    references: optional("references", document.references.filter((item) => has(item.name))),
    otherEntries: optional("other", sortByDateDesc(document.otherEntries.filter((item) => has(item.name)))),
  };
}

export function normalizeUrl(url: string): string {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
