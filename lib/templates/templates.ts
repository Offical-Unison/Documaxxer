import { TEMPLATE_DEFINITIONS } from "./template-definitions";
import type { TemplateDefinition } from "@/types/template";

export type TemplateId = "ats-classic" | "modern-tech" | "executive" | "academic" | "research" | "professional";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  type: "resume" | "cv";
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  // Resume Templates
  { id: "ats-classic", name: "ATS Classic", description: "A traditional, highly readable, ATS-friendly document.", type: "resume" },
  { id: "modern-tech", name: "Modern Tech", description: "Modern document suited for Information Technology and software.", type: "resume" },
  { id: "executive", name: "Executive", description: "Polished two-column document for experienced professionals.", type: "resume" },
  // CV Templates
  { id: "academic", name: "Academic", description: "Traditional academic document for university and faculty applications.", type: "cv" },
  { id: "research", name: "Research", description: "Research-focused document for scientists and technical professionals.", type: "cv" },
  { id: "professional", name: "Professional", description: "Comprehensive professional history for experienced professionals.", type: "cv" },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "ats-classic";

export function getTemplate(id: string | null | undefined): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0];
}

/** Get the full schema definition for a template. Falls back to ats-classic. */
export function getTemplateDefinition(id: string | null | undefined): TemplateDefinition {
  return TEMPLATE_DEFINITIONS[id as TemplateId] ?? TEMPLATE_DEFINITIONS["ats-classic"];
}

export { TEMPLATE_DEFINITIONS };
export type { TemplateDefinition };