import type { Award, Certification, Education, Experience, Language, OptionalSectionKey, OtherEntry, PersonalDetails, Project, Publication, Presentation, ResearchExperience, TeachingExperience, Grant, Membership, OrganizationRole, LeadershipExperience, Reference, DocumentData, DocumentState, SectionId, VolunteerExperience } from "@/types/document";
import { DEFAULT_TEMPLATE_ID } from "@/lib/templates";
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
  | { type: "SET_DOCUMENT_TYPE"; payload: "resume" | "cv" }
  | { type: "UNLOCK_GENERATE" }
  | { type: "RESET_DOCUMENT" };

export function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  switch (action.type) {
    case "SET_DOCUMENT": return { ...state, document: action.payload };
    case "SET_ACTIVE_SECTION": return { ...state, activeSection: action.payload };
    case "SET_TEMPLATE": return { ...state, selectedTemplateId: action.payload };
    case "SET_FONT": return { ...state, selectedFontId: action.payload };
    case "UPDATE_PERSONAL_DETAILS": return { ...state, document: { ...state.document, personalDetails: action.payload } };
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
    case "RESET_DOCUMENT": return initialDocumentState;
    default: return state;
  }
}