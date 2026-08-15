"use client";

import { AlignmentType, BorderStyle, Document, Packer, Paragraph, TabStopPosition, TabStopType, TextRun } from "docx";
import { COUNTRIES } from "@/lib/countries";
import { formatDateRange, formatPartialDate, sortByDateDesc, sortEntriesByRecency } from "@/lib/format";
import type { Education, Experience, ResumeData } from "@/types/resume";

const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
const hasEducationContent = (item: Education) => item.institution.trim();

const ACCENT = "2563EB"; // border-only accent, see sectionHeading()
const MUTED = "000000";
const BODY = "000000";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: BODY, size: 20 })],
  });
}

function entryHeading(primary: string, secondary: string, dateRange: string): Paragraph {
  const runs: TextRun[] = [new TextRun({ text: primary, bold: true, size: 22, color: BODY })];
  if (dateRange) runs.push(new TextRun({ text: `\t${dateRange}`, size: 18, color: MUTED }));
  if (secondary) runs.push(new TextRun({ text: secondary, break: 1, size: 20, color: BODY }));
  return new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], spacing: { before: 120 }, children: runs });
}

function bullet(text: string): Paragraph {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 40 } });
}

function metaLine(text: string): Paragraph {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text, italics: true, size: 18, color: MUTED })] });
}

/** Builds a genuinely editable .docx (real OOXML paragraphs/runs, no image or PDF conversion) and triggers a browser download. */
export async function exportResumeToDocx(resume: ResumeData): Promise<void> {
  const personal = resume.personalDetails;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || "Resume";
  const dial = COUNTRIES.find((country) => country.code === personal.contact.phoneCountry)?.dial ?? "+63";
  const phoneLine = personal.contact.phoneNumber ? `${dial} ${personal.contact.phoneNumber}` : "";
  const contactLine = [personal.contact.location, personal.contact.email, phoneLine].filter(Boolean).join("  •  ");
  const links = personal.links.filter((link) => link.name.trim() && link.url.trim());

  const children: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: fullName, bold: true, size: 32, color: BODY })] }),
  ];
  if (personal.headline.trim()) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: personal.headline, size: 22, color: BODY })] }));
  }
  if (contactLine) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: contactLine, size: 18, color: BODY })] }));
  }
  if (links.length > 0) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: links.map((link, index) => new TextRun({ text: `${index > 0 ? "  •  " : ""}${link.name}`, size: 18, color: BODY, underline: {} })),
    }));
  }

  if (resume.professionalSummary.trim()) {
    children.push(sectionHeading(resume.sectionTitles.summary));
    children.push(new Paragraph({ children: [new TextRun({ text: resume.professionalSummary, color: BODY })], spacing: { after: 80 } }));
  }

  const experiences = sortEntriesByRecency(resume.experiences.filter(hasExperienceContent));
  if (experiences.length > 0) {
    children.push(sectionHeading(resume.sectionTitles.experience));
    experiences.forEach((item) => {
      children.push(entryHeading(item.role || "—", [item.employer, item.location].filter(Boolean).join(", "), formatDateRange(item.startDate, item.endDate, item.current)));
      item.highlights.filter((line) => line.trim()).forEach((line) => children.push(bullet(line)));
    });
  }

  const education = sortEntriesByRecency(resume.education.filter(hasEducationContent));
  if (education.length > 0) {
    children.push(sectionHeading(resume.sectionTitles.education));
    education.forEach((item) => {
      children.push(entryHeading(item.institution, [item.degree, item.fieldOfStudy].filter(Boolean).join(", "), formatDateRange(item.startDate, item.endDate, item.current)));
      const awards = item.awards.filter((award) => award.name.trim()).map((award) => award.name).join(" • ");
      if (awards) children.push(metaLine(awards));
    });
  }

  if (resume.skills.length > 0) {
    children.push(sectionHeading(resume.sectionTitles.skills));
    resume.skills.forEach((skill) => children.push(bullet(skill)));
  }

  resume.optionalSections.forEach((key) => {
    if (key === "projects") {
      const projects = sortByDateDesc(resume.projects.filter((item) => item.name.trim()));
      if (projects.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.projects));
      projects.forEach((item) => {
        children.push(entryHeading([item.name, item.technologies.join(", ")].filter(Boolean).join(" | "), "", formatPartialDate(item.date)));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(bullet(line)));
      });
    }
    if (key === "certifications") {
      const items = sortByDateDesc(resume.certifications.filter((item) => item.name.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.certifications));
      items.forEach((item) => children.push(entryHeading(item.name, "", formatPartialDate(item.date))));
    }
    if (key === "awards") {
      const items = sortByDateDesc(resume.awards.filter((item) => item.title.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.awards));
      items.forEach((item) => {
        children.push(entryHeading(item.title, "", formatPartialDate(item.date)));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(bullet(line)));
      });
    }
    if (key === "volunteerExperiences") {
      const items = sortByDateDesc(resume.volunteerExperiences.filter((item) => item.organization.trim() || item.role.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.volunteerExperiences));
      items.forEach((item) => {
        children.push(entryHeading([item.role, item.organization].filter(Boolean).join(" | "), "", formatPartialDate(item.date)));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(bullet(line)));
      });
    }
    if (key === "languages") {
      const items = resume.languages.filter((item) => item.name.trim());
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.languages));
      children.push(new Paragraph({ children: [new TextRun({ text: items.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • "), color: BODY })] }));
    }
    if (key === "other") {
      const items = sortByDateDesc(resume.otherEntries.filter((entry) => entry.name.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.other));
      items.forEach((item) => {
        children.push(entryHeading(item.name, "", formatPartialDate(item.date)));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(bullet(line)));
      });
    }
  });

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${fullName.replace(/\s+/g, "_") || "resume"}.docx`);
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}