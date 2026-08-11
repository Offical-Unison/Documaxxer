import type { ResumeData } from "@/types/resume";

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Counts words across all resume content that appears in the rendered preview/export. */
export function countResumeWords(resume: ResumeData): number {
  let total = countWords(resume.personalDetails.headline) + countWords(resume.professionalSummary);

  resume.experiences.forEach((item) => {
    total += countWords(item.employer) + countWords(item.role);
    item.highlights.forEach((line) => (total += countWords(line)));
  });

  resume.education.forEach((item) => {
    total += countWords(item.institution) + countWords(item.degree) + countWords(item.fieldOfStudy);
    item.awards.forEach((award) => (total += countWords(award.name)));
  });

  total += resume.skills.reduce((sum, skill) => sum + countWords(skill), 0);

  resume.projects.forEach((item) => {
    total += countWords(item.name);
    item.highlights.forEach((line) => (total += countWords(line)));
  });
  resume.certifications.forEach((item) => (total += countWords(item.name)));
  resume.awards.forEach((item) => {
    total += countWords(item.title);
    item.highlights.forEach((line) => (total += countWords(line)));
  });
  resume.volunteerExperiences.forEach((item) => {
    total += countWords(item.organization) + countWords(item.role);
    item.highlights.forEach((line) => (total += countWords(line)));
  });
  resume.languages.forEach((item) => (total += countWords(item.name)));
  resume.otherEntries.forEach((item) => {
    total += countWords(item.name);
    item.highlights.forEach((line) => (total += countWords(line)));
  });

  return total;
}