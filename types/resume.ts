export interface ResumeLink { id: string; name: string; url: string; }

export interface ContactDetails {
  email: string;
  phoneCountry: string; // ISO country code, e.g. "PH"
  phoneNumber: string;  // national number, without the dial code
  location: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  headline: string; // "Title" — optional
  contact: ContactDetails;
  links: ResumeLink[];
}

export interface Experience {
  id: string;
  employer: string;
  role: string;
  location: string;
  startDate: string; // "YYYY" or "YYYY-MM"
  endDate: string;
  current: boolean;
  highlights: string[]; // bullet points
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

export interface SkillGroup { id: string; name: string; skills: string[]; }

export interface Project {
  id: string;
  name: string;
  date: string; // single partial date
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
export interface OtherSection { name: string; entries: OtherEntry[]; }

export interface ResumeData {
  personalDetails: PersonalDetails;
  professionalSummary: string;
  experiences: Experience[];
  education: Education[];
  /** [0] = "Skills" (fixed name), [1] = renamable "Other Skills" */
  skillGroups: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  volunteerExperiences: VolunteerExperience[];
  otherSection: OtherSection;
  optionalSections: OptionalSectionKey[];
}

export interface ResumeState { resume: ResumeData; activeSection: string | null; selectedTemplateId: string | null; }

export type OptionalSectionKey = "projects" | "certifications" | "awards" | "volunteerExperiences" | "languages" | "other";