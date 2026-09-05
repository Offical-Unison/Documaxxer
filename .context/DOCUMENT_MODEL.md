# Documaxxer — Document Data Model & Reducer Actions

This document is the authoritative specification for all data types, document interfaces, state shapes, and state actions in Documaxxer. All definitions reflect [`types/document.ts`](file:///e:/Github/Documaxxer/types/document.ts) and [`context/document-reducer.ts`](file:///e:/Github/Documaxxer/context/document-reducer.ts).

---

## 1. Core State Shapes

### `DocumentState`
The root state container held in React Context:
```typescript
export interface DocumentState {
  documentType: "resume" | "cv";
  document: DocumentData;
  activeSection: string | null;      // Stored as step index string ("0" to "4")
  selectedTemplateId: string | null;  // e.g. "ats-classic", "modern-tech", "executive"
  selectedFontId: string | null;      // e.g. "calibri", "arial", "times", etc.
  generateUnlocked: boolean;         // True after completing Step 5
}
```

### `DocumentData`
Contains all user-entered content for a single document:
```typescript
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
```

---

## 2. Core Section Data Interfaces

### Personal Details & Contact
```typescript
export interface ContactDetails {
  email: string;
  phoneCountry: string; // e.g. "PH"
  phoneNumber: string;  // e.g. "0917 123 4567"
  location: string;     // e.g. "Cebu City, Philippines"
}

export interface ResumeLink {
  id: string;
  name: string; // e.g. "LinkedIn", "GitHub", "Portfolio"
  url: string;  // e.g. "https://linkedin.com/in/johndoe"
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  headline: string;
  contact: ContactDetails;
  links: ResumeLink[];
}
```

### Experience & Education
```typescript
export interface Experience {
  id: string;
  employer: string;
  role: string;
  location: string;
  startDate: string;      // YYYY-MM or YYYY
  endDate: string;        // YYYY-MM or YYYY
  current: boolean;       // If true, endDate is ignored and displayed as "Present"
  highlights: string[];   // Array of bullet items
}

export interface EducationAward {
  id: string;
  name: string;           // e.g. "Dean's Lister", "Cum Laude"
}

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
  gradeLabel?: string;    // e.g. "GPA", "GWA"
  gradeValue?: string;    // e.g. "3.85", "1.25"
}
```

---

## 3. Dynamic Optional Sections (15 Types)

Documaxxer supports 15 dynamic section types declared in `OptionalSectionKey`:

```typescript
export type OptionalSectionKey =
  | "projects"
  | "certifications"
  | "awards"
  | "volunteerExperiences"
  | "languages"
  | "publications"
  | "presentations"
  | "researchExperiences"
  | "teachingExperiences"
  | "grants"
  | "memberships"
  | "organizations"
  | "leadership"
  | "references"
  | "other";

export type SectionId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | OptionalSectionKey;
```

### Dynamic Section Data Models
```typescript
export interface Project {
  id: string;
  name: string;
  date: string;
  technologies: string[];
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization?: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g. "Native", "Fluent", "Conversational"
}

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

export interface OtherEntry {
  id: string;
  name: string;
  date: string;
  highlights: string[];
}
```

---

## 4. Reducer Actions (`DocumentAction`)

[`documentReducer`](file:///e:/Github/Documaxxer/context/document-reducer.ts) manages 29 discrete action types:

| Action Type | Payload Type | Description |
| :--- | :--- | :--- |
| `SET_DOCUMENT` | `DocumentData` | Overwrites entire document data (used during hydration). |
| `SET_ACTIVE_SECTION` | `string \| null` | Updates active wizard step (e.g. `"0"`, `"1"`, etc.). |
| `SET_TEMPLATE` | `string \| null` | Selects the active template ID. |
| `SET_FONT` | `string \| null` | Selects the active typography font ID. |
| `UPDATE_PERSONAL_DETAILS` | `PersonalDetails` | Updates personal contact information and web links. |
| `SET_PROFESSIONAL_SUMMARY` | `string` | Sets the professional summary or objective text. |
| `SET_EXPERIENCES` | `Experience[]` | Replaces work experience entries. |
| `SET_EDUCATION` | `Education[]` | Replaces education records. |
| `SET_SKILLS` | `string[]` | Replaces the list of skill tags. |
| `SET_PROJECTS` | `Project[]` | Replaces project entries. |
| `SET_CERTIFICATIONS` | `Certification[]` | Replaces certification entries. |
| `SET_AWARDS` | `Award[]` | Replaces awards & honors. |
| `SET_VOLUNTEER_EXPERIENCES`| `VolunteerExperience[]`| Replaces volunteer records. |
| `SET_LANGUAGES` | `Language[]` | Replaces spoken/programming languages. |
| `SET_PUBLICATIONS` | `Publication[]` | Replaces publication records. |
| `SET_PRESENTATIONS` | `Presentation[]` | Replaces presentation/conference talks. |
| `SET_RESEARCH_EXPERIENCES` | `ResearchExperience[]` | Replaces research experience records. |
| `SET_TEACHING_EXPERIENCES` | `TeachingExperience[]` | Replaces academic teaching appointments. |
| `SET_GRANTS` | `Grant[]` | Replaces grants, scholarships, or fellowships. |
| `SET_MEMBERSHIPS` | `Membership[]` | Replaces professional society memberships. |
| `SET_ORGANIZATIONS` | `OrganizationRole[]` | Replaces student or professional organizations. |
| `SET_LEADERSHIP` | `LeadershipExperience[]` | Replaces dedicated leadership roles. |
| `SET_REFERENCES` | `Reference[]` | Replaces academic/professional references. |
| `SET_OTHER_ENTRIES` | `OtherEntry[]` | Replaces custom other section entries. |
| `SET_OPTIONAL_SECTIONS` | `OptionalSectionKey[]` | Replaces list and order of active optional sections. |
| `SET_SECTION_TITLE` | `{ id: SectionId; title: string }` | Overrides custom heading label for a section. |
| `SET_DOCUMENT_TYPE` | `"resume" \| "cv"` | Toggles document mode between Resume and CV. |
| `UNLOCK_GENERATE` | *none* | Sets `generateUnlocked: true` to reveal export button. |
| `RESET_DOCUMENT` | *none* | Restores state to `initialDocumentState`. |

---

## 5. Section Titles & Initial State

### Default Titles
Defined in [`DEFAULT_SECTION_TITLES`](file:///e:/Github/Documaxxer/context/document-reducer.ts#L5-L26):
```typescript
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
```

### Initial State Defaults
- **Country**: `"PH"`
- **Template**: `"ats-classic"`
- **Font**: `"calibri"`
- **Document Type**: `"resume"`
- **Generate Unlocked**: `false`
