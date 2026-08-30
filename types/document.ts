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
  gradeLabel?: string;
  gradeValue?: string;
}

export interface Project {
  id: string;
  name: string;
  date: string;
  technologies: string[];
  highlights: string[];
}

export interface Certification { id: string; name: string; issuingOrganization?: string; date: string; }
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

export interface Publication {
  id: string;
  title: string;
  authors: string;
  publisher: string;
  date: string;
  url: string;
  highlights: string[];
}

export interface Presentation {
  id: string;
  title: string;
  event: string;
  location: string;
  date: string;
  highlights: string[];
}

export interface ResearchExperience {
  id: string;
  role: string;
  organization: string;
  project: string;
  date: string;
  highlights: string[];
}

export interface TeachingExperience {
  id: string;
  role: string;
  institution: string;
  location: string;
  date: string;
  highlights: string[];
}

export interface Grant {
  id: string;
  name: string;
  issuer: string;
  date: string;
  highlights: string[];
}

export interface Membership {
  id: string;
  organization: string;
  role: string;
  date: string;
  highlights: string[];
}

export interface OrganizationRole {
  id: string;
  organization: string;
  role: string;
  date: string;
  highlights: string[];
}

export interface LeadershipExperience {
  id: string;
  role: string;
  organization: string;
  date: string;
  highlights: string[];
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  contactInfo: string;
}

export type OptionalSectionKey = "projects" | "certifications" | "awards" | "volunteerExperiences" | "languages" | "publications" | "presentations" | "researchExperiences" | "teachingExperiences" | "grants" | "memberships" | "organizations" | "leadership" | "references" | "other";
export type SectionId = "personal" | "summary" | "experience" | "education" | "skills" | OptionalSectionKey;

export interface DocumentData {
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
  publications: Publication[];
  presentations: Presentation[];
  researchExperiences: ResearchExperience[];
  teachingExperiences: TeachingExperience[];
  grants: Grant[];
  memberships: Membership[];
  organizations: OrganizationRole[];
  leadership: LeadershipExperience[];
  references: Reference[];
  otherEntries: OtherEntry[];
  optionalSections: OptionalSectionKey[];
  sectionTitles: Record<SectionId, string>;
}

export interface DocumentState {
  documentType: "resume" | "cv";
  document: DocumentData;
  activeSection: string | null;
  selectedTemplateId: string | null;
  selectedFontId: string | null;
  generateUnlocked: boolean;
}