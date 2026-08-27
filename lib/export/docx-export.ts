"use client";

import { AlignmentType, BorderStyle, convertMillimetersToTwip, Document, Packer, Paragraph, TabStopPosition, TabStopType, TextRun } from "docx";
import { COUNTRIES } from "@/lib/countries";
import { formatDateRange, formatPartialDate, sortByDateDesc, sortEntriesByRecency } from "@/lib/format";
import { getFont } from "@/lib/fonts";
import type { Education, Experience, ResumeData } from "@/types/resume";
import {
  NAME_HP, SECTION_HEADING_HP, ENTRY_TITLE_HP, BODY_HP, CONTACT_HP, DATE_HP, BODY_PT
} from "@/lib/resume-typography";
import { MARGIN_MM } from "@/lib/resume-blocks";

const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
const hasEducationContent = (item: Education) => item.institution.trim();

// All text is black — no accent colors
const BLACK = "000000";

/**
 * Convert preview CSS spacing to DOCX twips.
 * The preview uses px values rendered at 96dpi in the browser.
 * 1 inch = 96 CSS-px = 1440 twips → 1 CSS-px = 15 twips.
 */
const PX_TO_TWIP = 15;

/* ── Spacing constants matching preview CSS ───────────────────── */
// sectionHeadingStyle: marginTop: 14px, paddingBottom: 4px
const SECTION_HEADING_BEFORE = 14 * PX_TO_TWIP; // 210 twips
const SECTION_HEADING_AFTER = 4 * PX_TO_TWIP;   // 60 twips

// sectionContent wrapper: marginTop: 8px
const ENTRY_BEFORE = 8 * PX_TO_TWIP;  // 120 twips

// bodyStyle lineHeight: 1.5 → 150% of single spacing. Single spacing = 240 twips.
const BODY_LINE_SPACING = Math.round(BODY_PT * 20 * 1.5); // pt × 20 = twips-per-line, × 1.5

// Bullet/plain line: marginBottom: 2px
const BULLET_AFTER = 2 * PX_TO_TWIP;  // 30 twips

function sectionHeading(text: string, fontName: string): Paragraph {
  return new Paragraph({
    spacing: { before: SECTION_HEADING_BEFORE, after: SECTION_HEADING_AFTER },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: BLACK, size: SECTION_HEADING_HP, font: fontName })],
  });
}

function entryHeading(primary: string, secondary: string, dateRange: string, fontName: string, rightSecondary?: string): Paragraph[] {
  const runsPrimary: TextRun[] = [new TextRun({ text: primary, bold: true, size: ENTRY_TITLE_HP, color: BLACK, font: fontName })];
  if (dateRange) runsPrimary.push(new TextRun({ text: `\t${dateRange}`, size: DATE_HP, color: BLACK, font: fontName }));

  const paras = [
    new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], spacing: { before: ENTRY_BEFORE }, children: runsPrimary })
  ];

  if (secondary || rightSecondary) {
    const runsSecondary: TextRun[] = [];
    if (secondary) runsSecondary.push(new TextRun({ text: secondary, bold: true, size: BODY_HP, color: BLACK, font: fontName }));
    if (rightSecondary) runsSecondary.push(new TextRun({ text: `\t${rightSecondary}`, size: BODY_HP, color: BLACK, font: fontName }));
    paras.push(
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: runsSecondary })
    );
  }

  return paras;
}

function bulletLine(text: string, fontName: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: BULLET_AFTER, line: BODY_LINE_SPACING },
    children: [new TextRun({ text, size: BODY_HP, color: BLACK, font: fontName })],
  });
}

function plainLine(text: string, fontName: string): Paragraph {
  return new Paragraph({
    spacing: { after: BULLET_AFTER, line: BODY_LINE_SPACING },
    children: [new TextRun({ text, size: BODY_HP, color: BLACK, font: fontName })],
  });
}



/** Builds a genuinely editable .docx (real OOXML paragraphs/runs, no image or PDF conversion) and triggers a browser download. */
export async function exportResumeToDocx(resume: ResumeData, selectedFontId?: string, documentType: "resume" | "cv" = "resume"): Promise<void> {
  const personal = resume.personalDetails;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || (documentType === "cv" ? "CV" : "Resume");
  const dial = COUNTRIES.find((country) => country.code === personal.contact.phoneCountry)?.dial ?? "+63";
  const phoneLine = personal.contact.phoneNumber ? `${dial} ${personal.contact.phoneNumber}` : "";
  const contactLine = [personal.contact.location, personal.contact.email, phoneLine].filter(Boolean).join("  •  ");
  const links = personal.links.filter((link) => link.name.trim() && link.url.trim());

  // Resolve the font name from the selected font ID
  const resolvedFont = getFont(selectedFontId);
  // Use the first font in the stack (the actual font name) for DOCX
  const fontName = resolvedFont.name;

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [new TextRun({ text: fullName, bold: true, size: NAME_HP, color: BLACK, font: fontName })],
    }),
  ];
  if (personal.headline.trim()) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: BULLET_AFTER },
      children: [new TextRun({ text: personal.headline, size: BODY_HP, color: BLACK, font: fontName })],
    }));
  }
  if (contactLine) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: BULLET_AFTER },
      children: [new TextRun({ text: contactLine, size: CONTACT_HP, color: BLACK, font: fontName })],
    }));
  }
  if (links.length > 0) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: ENTRY_BEFORE },
      children: links.map((link, index) => new TextRun({ text: `${index > 0 ? "  •  " : ""}${link.name}`, size: CONTACT_HP, color: BLACK, underline: {}, font: fontName })),
    }));
  }

  // Add a bottom border paragraph to match the preview header border
  children.push(new Paragraph({
    spacing: { after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK } },
    children: [new TextRun({ text: "", size: 2 })],
  }));

  if (resume.professionalSummary.trim()) {
    children.push(sectionHeading(resume.sectionTitles.summary, fontName));
    children.push(new Paragraph({
      children: [new TextRun({ text: resume.professionalSummary, color: BLACK, size: BODY_HP, font: fontName })],
      spacing: { after: BULLET_AFTER, line: BODY_LINE_SPACING },
    }));
  }

  const experiences = sortEntriesByRecency(resume.experiences.filter(hasExperienceContent));
  if (experiences.length > 0) {
    children.push(sectionHeading(resume.sectionTitles.experience, fontName));
    experiences.forEach((item) => {
      children.push(...entryHeading(item.role || "—", [item.employer, item.location].filter(Boolean).join(", "), formatDateRange(item.startDate, item.endDate, item.current), fontName));
      item.highlights.filter((line) => line.trim()).forEach((line) => children.push(bulletLine(line, fontName)));
    });
  }

  const education = sortEntriesByRecency(resume.education.filter(hasEducationContent));
  if (education.length > 0) {
    children.push(sectionHeading(resume.sectionTitles.education, fontName));
    education.forEach((item) => {
      const gradeLabel = item.gradeLabel?.trim();
      const gradeValue = item.gradeValue?.trim();
      const rightSecondary = gradeLabel && gradeValue ? `${gradeLabel}: ${gradeValue}` : undefined;

      children.push(...entryHeading(item.institution, [item.degree, item.fieldOfStudy].filter(Boolean).join(", "), formatDateRange(item.startDate, item.endDate, item.current), fontName, rightSecondary));

      const awards = item.awards.filter((award) => award.name.trim()).map((award) => award.name).join(" • ");
      if (awards) children.push(plainLine(awards, fontName));
    });
  }

  if (resume.skills.length > 0) {
    children.push(sectionHeading(resume.sectionTitles.skills, fontName));
    resume.skills.forEach((skill) => children.push(bulletLine(skill, fontName)));
  }

  resume.optionalSections.forEach((key) => {
    if (key === "projects") {
      const projects = sortByDateDesc(resume.projects.filter((item) => item.name.trim()));
      if (projects.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.projects, fontName));
      projects.forEach((item) => {
        const techLine = item.technologies.filter(Boolean).join(", ");
        const primaryText = item.name;
        
        const runsPrimary: TextRun[] = [new TextRun({ text: primaryText, bold: true, size: ENTRY_TITLE_HP, color: BLACK, font: fontName })];
        if (techLine) runsPrimary.push(new TextRun({ text: ` | ${techLine}`, size: ENTRY_TITLE_HP, color: BLACK, font: fontName }));
        if (item.date) runsPrimary.push(new TextRun({ text: `\t${formatPartialDate(item.date)}`, size: DATE_HP, color: BLACK, font: fontName }));

        children.push(new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], spacing: { before: ENTRY_BEFORE }, children: runsPrimary }));

        // No bullets for project descriptions — plain paragraphs
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
    if (key === "certifications") {
      const items = sortByDateDesc(resume.certifications.filter((item) => item.name.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.certifications, fontName));
      items.forEach((item) => {
        children.push(...entryHeading(item.name, "", formatPartialDate(item.date), fontName));
        const org = item.issuingOrganization?.trim();
        if (org) children.push(plainLine(org, fontName));
      });
    }
    if (key === "awards") {
      const items = sortByDateDesc(resume.awards.filter((item) => item.title.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.awards, fontName));
      items.forEach((item) => {
        children.push(...entryHeading(item.title, "", formatPartialDate(item.date), fontName));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
    if (key === "volunteerExperiences") {
      const items = sortByDateDesc(resume.volunteerExperiences.filter((item) => item.organization.trim() || item.role.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.volunteerExperiences, fontName));
      items.forEach((item) => {
        children.push(...entryHeading([item.role, item.organization].filter(Boolean).join(" | "), "", formatPartialDate(item.date), fontName));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
    if (key === "languages") {
      const items = resume.languages.filter((item) => item.name.trim());
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.languages, fontName));
      children.push(new Paragraph({
        spacing: { line: BODY_LINE_SPACING },
        children: [new TextRun({ text: items.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • "), color: BLACK, size: BODY_HP, font: fontName })],
      }));
    }
    if (key === "other") {
      const items = sortByDateDesc(resume.otherEntries.filter((entry) => entry.name.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.other, fontName));
      items.forEach((item) => {
        children.push(...entryHeading(item.name, "", formatPartialDate(item.date), fontName));
        // No bullets for other/custom section descriptions — plain paragraphs
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
    if (key === "publications") {
      const items = sortByDateDesc(resume.publications.filter((entry) => entry.title.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.publications, fontName));
      items.forEach((item) => {
        children.push(...entryHeading(item.title, item.publisher, formatPartialDate(item.date), fontName));
        if (item.authors.trim()) children.push(plainLine(`Authors: ${item.authors}`, fontName));
        if (item.url.trim()) children.push(plainLine(`URL: ${item.url}`, fontName));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
    if (key === "presentations") {
      const items = sortByDateDesc(resume.presentations.filter((entry) => entry.title.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.presentations, fontName));
      items.forEach((item) => {
        children.push(...entryHeading(item.title, item.event, formatPartialDate(item.date), fontName));
        if (item.location.trim()) children.push(plainLine(`Location: ${item.location}`, fontName));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
    if (key === "researchExperiences") {
      const items = sortByDateDesc(resume.researchExperiences.filter((entry) => entry.role.trim() || entry.project.trim()));
      if (items.length === 0) return;
      children.push(sectionHeading(resume.sectionTitles.researchExperiences, fontName));
      items.forEach((item) => {
        const secondary = [item.organization, item.project].filter(Boolean).join(" | ");
        children.push(...entryHeading(item.role, secondary, formatPartialDate(item.date), fontName));
        item.highlights.filter((line) => line.trim()).forEach((line) => children.push(plainLine(line, fontName)));
      });
    }
  });

  const doc = new Document({
    creator: "Documaxxer",
    title: fullName,
    description: "Exported Resume",
    styles: {
      default: {
        document: {
          run: {
            font: fontName,
            size: BODY_HP,
            color: BLACK,
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) },
          margin: {
            top: convertMillimetersToTwip(MARGIN_MM),
            right: convertMillimetersToTwip(MARGIN_MM),
            bottom: convertMillimetersToTwip(MARGIN_MM),
            left: convertMillimetersToTwip(MARGIN_MM),
          },
        },
      },
      children,
    }],
  });
  const blob = await Packer.toBlob(doc);
  const suffix = documentType === "cv" ? "_CV" : "_Resume";
  downloadBlob(blob, `${fullName.replace(/\s+/g, "_") || documentType}${suffix}.docx`);
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