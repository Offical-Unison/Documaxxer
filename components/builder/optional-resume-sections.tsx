"use client";

import { useState } from "react";
import { AddButton, EntryCard, Field, TagInput } from "@/components/builder/form-controls";
import { BulletListInput } from "@/components/builder/bullet-list";
import { PartialDateField } from "@/components/builder/date-input";
import { EditableTitle } from "@/components/builder/editable-title";
import { useResumeContext } from "@/context/resume-context";
import type { Award, Certification, Language, OptionalSectionKey, OtherEntry, Project, Publication, Presentation, ResearchExperience, VolunteerExperience, TeachingExperience, Grant, Membership, OrganizationRole, LeadershipExperience, Reference } from "@/types/resume";

const makeId = () => crypto.randomUUID();

const RESUME_SECTION_OPTIONS: { key: OptionalSectionKey; label: string; description: string; recommended?: boolean }[] = [
  { key: "projects", label: "Projects", description: "Showcase personal, academic, or professional projects." },
  { key: "certifications", label: "Certifications", description: "Add certifications, licenses, or completed courses." },
  { key: "awards", label: "Awards & Honors", description: "Highlight academic or professional achievements." },
  { key: "organizations", label: "Organizations", description: "Relevant clubs, groups, or affiliations." },
  { key: "leadership", label: "Leadership", description: "Leadership roles and experiences." },
  { key: "volunteerExperiences", label: "Volunteer Experience", description: "Include relevant volunteer work and organizations." },
  { key: "languages", label: "Languages", description: "List languages and your proficiency level." },
  { key: "other", label: "Custom Section", description: "Add any other custom section." },
];

const CV_SECTION_OPTIONS: { key: OptionalSectionKey; label: string; description: string; recommended?: boolean }[] = [
  { key: "researchExperiences", label: "Research Experience", description: "Detail your academic or professional research roles." },
  { key: "publications", label: "Publications", description: "List your published papers, articles, or books." },
  { key: "teachingExperiences", label: "Teaching Experience", description: "Highlight your experience as an educator or TA." },
  { key: "presentations", label: "Presentations & Conferences", description: "Highlight conferences, talks, or posters." },
  { key: "awards", label: "Awards & Honors", description: "Highlight academic or professional achievements." },
  { key: "grants", label: "Grants & Fellowships", description: "List grants, scholarships, or fellowships received." },
  { key: "certifications", label: "Certifications", description: "Add certifications, licenses, or completed courses." },
  { key: "memberships", label: "Professional Memberships", description: "Relevant academic or professional associations." },
  { key: "projects", label: "Projects", description: "Showcase academic or professional projects." },
  { key: "references", label: "References", description: "List academic or professional references." },
  { key: "other", label: "Custom Section", description: "Add any other custom section." },
];

export function OptionalResumeSections() {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const addSection = (key: OptionalSectionKey) => dispatch({ type: "SET_OPTIONAL_SECTIONS", payload: [...resume.optionalSections, key] });
  const removeSection = (key: OptionalSectionKey) => dispatch({ type: "SET_OPTIONAL_SECTIONS", payload: resume.optionalSections.filter((section) => section !== key) });

  const reorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const next = [...resume.optionalSections];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    dispatch({ type: "SET_OPTIONAL_SECTIONS", payload: next });
  };

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2">
        {(state.documentType === "cv" ? CV_SECTION_OPTIONS : RESUME_SECTION_OPTIONS).map((section) => {
          const added = resume.optionalSections.includes(section.key);
          return (
            <article
              key={section.key}
              className={`flex min-h-44 flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${
                section.recommended
                  ? "border-blue-200 bg-blue-50/70 shadow-[0_4px_20px_rgba(37,99,235,0.06)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.12)] dark:border-blue-400/40 dark:bg-blue-500/15 dark:shadow-[0_4px_20px_rgba(37,99,235,0.1)]"
                  : "border-slate-200/90 bg-white/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:shadow-md dark:border-slate-800/80 dark:bg-[#161D2B]/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{section.label}</h3>
                {section.recommended && (
                  <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    Recommended for students
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{section.description}</p>
              <div className="mt-auto pt-5">
                {added ? (
                  <span className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-green-50 px-3.5 text-sm font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="M3.5 8.5l3 3 6-6" />
                    </svg>
                    Added
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => addSection(section.key)}
                    className="min-h-10 rounded-xl border border-blue-200/80 bg-white/80 px-4 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400/30 dark:bg-slate-900/60 dark:text-blue-300 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/10"
                  >
                    + Add
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {resume.optionalSections.length > 0 && (
        <div className="mt-8 border-t border-slate-200/80 pt-7 dark:border-slate-700/80">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Added sections</h3>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Drag a section to reorder how it appears on your resume.</p>
          <div className="mt-4 space-y-5">
            {resume.optionalSections.map((section, index) => (
              <div
                key={section}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => { if (dragIndex !== null) reorder(dragIndex, index); setDragIndex(null); }}
                onDragEnd={() => setDragIndex(null)}
                className={`rounded-2xl transition ${dragIndex === index ? "opacity-60" : ""}`}
              >
                <OptionalSection section={section} onRemove={() => removeSection(section)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function OptionalSection({ section, onRemove }: { section: OptionalSectionKey; onRemove: () => void }) {
  const { state, dispatch } = useResumeContext();
  const resume = state.resume;
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/70 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex cursor-grab items-center gap-2">
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">⠿</span>
          <EditableTitle
            as="h4"
            className="font-semibold text-slate-900 dark:text-slate-100"
            title={resume.sectionTitles[section]}
            onSave={(title) => dispatch({ type: "SET_SECTION_TITLE", payload: { id: section, title } })}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="min-h-10 rounded-xl px-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
        >
          Remove section
        </button>
      </div>
      <div className="mt-4">
        {section === "projects" && <Projects items={resume.projects} onChange={(payload) => dispatch({ type: "SET_PROJECTS", payload })} />}
        {section === "certifications" && <Certifications items={resume.certifications} onChange={(payload) => dispatch({ type: "SET_CERTIFICATIONS", payload })} />}
        {section === "awards" && <Awards items={resume.awards} onChange={(payload) => dispatch({ type: "SET_AWARDS", payload })} />}
        {section === "volunteerExperiences" && <Volunteering items={resume.volunteerExperiences} onChange={(payload) => dispatch({ type: "SET_VOLUNTEER_EXPERIENCES", payload })} />}
        {section === "organizations" && <Organizations items={resume.organizations} onChange={(payload) => dispatch({ type: "SET_ORGANIZATIONS", payload })} />}
        {section === "leadership" && <Leadership items={resume.leadership} onChange={(payload) => dispatch({ type: "SET_LEADERSHIP", payload })} />}
        {section === "languages" && <Languages items={resume.languages} onChange={(payload) => dispatch({ type: "SET_LANGUAGES", payload })} />}
        {section === "publications" && <Publications items={resume.publications} onChange={(payload) => dispatch({ type: "SET_PUBLICATIONS", payload })} />}
        {section === "presentations" && <Presentations items={resume.presentations} onChange={(payload) => dispatch({ type: "SET_PRESENTATIONS", payload })} />}
        {section === "researchExperiences" && <ResearchExperiences items={resume.researchExperiences} onChange={(payload) => dispatch({ type: "SET_RESEARCH_EXPERIENCES", payload })} />}
        {section === "teachingExperiences" && <TeachingExperiences items={resume.teachingExperiences} onChange={(payload) => dispatch({ type: "SET_TEACHING_EXPERIENCES", payload })} />}
        {section === "grants" && <Grants items={resume.grants} onChange={(payload) => dispatch({ type: "SET_GRANTS", payload })} />}
        {section === "memberships" && <Memberships items={resume.memberships} onChange={(payload) => dispatch({ type: "SET_MEMBERSHIPS", payload })} />}
        {section === "references" && <References items={resume.references} onChange={(payload) => dispatch({ type: "SET_REFERENCES", payload })} />}
        {section === "other" && <Other entries={resume.otherEntries} onChange={(entries) => dispatch({ type: "SET_OTHER_ENTRIES", payload: entries })} />}
      </div>
    </section>
  );
}

function Projects({ items, onChange }: { items: Project[]; onChange: (items: Project[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <ProjectEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", date: "", technologies: [], highlights: [] }])}>+ Add</AddButton></>;
}

function ProjectEditor({ item, index, onChange, onRemove }: { item: Project; index: number; onChange: (item: Project) => void; onRemove: () => void }) {
  const update = <K extends keyof Project>(key: K, value: Project[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Project ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2">
    <Field label="Project name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Portfolio website" suggestionKey="projects.name" />
    <PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} />
    <div className="sm:col-span-2"><TagInput label="Technologies" values={item.technologies} onChange={(value) => update("technologies", value)} placeholder="Type a technology and press Enter" suggestionKey="projects.technologies" /></div>
    <div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="What did you build and why did it matter?" addLabel="+ Add" /></div>
  </div></EntryCard>;
}

function Certifications({ items, onChange }: { items: Certification[]; onChange: (items: Certification[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <CertificationEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", issuingOrganization: "", date: "" }])}>+ Add</AddButton></>;
}

function CertificationEditor({ item, index, onChange, onRemove }: { item: Certification; index: number; onChange: (item: Certification) => void; onRemove: () => void }) {
  const update = <K extends keyof Certification>(key: K, value: Certification[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Certification ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2">
    <Field label="Certificate name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="AWS Certified Cloud Practitioner" suggestionKey="certifications.name" />
    <Field label="Issuing Organization" value={item.issuingOrganization ?? ""} onChange={(event) => update("issuingOrganization", event.target.value)} placeholder="e.g. Amazon Web Services" />
    <PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} />
  </div></EntryCard>;
}

function Awards({ items, onChange }: { items: Award[]; onChange: (items: Award[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <AwardEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), title: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function AwardEditor({ item, index, onChange, onRemove }: { item: Award; index: number; onChange: (item: Award) => void; onRemove: () => void }) {
  const update = <K extends keyof Award>(key: K, value: Award[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.title || `Award ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Award name" value={item.title} onChange={(event) => update("title", event.target.value)} placeholder="Hackathon Champion" suggestionKey="awards.title" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="What was recognized?" addLabel="+ Add" /></div></div></EntryCard>;
}

function Volunteering({ items, onChange }: { items: VolunteerExperience[]; onChange: (items: VolunteerExperience[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <VolunteerEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), organization: "", role: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function VolunteerEditor({ item, index, onChange, onRemove }: { item: VolunteerExperience; index: number; onChange: (item: VolunteerExperience) => void; onRemove: () => void }) {
  const update = <K extends keyof VolunteerExperience>(key: K, value: VolunteerExperience[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.role || item.organization || `Volunteer experience ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Volunteer Developer" suggestionKey="volunteer.role" /><Field label="Organization" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="Cebu Community Organization" suggestionKey="volunteer.organization" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe your contribution." addLabel="+ Add" /></div></div></EntryCard>;
}

function Languages({ items, onChange }: { items: Language[]; onChange: (items: Language[]) => void }) {
  const proficiencyOptions = ["Native / Bilingual", "Fluent", "Proficient / Professional", "Conversational / Intermediate"];
  return <><div className="space-y-3">{items.map((item, index) => <EntryCard key={item.id} title={item.name || `Language ${index + 1}`} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}><div className="grid gap-4 sm:grid-cols-2"><Field label="Language" value={item.name} onChange={(event) => onChange(items.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry))} placeholder="Filipino" suggestionKey="languages.name" /><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Proficiency<select value={item.proficiency} onChange={(event) => onChange(items.map((entry) => entry.id === item.id ? { ...entry, proficiency: event.target.value } : entry))} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100"><option value="">Select proficiency</option>{proficiencyOptions.map((level) => <option key={level}>{level}</option>)}</select></label></div></EntryCard>)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", proficiency: "" }])}>+ Add</AddButton></>;
}

function Other({ entries, onChange }: { entries: OtherEntry[]; onChange: (entries: OtherEntry[]) => void }) {
  return <>
    <div className="space-y-3">{entries.map((entry, index) => <OtherEntryEditor key={entry.id} item={entry} index={index} onChange={(next) => onChange(entries.map((item) => item.id === next.id ? next : item))} onRemove={() => onChange(entries.filter((item) => item.id !== entry.id))} />)}</div>
    <AddButton onClick={() => onChange([...entries, { id: makeId(), name: "", date: "", highlights: [] }])}>+ Add</AddButton>
  </>;
}

function OtherEntryEditor({ item, index, onChange, onRemove }: { item: OtherEntry; index: number; onChange: (item: OtherEntry) => void; onRemove: () => void }) {
  const update = <K extends keyof OtherEntry>(key: K, value: OtherEntry[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Entry ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Entry name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Student Organization Officer" suggestionKey="other.name" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe what you did." addLabel="+ Add" /></div></div></EntryCard>;
}

function Publications({ items, onChange }: { items: Publication[]; onChange: (items: Publication[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <PublicationEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), title: "", authors: "", publisher: "", date: "", url: "", highlights: [] }])}>+ Add</AddButton></>;
}

function PublicationEditor({ item, index, onChange, onRemove }: { item: Publication; index: number; onChange: (item: Publication) => void; onRemove: () => void }) {
  const update = <K extends keyof Publication>(key: K, value: Publication[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.title || `Publication ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title" value={item.title} onChange={(event) => update("title", event.target.value)} placeholder="Paper Title" /><Field label="Authors" value={item.authors} onChange={(event) => update("authors", event.target.value)} placeholder="Doe, J., Smith, A." /><Field label="Publisher / Journal" value={item.publisher} onChange={(event) => update("publisher", event.target.value)} placeholder="Nature" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><Field label="URL" value={item.url} onChange={(event) => update("url", event.target.value)} placeholder="https://doi.org/..." /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Brief summary of the publication." addLabel="+ Add" /></div></div></EntryCard>;
}

function Presentations({ items, onChange }: { items: Presentation[]; onChange: (items: Presentation[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <PresentationEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), title: "", event: "", location: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function PresentationEditor({ item, index, onChange, onRemove }: { item: Presentation; index: number; onChange: (item: Presentation) => void; onRemove: () => void }) {
  const update = <K extends keyof Presentation>(key: K, value: Presentation[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.title || `Presentation ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Topic / Title" value={item.title} onChange={(event) => update("title", event.target.value)} placeholder="The Future of Web Dev" /><Field label="Event / Conference" value={item.event} onChange={(event) => update("event", event.target.value)} placeholder="React Conf 2024" /><Field label="Location" value={item.location} onChange={(event) => update("location", event.target.value)} placeholder="San Francisco, CA" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Brief summary of the presentation." addLabel="+ Add" /></div></div></EntryCard>;
}

function ResearchExperiences({ items, onChange }: { items: ResearchExperience[]; onChange: (items: ResearchExperience[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <ResearchExperienceEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), role: "", organization: "", project: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function ResearchExperienceEditor({ item, index, onChange, onRemove }: { item: ResearchExperience; index: number; onChange: (item: ResearchExperience) => void; onRemove: () => void }) {
  const update = <K extends keyof ResearchExperience>(key: K, value: ResearchExperience[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.role || `Research Experience ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Research Assistant" /><Field label="Organization / Lab" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="University Research Lab" /><Field label="Project Name" value={item.project} onChange={(event) => update("project", event.target.value)} placeholder="AI Robotics" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe your research contributions." addLabel="+ Add" /></div></div></EntryCard>;
}

function TeachingExperiences({ items, onChange }: { items: TeachingExperience[]; onChange: (items: TeachingExperience[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <TeachingExperienceEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), role: "", institution: "", location: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function TeachingExperienceEditor({ item, index, onChange, onRemove }: { item: TeachingExperience; index: number; onChange: (item: TeachingExperience) => void; onRemove: () => void }) {
  const update = <K extends keyof TeachingExperience>(key: K, value: TeachingExperience[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.role || `Teaching Experience ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Role / Title" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Teaching Assistant" /><Field label="Institution" value={item.institution} onChange={(event) => update("institution", event.target.value)} placeholder="University Name" /><Field label="Location" value={item.location} onChange={(event) => update("location", event.target.value)} placeholder="City, State" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe your teaching responsibilities." addLabel="+ Add" /></div></div></EntryCard>;
}

function Grants({ items, onChange }: { items: Grant[]; onChange: (items: Grant[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <GrantEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", issuer: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function GrantEditor({ item, index, onChange, onRemove }: { item: Grant; index: number; onChange: (item: Grant) => void; onRemove: () => void }) {
  const update = <K extends keyof Grant>(key: K, value: Grant[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Grant ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Grant Name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Research Fellowship" /><Field label="Issuer / Organization" value={item.issuer} onChange={(event) => update("issuer", event.target.value)} placeholder="National Science Foundation" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Details or amount." addLabel="+ Add" /></div></div></EntryCard>;
}

function Memberships({ items, onChange }: { items: Membership[]; onChange: (items: Membership[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <MembershipEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), organization: "", role: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function MembershipEditor({ item, index, onChange, onRemove }: { item: Membership; index: number; onChange: (item: Membership) => void; onRemove: () => void }) {
  const update = <K extends keyof Membership>(key: K, value: Membership[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.organization || `Membership ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Organization" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="IEEE" /><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Member" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Details of membership." addLabel="+ Add" /></div></div></EntryCard>;
}

function Organizations({ items, onChange }: { items: OrganizationRole[]; onChange: (items: OrganizationRole[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <OrganizationEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), organization: "", role: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function OrganizationEditor({ item, index, onChange, onRemove }: { item: OrganizationRole; index: number; onChange: (item: OrganizationRole) => void; onRemove: () => void }) {
  const update = <K extends keyof OrganizationRole>(key: K, value: OrganizationRole[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.organization || `Organization ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Organization" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="Computer Science Club" /><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="President" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Details of involvement." addLabel="+ Add" /></div></div></EntryCard>;
}

function Leadership({ items, onChange }: { items: LeadershipExperience[]; onChange: (items: LeadershipExperience[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <LeadershipEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), role: "", organization: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function LeadershipEditor({ item, index, onChange, onRemove }: { item: LeadershipExperience; index: number; onChange: (item: LeadershipExperience) => void; onRemove: () => void }) {
  const update = <K extends keyof LeadershipExperience>(key: K, value: LeadershipExperience[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.role || `Leadership ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Team Lead" /><Field label="Organization / Project" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="Open Source Project" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Details of leadership." addLabel="+ Add" /></div></div></EntryCard>;
}

function References({ items, onChange }: { items: Reference[]; onChange: (items: Reference[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <ReferenceEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", title: "", company: "", contactInfo: "" }])}>+ Add</AddButton></>;
}

function ReferenceEditor({ item, index, onChange, onRemove }: { item: Reference; index: number; onChange: (item: Reference) => void; onRemove: () => void }) {
  const update = <K extends keyof Reference>(key: K, value: Reference[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Reference ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Jane Doe" /><Field label="Title / Role" value={item.title} onChange={(event) => update("title", event.target.value)} placeholder="Professor" /><Field label="Company / Institution" value={item.company} onChange={(event) => update("company", event.target.value)} placeholder="University Name" /><Field label="Contact Info" value={item.contactInfo} onChange={(event) => update("contactInfo", event.target.value)} placeholder="jane.doe@email.com" /></div></EntryCard>;
}