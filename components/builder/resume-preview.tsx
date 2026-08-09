"use client";

import { useResumeContext } from "@/context/resume-context";
import { formatDateRange } from "@/lib/format";
import type { Education, Experience, Project, VolunteerExperience } from "@/types/resume";

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h3>
      <div className="mt-2.5 space-y-3">{children}</div>
    </section>
  );
}

function EntryHeading({ primary, secondary, dateRange }: { primary: string; secondary?: string; dateRange?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
      <div>
        <p className="text-sm font-semibold text-slate-900">{primary}</p>
        {secondary && <p className="text-sm text-slate-600">{secondary}</p>}
      </div>
      {dateRange && <p className="shrink-0 text-xs font-medium text-slate-500">{dateRange}</p>}
    </div>
  );
}

const hasExperienceContent = (item: Experience) => item.employer.trim() || item.role.trim();
const hasEducationContent = (item: Education) => item.institution.trim();
const hasProjectContent = (item: Project) => item.name.trim();
const hasVolunteerContent = (item: VolunteerExperience) => item.organization.trim() || item.role.trim();

export function ResumePreview() {
  const { state } = useResumeContext();
  const { resume } = state;
  const { personalDetails: personal, professionalSummary } = resume;

  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const contactLine = [personal.contact.location, personal.contact.email, personal.contact.phone].filter(Boolean).join("  •  ");
  const linkLine = [personal.contact.linkedin, personal.contact.github, personal.contact.website].filter(Boolean).join("  •  ");

  const experiences = resume.experiences.filter(hasExperienceContent);
  const education = resume.education.filter(hasEducationContent);
  const skills = resume.skillGroups.find((group) => group.id === "primary")?.skills ?? [];
  const projects = resume.optionalSections.includes("projects") ? resume.projects.filter(hasProjectContent) : [];
  const certifications = resume.optionalSections.includes("certifications") ? resume.certifications.filter((item) => item.name.trim()) : [];
  const awards = resume.optionalSections.includes("awards") ? resume.awards.filter((item) => item.title.trim()) : [];
  const volunteering = resume.optionalSections.includes("volunteerExperiences") ? resume.volunteerExperiences.filter(hasVolunteerContent) : [];
  const languages = resume.optionalSections.includes("languages") ? resume.languages.filter((item) => item.name.trim()) : [];
  const interests = resume.optionalSections.includes("interests") ? resume.interests.filter(Boolean) : [];

  const isEmpty = !fullName && !personal.headline.trim() && !contactLine && !professionalSummary.trim() && experiences.length === 0 && education.length === 0 && skills.length === 0;

  if (isEmpty) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">Your resume preview will appear here</p>
        <p className="mt-1 text-xs text-slate-400">Start filling out the form to see it come together.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm sm:p-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {(fullName || personal.headline.trim() || contactLine || linkLine) && (
        <header className="border-b border-slate-300 pb-3 text-center">
          {fullName && <h2 className="text-2xl font-bold tracking-tight text-slate-950">{fullName}</h2>}
          {personal.headline.trim() && <p className="mt-1 text-sm font-medium text-slate-600">{personal.headline}</p>}
          {contactLine && <p className="mt-2 text-xs text-slate-500">{contactLine}</p>}
          {linkLine && <p className="mt-0.5 text-xs text-slate-500">{linkLine}</p>}
        </header>
      )}

      {professionalSummary.trim() && (
        <PreviewSection title="Summary">
          <p className="text-sm leading-6 text-slate-700">{professionalSummary}</p>
        </PreviewSection>
      )}

      {experiences.length > 0 && (
        <PreviewSection title="Experience">
          {experiences.map((item) => (
            <div key={item.id}>
              <EntryHeading primary={item.role || "—"} secondary={[item.employer, item.location].filter(Boolean).join(", ")} dateRange={formatDateRange(item.startDate, item.endDate, item.current)} />
              {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {education.length > 0 && (
        <PreviewSection title="Education">
          {education.map((item) => (
            <div key={item.id}>
              <EntryHeading
                primary={item.institution}
                secondary={[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
                dateRange={formatDateRange(item.startDate, item.endDate, item.current)}
              />
              {item.awards.some((award) => award.name.trim()) && (
                <p className="mt-1 text-xs text-slate-600">{item.awards.filter((award) => award.name.trim()).map((award) => award.name).join(", ")}</p>
              )}
            </div>
          ))}
        </PreviewSection>
      )}

      {skills.length > 0 && (
        <PreviewSection title="Skills">
          <p className="text-sm leading-6 text-slate-700">{skills.join(" • ")}</p>
        </PreviewSection>
      )}

      {projects.length > 0 && (
        <PreviewSection title="Projects">
          {projects.map((item) => (
            <div key={item.id}>
              <EntryHeading primary={item.name} secondary={item.role} dateRange={formatDateRange(item.startDate, item.endDate, false)} />
              {item.technologies.length > 0 && <p className="mt-0.5 text-xs text-slate-500">{item.technologies.join(", ")}</p>}
              {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {certifications.length > 0 && (
        <PreviewSection title="Certifications">
          {certifications.map((item) => (
            <EntryHeading key={item.id} primary={item.name} secondary={item.issuer} dateRange={formatDateRange(item.issueDate, item.expiryDate, false)} />
          ))}
        </PreviewSection>
      )}

      {awards.length > 0 && (
        <PreviewSection title="Awards">
          {awards.map((item) => (
            <div key={item.id}>
              <EntryHeading primary={item.title} secondary={item.issuer} dateRange={formatDateRange(item.date, "", false)} />
              {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {volunteering.length > 0 && (
        <PreviewSection title="Volunteer Experience">
          {volunteering.map((item) => (
            <div key={item.id}>
              <EntryHeading primary={item.role || item.organization} secondary={item.role ? item.organization : undefined} dateRange={formatDateRange(item.startDate, item.endDate, false)} />
              {item.description.trim() && <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {languages.length > 0 && (
        <PreviewSection title="Languages">
          <p className="text-sm leading-6 text-slate-700">{languages.map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name)).join(" • ")}</p>
        </PreviewSection>
      )}

      {interests.length > 0 && (
        <PreviewSection title="Interests">
          <p className="text-sm leading-6 text-slate-700">{interests.join(" • ")}</p>
        </PreviewSection>
      )}
    </div>
  );
}