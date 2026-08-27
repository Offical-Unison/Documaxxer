export type DocumentStepId = 
  | "personal" 
  | "experience" 
  | "education" 
  | "skills" 
  | "research" 
  | "publications" 
  | "additional";

export interface DocumentStep {
  id: DocumentStepId;
  label: string;
}

export const RESUME_STEPS: DocumentStep[] = [
  { id: "personal", label: "Personal" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "additional", label: "Additional" },
];

export const CV_STEPS: DocumentStep[] = [
  { id: "personal", label: "Personal" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "additional", label: "Additional" },
];

export function getDocumentSteps(documentType: "resume" | "cv"): DocumentStep[] {
  return documentType === "cv" ? CV_STEPS : RESUME_STEPS;
}
