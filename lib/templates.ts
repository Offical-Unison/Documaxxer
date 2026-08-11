export type TemplateId = "classic" | "modern" | "sidebar";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  { id: "classic", name: "Classic", description: "Centered serif header, single column. Safe for any industry." },
  { id: "modern", name: "Modern", description: "Left-aligned sans-serif with accent-colored section labels." },
  { id: "sidebar", name: "Sidebar", description: "Two-column layout with contact, skills, and education in a side rail." },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "classic";

export function getTemplate(id: string | null | undefined): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0];
}