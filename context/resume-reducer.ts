import type { Award, Certification, Education, Experience, Language, OptionalSectionKey, OtherEntry, PersonalDetails, Project, ResumeData, ResumeState, SectionId, VolunteerExperience } from "@/types/resume";
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
  other: "Other",
};

export const initialResumeData: ResumeData = {
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
  otherEntries: [],
  optionalSections: [],
  sectionTitles: { ...DEFAULT_SECTION_TITLES },
};

export const initialResumeState: ResumeState = {
  resume: initialResumeData,
  activeSection: null,
  selectedTemplateId: DEFAULT_TEMPLATE_ID,
  selectedFontId: DEFAULT_FONT_ID,
  generateUnlocked: false,
};

export type ResumeAction =
  | { type: "SET_RESUME"; payload: ResumeData }
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
  | { type: "SET_OTHER_ENTRIES"; payload: OtherEntry[] }
  | { type: "SET_OPTIONAL_SECTIONS"; payload: OptionalSectionKey[] }
  | { type: "SET_SECTION_TITLE"; payload: { id: SectionId; title: string } }
  | { type: "UNLOCK_GENERATE" }
  | { type: "RESET_RESUME" };

export function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case "SET_RESUME": return { ...state, resume: action.payload };
    case "SET_ACTIVE_SECTION": return { ...state, activeSection: action.payload };
    case "SET_TEMPLATE": return { ...state, selectedTemplateId: action.payload };
    case "SET_FONT": return { ...state, selectedFontId: action.payload };
    case "UPDATE_PERSONAL_DETAILS": return { ...state, resume: { ...state.resume, personalDetails: action.payload } };
    case "SET_PROFESSIONAL_SUMMARY": return { ...state, resume: { ...state.resume, professionalSummary: action.payload } };
    case "SET_EXPERIENCES": return { ...state, resume: { ...state.resume, experiences: action.payload } };
    case "SET_EDUCATION": return { ...state, resume: { ...state.resume, education: action.payload } };
    case "SET_SKILLS": return { ...state, resume: { ...state.resume, skills: action.payload } };
    case "SET_PROJECTS": return { ...state, resume: { ...state.resume, projects: action.payload } };
    case "SET_CERTIFICATIONS": return { ...state, resume: { ...state.resume, certifications: action.payload } };
    case "SET_AWARDS": return { ...state, resume: { ...state.resume, awards: action.payload } };
    case "SET_VOLUNTEER_EXPERIENCES": return { ...state, resume: { ...state.resume, volunteerExperiences: action.payload } };
    case "SET_LANGUAGES": return { ...state, resume: { ...state.resume, languages: action.payload } };
    case "SET_OTHER_ENTRIES": return { ...state, resume: { ...state.resume, otherEntries: action.payload } };
    case "SET_OPTIONAL_SECTIONS": return { ...state, resume: { ...state.resume, optionalSections: action.payload } };
    case "SET_SECTION_TITLE": return { ...state, resume: { ...state.resume, sectionTitles: { ...state.resume.sectionTitles, [action.payload.id]: action.payload.title } } };
    case "UNLOCK_GENERATE": return { ...state, generateUnlocked: true };
    case "RESET_RESUME": return initialResumeState;
    default: return state;
  }
}