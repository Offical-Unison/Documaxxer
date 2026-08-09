import type { Award, Certification, Education, Experience, Language, OptionalSectionKey, OtherEntry, PersonalDetails, Project, ResumeData, ResumeState, VolunteerExperience } from "@/types/resume";

export const initialResumeData: ResumeData = {
  personalDetails: {
    firstName: "", lastName: "", headline: "",
    contact: { email: "", phoneCountry: "PH", phoneNumber: "", location: "" },
    links: [],
  },
  professionalSummary: "",
  experiences: [],
  education: [],
  skillGroups: [
    { id: "primary", name: "Skills", skills: [] },
    { id: "secondary", name: "Other Skills", skills: [] },
  ],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteerExperiences: [],
  otherSection: { name: "Other", entries: [] },
  optionalSections: [],
};

export const initialResumeState: ResumeState = { resume: initialResumeData, activeSection: null, selectedTemplateId: null };

export type ResumeAction =
  | { type: "SET_RESUME"; payload: ResumeData }
  | { type: "SET_ACTIVE_SECTION"; payload: string | null }
  | { type: "SET_TEMPLATE"; payload: string | null }
  | { type: "UPDATE_PERSONAL_DETAILS"; payload: PersonalDetails }
  | { type: "SET_PROFESSIONAL_SUMMARY"; payload: string }
  | { type: "SET_EXPERIENCES"; payload: Experience[] }
  | { type: "SET_EDUCATION"; payload: Education[] }
  | { type: "SET_SKILL_GROUP"; payload: { index: number; name?: string; skills?: string[] } }
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_CERTIFICATIONS"; payload: Certification[] }
  | { type: "SET_AWARDS"; payload: Award[] }
  | { type: "SET_VOLUNTEER_EXPERIENCES"; payload: VolunteerExperience[] }
  | { type: "SET_LANGUAGES"; payload: Language[] }
  | { type: "SET_OTHER_SECTION_NAME"; payload: string }
  | { type: "SET_OTHER_ENTRIES"; payload: OtherEntry[] }
  | { type: "SET_OPTIONAL_SECTIONS"; payload: OptionalSectionKey[] }
  | { type: "RESET_RESUME" };

export function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case "SET_RESUME": return { ...state, resume: action.payload };
    case "SET_ACTIVE_SECTION": return { ...state, activeSection: action.payload };
    case "SET_TEMPLATE": return { ...state, selectedTemplateId: action.payload };
    case "UPDATE_PERSONAL_DETAILS": return { ...state, resume: { ...state.resume, personalDetails: action.payload } };
    case "SET_PROFESSIONAL_SUMMARY": return { ...state, resume: { ...state.resume, professionalSummary: action.payload } };
    case "SET_EXPERIENCES": return { ...state, resume: { ...state.resume, experiences: action.payload } };
    case "SET_EDUCATION": return { ...state, resume: { ...state.resume, education: action.payload } };
    case "SET_SKILL_GROUP": {
      const { index, name, skills } = action.payload;
      const groups = state.resume.skillGroups.map((group, groupIndex) =>
        groupIndex === index
          ? { ...group, ...(name !== undefined ? { name } : {}), ...(skills !== undefined ? { skills } : {}) }
          : group
      );
      return { ...state, resume: { ...state.resume, skillGroups: groups } };
    }
    case "SET_PROJECTS": return { ...state, resume: { ...state.resume, projects: action.payload } };
    case "SET_CERTIFICATIONS": return { ...state, resume: { ...state.resume, certifications: action.payload } };
    case "SET_AWARDS": return { ...state, resume: { ...state.resume, awards: action.payload } };
    case "SET_VOLUNTEER_EXPERIENCES": return { ...state, resume: { ...state.resume, volunteerExperiences: action.payload } };
    case "SET_LANGUAGES": return { ...state, resume: { ...state.resume, languages: action.payload } };
    case "SET_OTHER_SECTION_NAME": return { ...state, resume: { ...state.resume, otherSection: { ...state.resume.otherSection, name: action.payload } } };
    case "SET_OTHER_ENTRIES": return { ...state, resume: { ...state.resume, otherSection: { ...state.resume.otherSection, entries: action.payload } } };
    case "SET_OPTIONAL_SECTIONS": return { ...state, resume: { ...state.resume, optionalSections: action.payload } };
    case "RESET_RESUME": return initialResumeState;
    default: return state;
  }
}