export type TemplateId = "classic" | "modern" | "sidebar" | "academic-cv" | "professional-cv" | "modern-cv";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  type: "resume" | "cv";
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  { id: "classic", name: "Classic", description: "Centered serif header, single column. Safe for any industry.", type: "resume" },
  { id: "modern", name: "Modern", description: "Left-aligned sans-serif with accent-colored section labels.", type: "resume" },
  { id: "sidebar", name: "Sidebar", description: "Two-column layout with contact, skills, and education in a side rail.", type: "resume" },
  { id: "academic-cv", name: "Academic CV", description: "Formal layout optimized for publications, research, and comprehensive academic history.", type: "cv" },
  { id: "professional-cv", name: "Professional CV", description: "Clean, structured design for extensive executive or professional experience.", type: "cv" },
  { id: "modern-cv", name: "Modern CV", description: "Contemporary style with clear section dividers for a lengthy but readable document.", type: "cv" },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "classic";

export function getTemplate(id: string | null | undefined): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0];
}