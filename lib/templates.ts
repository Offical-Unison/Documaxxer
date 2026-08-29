export type TemplateId = "ats-classic" | "modern-tech" | "executive" | "academic" | "research" | "professional";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  type: "resume" | "cv";
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  // Resume Templates
  { id: "ats-classic", name: "ATS Classic", description: "A traditional, highly readable, ATS-friendly resume.", type: "resume" },
  { id: "modern-tech", name: "Modern Tech", description: "Modern resume suited for Information Technology and software.", type: "resume" },
  { id: "executive", name: "Executive", description: "Polished two-column resume for experienced professionals.", type: "resume" },
  // CV Templates
  { id: "academic", name: "Academic", description: "Traditional academic document for university and faculty applications.", type: "cv" },
  { id: "research", name: "Research", description: "Research-focused document for scientists and technical professionals.", type: "cv" },
  { id: "professional", name: "Professional", description: "Comprehensive professional history for experienced professionals.", type: "cv" },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "ats-classic";

export function getTemplate(id: string | null | undefined): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0];
}