export type DocumentStepId = 
  | "personal" 
  | "experience" 
  | "education" 
  | "skills" 
  | "additional";

export interface DocumentStep {
  id: DocumentStepId;
  label: string;
}

export const CORE_STEPS: DocumentStep[] = [
  { id: "personal", label: "Personal" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "additional", label: "Additional" },
];

/** Resume and CV share the same guided steps; letters use their own single-page form. */
export function getDocumentSteps(): DocumentStep[] {
  return CORE_STEPS;
}
