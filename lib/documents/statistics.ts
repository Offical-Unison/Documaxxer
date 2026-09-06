import type { DocumentData } from "@/types/document";

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Counts words across all document content that appears in the rendered preview/export. */
export function countResumeWords(document: DocumentData): number {
  let total = countWords(document.personalDetails.headline) + countWords(document.professionalSummary);

  document.experiences.forEach((item) => {
    total += countWords(item.employer) + countWords(item.role);
    item.highlights.forEach((line) => (total += countWords(line)));
  });

  document.education.forEach((item) => {
    total += countWords(item.institution) + countWords(item.degree) + countWords(item.fieldOfStudy);
    item.awards.forEach((award) => (total += countWords(award.name)));
  });

  total += document.skills.reduce((sum, skill) => sum + countWords(skill), 0);

  document.projects.forEach((item) => {
    total += countWords(item.name);
    item.highlights.forEach((line) => (total += countWords(line)));
  });
  document.certifications.forEach((item) => (total += countWords(item.name)));
  document.awards.forEach((item) => {
    total += countWords(item.title);
    item.highlights.forEach((line) => (total += countWords(line)));
  });
  document.volunteerExperiences.forEach((item) => {
    total += countWords(item.organization) + countWords(item.role);
    item.highlights.forEach((line) => (total += countWords(line)));
  });
  document.languages.forEach((item) => (total += countWords(item.name)));
  document.otherEntries.forEach((item) => {
    total += countWords(item.name);
    item.highlights.forEach((line) => (total += countWords(line)));
  });

  return total;
}