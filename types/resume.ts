export interface ResumeLink { id: string; name: string; url: string; }

export interface ContactDetails {
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  location: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  headline: string;
  contact: ContactDetails;
  links: ResumeLink[];
}

export interface Experience {
  id: string;
  employer: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface EducationAward { id: string; name: string; }

export interface Education {
  id: string;
  educationType: "college" | "highSchool";
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  awards: EducationAward[];
}

export interface Project {
  id: string;
  name: string;
  date: string;
  technologies: string[];
  highlights: string[];
}

export interface Certification { id: string; name: string; date: string; }
export interface Language { id: string; name: string; proficiency: string; }

export interface Award {
  id: string;
  title: string;
  date: string;
  highlights: string[];
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  date: string;
  highlights: string[];
}

export interface OtherEntry {
  id: string;
  name: string;
  date: string;
  highlights: string[];
}

export type OptionalSectionKey = "projects" | "certifications" | "awards" | "volunteerExperiences" | "languages" | "other";
export type SectionId = "personal" | "summary" | "experience" | "education" | "skills" | OptionalSectionKey;

export interface ResumeData {
  personalDetails: PersonalDetails;
  professionalSummary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  volunteerExperiences: VolunteerExperience[];
  otherEntries: OtherEntry[];
  optionalSections: OptionalSectionKey[];
  sectionTitles: Record<SectionId, string>;
}

export interface ResumeState {
  resume: ResumeData;
  activeSection: string | null;
  selectedTemplateId: string | null;
  selectedFontId: string | null;
  generateUnlocked: boolean;
}