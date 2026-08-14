export interface ResumeFont {
  id: string;
  name: string;
  stack: string;
}

export const RESUME_FONTS: ResumeFont[] = [
  { id: "arial", name: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "calibri", name: "Calibri", stack: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif" },
  { id: "times", name: "Times New Roman", stack: "'Times New Roman', Times, serif" },
  { id: "georgia", name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { id: "helvetica", name: "Helvetica", stack: "Helvetica, Arial, sans-serif" },
  { id: "verdana", name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
];

export const DEFAULT_FONT_ID = "calibri";

export function getFont(id: string | null | undefined): ResumeFont {
  return RESUME_FONTS.find((font) => font.id === id) ?? RESUME_FONTS.find((font) => font.id === DEFAULT_FONT_ID)!;
}