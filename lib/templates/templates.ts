import { TEMPLATE_DEFINITIONS } from "./template-definitions";
import type { TemplateDefinition } from "@/types/template";

export type TemplateId = "ats-classic" | "modern-tech" | "executive" | "academic" | "research" | "professional" | "cover-letter-classic" | "cover-letter-modern" | "cover-letter-minimal" | "authorization-letter-formal" | "authorization-letter-business" | "authorization-letter-simple" | "excuse-letter-school" | "excuse-letter-work" | "excuse-letter-medical";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  type: "resume" | "cv" | "cover-letter" | "authorization-letter" | "excuse-letter";
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
  { id: "cover-letter-classic", name: "Classic Cover Letter", description: "A traditional job application letter with a clear, formal hierarchy.", type: "cover-letter" },
  { id: "cover-letter-modern", name: "Modern Cover Letter", description: "A contemporary cover letter with a crisp, confident presentation.", type: "cover-letter" },
  { id: "cover-letter-minimal", name: "Minimal Cover Letter", description: "A restrained cover letter that keeps attention on your message.", type: "cover-letter" },
  { id: "authorization-letter-formal", name: "Formal Authorization", description: "A formal authorization letter for offices, agencies, and legal transactions.", type: "authorization-letter" },
  { id: "authorization-letter-business", name: "Business Authorization", description: "A structured authorization letter for company and professional use.", type: "authorization-letter" },
  { id: "authorization-letter-simple", name: "Simple Authorization", description: "A straightforward authorization letter for everyday requests.", type: "authorization-letter" },
  { id: "excuse-letter-school", name: "School Excuse Letter", description: "An excuse letter structured for a student absence or school request.", type: "excuse-letter" },
  { id: "excuse-letter-work", name: "Work Excuse Letter", description: "A professional absence letter for an employer or workplace.", type: "excuse-letter" },
  { id: "excuse-letter-medical", name: "Medical Excuse Letter", description: "A clear absence letter organized around recovery and medical leave.", type: "excuse-letter" },
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