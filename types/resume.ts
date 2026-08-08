export interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface PersonalDetails { firstName: string; lastName: string; headline: string; contact: ContactDetails; }
export interface Experience { id: string; employer: string; role: string; location: string; startDate: string; endDate: string; current: boolean; description: string; highlights: string[]; }
export interface Education { id: string; educationType: "college" | "highSchool"; institution: string; degree: string; fieldOfStudy: string; location: string; startDate: string; endDate: string; current: boolean; description: string; }
export interface SkillGroup { id: string; name: string; skills: string[]; }
export interface Project { id: string; name: string; role: string; url: string; githubUrl: string; technologies: string[]; startDate: string; endDate: string; description: string; highlights: string[]; }
export interface Certification { id: string; name: string; issuer: string; issueDate: string; expiryDate: string; credentialUrl: string; }
export interface Language { id: string; name: string; proficiency: string; }
export interface Award { id: string; title: string; issuer: string; date: string; description: string; }
export interface Publication { id: string; title: string; publisher: string; date: string; url: string; description: string; }
export interface VolunteerExperience { id: string; organization: string; role: string; location: string; startDate: string; endDate: string; description: string; highlights: string[]; }
export interface Reference { id: string; name: string; company: string; role: string; email: string; phone: string; relationship: string; }
export interface CustomSection { id: string; title: string; content: string; }

export interface ResumeData {
  personalDetails: PersonalDetails;
  professionalSummary: string;
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  interests: string[];
  awards: Award[];
  publications: Publication[];
  volunteerExperiences: VolunteerExperience[];
  references: Reference[];
  customSections: CustomSection[];
  optionalSections: OptionalSectionKey[];
}

export interface ResumeState { resume: ResumeData; activeSection: string | null; selectedTemplateId: string | null; }

export type OptionalSectionKey = "projects" | "certifications" | "awards" | "volunteerExperiences" | "languages" | "interests";
