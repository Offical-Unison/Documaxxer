import type { DocumentData } from "@/types/document";
import { isLetterType } from "@/lib/documents/document-layout";
import { initialDocumentData } from "@/context/document-reducer";

function countWords(text: string | undefined): number {
  const trimmed = text?.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const sum = (values: (string | undefined)[]) => values.reduce((total, value) => total + countWords(value), 0);

/** Counts words across all document content that appears in the rendered preview/export. */
export function countDocumentWords(document: DocumentData, documentType: string = "resume"): number {
  if (isLetterType(documentType)) {
    const letter = document.letterDetails;
    if (!letter) return 0;
    return sum([
      letter.senderName, letter.senderAddress, letter.recipientName, letter.recipientTitle, letter.recipientOrganization,
      letter.recipientAddress, letter.subject, letter.salutation, letter.body, letter.closing,
      ...(documentType === "authorization-letter" ? [letter.authorizedPerson, letter.purpose] : []),
      ...(documentType === "excuse-letter" ? [letter.absentDate, letter.reason] : []),
    ]);
  }

  const optional = new Set(document.optionalSections);
  const withHighlights = <T extends { highlights: string[] }>(items: T[], fields: (item: T) => (string | undefined)[]) =>
    items.reduce((total, item) => total + sum(fields(item)) + sum(item.highlights), 0);

  let total = sum([document.personalDetails.headline, document.professionalSummary]);
  total += withHighlights(document.experiences, (item) => [item.employer, item.role]);
  total += document.education.reduce((count, item) => count + sum([item.institution, item.degree, item.fieldOfStudy]) + sum(item.awards.map((award) => award.name)), 0);
  total += sum(document.skills);

  if (optional.has("projects")) total += withHighlights(document.projects, (item) => [item.name, ...item.technologies]);
  if (optional.has("certifications")) total += document.certifications.reduce((count, item) => count + sum([item.name, item.issuingOrganization]), 0);
  if (optional.has("awards")) total += withHighlights(document.awards, (item) => [item.title]);
  if (optional.has("volunteerExperiences")) total += withHighlights(document.volunteerExperiences, (item) => [item.organization, item.role]);
  if (optional.has("languages")) total += document.languages.reduce((count, item) => count + sum([item.name, item.proficiency]), 0);
  if (optional.has("publications")) total += withHighlights(document.publications, (item) => [item.title, item.authors, item.publisher]);
  if (optional.has("presentations")) total += withHighlights(document.presentations, (item) => [item.title, item.event, item.location]);
  if (optional.has("researchExperiences")) total += withHighlights(document.researchExperiences, (item) => [item.role, item.organization, item.project]);
  if (optional.has("teachingExperiences")) total += withHighlights(document.teachingExperiences, (item) => [item.role, item.institution, item.location]);
  if (optional.has("grants")) total += withHighlights(document.grants, (item) => [item.name, item.issuer]);
  if (optional.has("memberships")) total += withHighlights(document.memberships, (item) => [item.organization, item.role]);
  if (optional.has("organizations")) total += withHighlights(document.organizations, (item) => [item.organization, item.role]);
  if (optional.has("leadership")) total += withHighlights(document.leadership, (item) => [item.role, item.organization]);
  if (optional.has("references")) total += document.references.reduce((count, item) => count + sum([item.name, item.title, item.company, item.contactInfo]), 0);
  if (optional.has("other")) total += withHighlights(document.otherEntries, (item) => [item.name]);

  return total;
}

/** True when the user has typed something beyond the defaults (e.g. the prefilled salutation and closing). */
export function hasUserContent(document: DocumentData, documentType: string): boolean {
  return countDocumentWords(document, documentType) > countDocumentWords(initialDocumentData, documentType);
}
