import type { Award, Certification, Education, Experience, Language, OptionalSectionKey, OtherEntry, PersonalDetails, Project, Publication, Presentation, ResearchExperience, TeachingExperience, Grant, Membership, OrganizationRole, LeadershipExperience, Reference, DocumentData, DocumentState, SectionId, VolunteerExperience, DocumentType, LetterDetails } from "@/types/document";
import { DEFAULT_TEMPLATE_ID } from "@/lib/templates/templates";
import { DEFAULT_FONT_ID } from "@/lib/fonts";

export const DEFAULT_SECTION_TITLES: Record<SectionId, string> = {
  personal: "Personal Information",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
  volunteerExperiences: "Volunteer Experience",
  languages: "Languages",
  publications: "Publications",
  presentations: "Presentations",
  researchExperiences: "Research Experience",
  teachingExperiences: "Teaching Experience",
  grants: "Grants & Fellowships",
  memberships: "Professional Memberships",
  organizations: "Organizations",
  leadership: "Leadership",
  references: "References",
  other: "Other",
};

export const initialDocumentData: DocumentData = {
  personalDetails: {
    firstName: "", lastName: "", headline: "",
    contact: { email: "", phoneCountry: "PH", phoneNumber: "", location: "" },
    links: [],
  },
  professionalSummary: "",
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteerExperiences: [],
  publications: [],
  presentations: [],
  researchExperiences: [],
  teachingExperiences: [],
  grants: [],
  memberships: [],
  organizations: [],
  leadership: [],
  references: [],
  otherEntries: [],
  optionalSections: [],
  sectionTitles: { ...DEFAULT_SECTION_TITLES },
  letterDetails: {
    senderName: "", senderAddress: "", senderEmail: "", senderPhone: "", recipientName: "", recipientTitle: "", recipientOrganization: "", recipientAddress: "", date: "", subject: "", salutation: "Dear Sir or Madam,", body: "", closing: "Sincerely,", authorizedPerson: "", purpose: "", absentDate: "", reason: "",
  },
};

export const initialDocumentState: DocumentState = {
  documentType: "resume",
  document: initialDocumentData,
  activeSection: null,
  selectedTemplateId: DEFAULT_TEMPLATE_ID,
  selectedFontId: DEFAULT_FONT_ID,
  generateUnlocked: false,
};

export type DocumentAction =
  | { type: "SET_DOCUMENT"; payload: DocumentData }
  | { type: "SET_ACTIVE_SECTION"; payload: string | null }
  | { type: "SET_TEMPLATE"; payload: string | null }
  | { type: "SET_FONT"; payload: string | null }
  | { type: "UPDATE_PERSONAL_DETAILS"; payload: PersonalDetails }
  | { type: "SET_LETTER_DETAILS"; payload: LetterDetails }
  | { type: "SET_PROFESSIONAL_SUMMARY"; payload: string }
  | { type: "SET_EXPERIENCES"; payload: Experience[] }
  | { type: "SET_EDUCATION"; payload: Education[] }
  | { type: "SET_SKILLS"; payload: string[] }
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_CERTIFICATIONS"; payload: Certification[] }
  | { type: "SET_AWARDS"; payload: Award[] }
  | { type: "SET_VOLUNTEER_EXPERIENCES"; payload: VolunteerExperience[] }
  | { type: "SET_LANGUAGES"; payload: Language[] }
  | { type: "SET_PUBLICATIONS"; payload: Publication[] }
  | { type: "SET_PRESENTATIONS"; payload: Presentation[] }
  | { type: "SET_RESEARCH_EXPERIENCES"; payload: ResearchExperience[] }
  | { type: "SET_TEACHING_EXPERIENCES"; payload: TeachingExperience[] }
  | { type: "SET_GRANTS"; payload: Grant[] }
  | { type: "SET_MEMBERSHIPS"; payload: Membership[] }
  | { type: "SET_ORGANIZATIONS"; payload: OrganizationRole[] }
  | { type: "SET_LEADERSHIP"; payload: LeadershipExperience[] }
  | { type: "SET_REFERENCES"; payload: Reference[] }
  | { type: "SET_OTHER_ENTRIES"; payload: OtherEntry[] }
  | { type: "SET_OPTIONAL_SECTIONS"; payload: OptionalSectionKey[] }
  | { type: "SET_SECTION_TITLE"; payload: { id: SectionId; title: string } }
  | { type: "SET_DOCUMENT_TYPE"; payload: DocumentType }
  | { type: "UNLOCK_GENERATE" }
  | { type: "SET_GENERATE_UNLOCKED"; payload: boolean }
  | { type: "APPLY_PROFILE"; payload: ProfileValues }
  | { type: "START_NEW_DOCUMENT"; payload: { documentType: DocumentType; templateId: string } }
  | { type: "RESET_DOCUMENT" };

export interface ProfileValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any -- normalizes untrusted JSON (localStorage, database) */
const asString = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);
const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const asRecord = (value: unknown): Record<string, any> => (value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, any>) : {});

/**
 * Merges possibly-partial document JSON (older localStorage drafts, saved
 * database rows) with the current defaults so every field the UI and the
 * exporters read is guaranteed to exist.
 */
export function normalizeDocumentData(raw: unknown): DocumentData {
  const data = asRecord(raw);
  const personal = asRecord(data.personalDetails);
  const contact = asRecord(personal.contact);
  const letter = asRecord(data.letterDetails);
  const defaults = initialDocumentData;
  const letterDefaults = defaults.letterDetails!;

  return {
    personalDetails: {
      firstName: asString(personal.firstName),
      lastName: asString(personal.lastName),
      headline: asString(personal.headline),
      contact: {
        email: asString(contact.email),
        phoneCountry: asString(contact.phoneCountry, defaults.personalDetails.contact.phoneCountry),
        phoneNumber: asString(contact.phoneNumber),
        location: asString(contact.location),
      },
      links: asArray(personal.links),
    },
    professionalSummary: asString(data.professionalSummary),
    experiences: asArray<Experience>(data.experiences).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    education: asArray<Education>(data.education).map((item) => ({ ...item, awards: asArray(item.awards) })),
    skills: asArray<string>(data.skills).filter((skill) => typeof skill === "string"),
    projects: asArray<Project>(data.projects).map((item) => ({ ...item, technologies: asArray<string>(item.technologies), highlights: asArray<string>(item.highlights) })),
    certifications: asArray(data.certifications),
    languages: asArray(data.languages),
    awards: asArray<Award>(data.awards).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    volunteerExperiences: asArray<VolunteerExperience>(data.volunteerExperiences).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    publications: asArray<Publication>(data.publications).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    presentations: asArray<Presentation>(data.presentations).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    researchExperiences: asArray<ResearchExperience>(data.researchExperiences).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    teachingExperiences: asArray<TeachingExperience>(data.teachingExperiences).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    grants: asArray<Grant>(data.grants).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    memberships: asArray<Membership>(data.memberships).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    organizations: asArray<OrganizationRole>(data.organizations).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    leadership: asArray<LeadershipExperience>(data.leadership).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    references: asArray(data.references),
    otherEntries: asArray<OtherEntry>(data.otherEntries).map((item) => ({ ...item, highlights: asArray<string>(item.highlights) })),
    optionalSections: asArray<OptionalSectionKey>(data.optionalSections).filter((key, index, all) => key in DEFAULT_SECTION_TITLES && all.indexOf(key) === index),
    sectionTitles: { ...DEFAULT_SECTION_TITLES, ...asRecord(data.sectionTitles) },
    letterDetails: Object.fromEntries(
      Object.entries(letterDefaults).map(([key, fallback]) => [key, asString(letter[key], fallback)]),
    ) as unknown as LetterDetails,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function applyProfile(document: DocumentData, profile: ProfileValues): DocumentData {
  const personal = document.personalDetails;
  const letter = document.letterDetails ?? initialDocumentData.letterDetails!;
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  return {
    ...document,
    personalDetails: {
      ...personal,
      firstName: personal.firstName || profile.firstName,
      lastName: personal.lastName || profile.lastName,
      contact: {
        ...personal.contact,
        email: personal.contact.email || profile.email,
        phoneNumber: personal.contact.phoneNumber || profile.phone,
        location: personal.contact.location || profile.location,
      },
    },
    letterDetails: {
      ...letter,
      senderName: letter.senderName || fullName,
      senderEmail: letter.senderEmail || profile.email,
      senderPhone: letter.senderPhone || profile.phone,
      senderAddress: letter.senderAddress || profile.location,
    },
  };
}

export function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  switch (action.type) {
    case "SET_DOCUMENT": return { ...state, document: normalizeDocumentData(action.payload) };
    case "SET_ACTIVE_SECTION": return { ...state, activeSection: action.payload };
    case "SET_TEMPLATE": return { ...state, selectedTemplateId: action.payload };
    case "SET_FONT": return { ...state, selectedFontId: action.payload };
    case "UPDATE_PERSONAL_DETAILS": return { ...state, document: { ...state.document, personalDetails: action.payload } };
    case "SET_LETTER_DETAILS": return { ...state, document: { ...state.document, letterDetails: action.payload } };
    case "SET_PROFESSIONAL_SUMMARY": return { ...state, document: { ...state.document, professionalSummary: action.payload } };
    case "SET_EXPERIENCES": return { ...state, document: { ...state.document, experiences: action.payload } };
    case "SET_EDUCATION": return { ...state, document: { ...state.document, education: action.payload } };
    case "SET_SKILLS": return { ...state, document: { ...state.document, skills: action.payload } };
    case "SET_PROJECTS": return { ...state, document: { ...state.document, projects: action.payload } };
    case "SET_CERTIFICATIONS": return { ...state, document: { ...state.document, certifications: action.payload } };
    case "SET_AWARDS": return { ...state, document: { ...state.document, awards: action.payload } };
    case "SET_VOLUNTEER_EXPERIENCES": return { ...state, document: { ...state.document, volunteerExperiences: action.payload } };
    case "SET_LANGUAGES": return { ...state, document: { ...state.document, languages: action.payload } };
    case "SET_PUBLICATIONS": return { ...state, document: { ...state.document, publications: action.payload } };
    case "SET_PRESENTATIONS": return { ...state, document: { ...state.document, presentations: action.payload } };
    case "SET_RESEARCH_EXPERIENCES": return { ...state, document: { ...state.document, researchExperiences: action.payload } };
    case "SET_TEACHING_EXPERIENCES": return { ...state, document: { ...state.document, teachingExperiences: action.payload } };
    case "SET_GRANTS": return { ...state, document: { ...state.document, grants: action.payload } };
    case "SET_MEMBERSHIPS": return { ...state, document: { ...state.document, memberships: action.payload } };
    case "SET_ORGANIZATIONS": return { ...state, document: { ...state.document, organizations: action.payload } };
    case "SET_LEADERSHIP": return { ...state, document: { ...state.document, leadership: action.payload } };
    case "SET_REFERENCES": return { ...state, document: { ...state.document, references: action.payload } };
    case "SET_OTHER_ENTRIES": return { ...state, document: { ...state.document, otherEntries: action.payload } };
    case "SET_OPTIONAL_SECTIONS": return { ...state, document: { ...state.document, optionalSections: action.payload } };
    case "SET_SECTION_TITLE": return { ...state, document: { ...state.document, sectionTitles: { ...state.document.sectionTitles, [action.payload.id]: action.payload.title } } };
    case "SET_DOCUMENT_TYPE": return { ...state, documentType: action.payload };
    case "UNLOCK_GENERATE": return { ...state, generateUnlocked: true };
    case "SET_GENERATE_UNLOCKED": return { ...state, generateUnlocked: action.payload };
    case "APPLY_PROFILE": return { ...state, document: applyProfile(state.document, action.payload) };
    case "START_NEW_DOCUMENT": return { ...initialDocumentState, documentType: action.payload.documentType, selectedTemplateId: action.payload.templateId, selectedFontId: state.selectedFontId };
    case "RESET_DOCUMENT": return initialDocumentState;
    default: return state;
  }
}