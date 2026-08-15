"use client";

import { useState } from "react";
import { AddButton, EntryCard, Field, TagInput } from "@/components/builder/form-controls";
import { BulletListInput } from "@/components/builder/bullet-list";
import { PartialDateField } from "@/components/builder/date-input";
import { EditableTitle } from "@/components/builder/editable-title";
import { useResumeContext } from "@/context/resume-context";
import type { Award, Certification, Language, OptionalSectionKey, OtherEntry, Project, VolunteerExperience } from "@/types/resume";

const makeId = () => crypto.randomUUID();

const sectionOptions: { key: OptionalSectionKey; label: string; description: string; recommended?: boolean }[] = [
  { key: "projects", label: "Projects", description: "Showcase personal, academic, or professional projects.", recommended: true },
  { key: "certifications", label: "Certifications", description: "Add certifications, licenses, or completed courses." },
  { key: "awards", label: "Awards", description: "Highlight academic or professional achievements." },
  { key: "volunteerExperiences", label: "Volunteer Experience", description: "Include relevant volunteer work and organizations." },
  { key: "languages", label: "Languages", description: "List languages and your proficiency level." },
  { key: "other", label: "Other", description: "Add a custom section such as leadership, publications, or activities." },
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
        {sectionOptions.map((section) => {
          const added = resume.optionalSections.includes(section.key);
          return (
            <article
              key={section.key}
              className={`flex min-h-44 flex-col rounded-2xl border p-5 transition ${
                section.recommended
                  ? "border-blue-200/80 bg-blue-50/50 shadow-[0_4px_16px_rgba(37,99,235,0.06)]"
                  : "border-slate-200/80 bg-white/60 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">{section.label}</h3>
                {section.recommended && (
                  <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    Recommended for students
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-sm leading-6 text-slate-500">{section.description}</p>
              <div className="mt-auto pt-5">
                {added ? (
                  <span className="inline-flex min-h-10 items-center rounded-xl bg-green-50 px-3.5 text-sm font-semibold text-green-700">
                    ✓ Added
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => addSection(section.key)}
                    className="min-h-10 rounded-xl border border-blue-200/80 bg-white/80 px-4 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
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
        <div className="mt-8 border-t border-slate-200/80 pt-7">
          <h3 className="text-base font-bold text-slate-900">Added sections</h3>
          <p className="mt-1 text-xs text-slate-400">Drag a section to reorder how it appears on your resume.</p>
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
    <section className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex cursor-grab items-center gap-2">
          <span className="text-slate-300" aria-hidden="true">⠿</span>
          <EditableTitle
            as="h4"
            className="font-semibold text-slate-900"
            title={resume.sectionTitles[section]}
            onSave={(title) => dispatch({ type: "SET_SECTION_TITLE", payload: { id: section, title } })}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="min-h-10 rounded-xl px-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          Remove section
        </button>
      </div>
      <div className="mt-4">
        {section === "projects" && <Projects items={resume.projects} onChange={(payload) => dispatch({ type: "SET_PROJECTS", payload })} />}
        {section === "certifications" && <Certifications items={resume.certifications} onChange={(payload) => dispatch({ type: "SET_CERTIFICATIONS", payload })} />}
        {section === "awards" && <Awards items={resume.awards} onChange={(payload) => dispatch({ type: "SET_AWARDS", payload })} />}
        {section === "volunteerExperiences" && <Volunteering items={resume.volunteerExperiences} onChange={(payload) => dispatch({ type: "SET_VOLUNTEER_EXPERIENCES", payload })} />}
        {section === "languages" && <Languages items={resume.languages} onChange={(payload) => dispatch({ type: "SET_LANGUAGES", payload })} />}
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
    <Field label="Project name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Portfolio website" />
    <PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} />
    <div className="sm:col-span-2"><TagInput label="Technologies" values={item.technologies} onChange={(value) => update("technologies", value)} placeholder="Type a technology and press Enter" /></div>
    <div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="What did you build and why did it matter?" addLabel="+ Add" /></div>
  </div></EntryCard>;
}

function Certifications({ items, onChange }: { items: Certification[]; onChange: (items: Certification[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <CertificationEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", date: "" }])}>+ Add</AddButton></>;
}

function CertificationEditor({ item, index, onChange, onRemove }: { item: Certification; index: number; onChange: (item: Certification) => void; onRemove: () => void }) {
  const update = <K extends keyof Certification>(key: K, value: Certification[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Certification ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Certificate name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="AWS Certified Cloud Practitioner" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /></div></EntryCard>;
}

function Awards({ items, onChange }: { items: Award[]; onChange: (items: Award[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <AwardEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), title: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function AwardEditor({ item, index, onChange, onRemove }: { item: Award; index: number; onChange: (item: Award) => void; onRemove: () => void }) {
  const update = <K extends keyof Award>(key: K, value: Award[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.title || `Award ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Award name" value={item.title} onChange={(event) => update("title", event.target.value)} placeholder="Hackathon Champion" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="What was recognized?" addLabel="+ Add" /></div></div></EntryCard>;
}

function Volunteering({ items, onChange }: { items: VolunteerExperience[]; onChange: (items: VolunteerExperience[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <VolunteerEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), organization: "", role: "", date: "", highlights: [] }])}>+ Add</AddButton></>;
}

function VolunteerEditor({ item, index, onChange, onRemove }: { item: VolunteerExperience; index: number; onChange: (item: VolunteerExperience) => void; onRemove: () => void }) {
  const update = <K extends keyof VolunteerExperience>(key: K, value: VolunteerExperience[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.role || item.organization || `Volunteer experience ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Volunteer Developer" /><Field label="Organization" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="Cebu Community Organization" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe your contribution." addLabel="+ Add" /></div></div></EntryCard>;
}

function Languages({ items, onChange }: { items: Language[]; onChange: (items: Language[]) => void }) {
  const proficiencyOptions = ["Native / Bilingual", "Fluent", "Proficient / Professional", "Conversational / Intermediate"];
  return <><div className="space-y-3">{items.map((item, index) => <EntryCard key={item.id} title={item.name || `Language ${index + 1}`} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}><div className="grid gap-4 sm:grid-cols-2"><Field label="Language" value={item.name} onChange={(event) => onChange(items.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry))} placeholder="Filipino" /><label className="block text-sm font-medium text-slate-700">Proficiency<select value={item.proficiency} onChange={(event) => onChange(items.map((entry) => entry.id === item.id ? { ...entry, proficiency: event.target.value } : entry))} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"><option value="">Select proficiency</option>{proficiencyOptions.map((level) => <option key={level}>{level}</option>)}</select></label></div></EntryCard>)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", proficiency: "" }])}>+ Add</AddButton></>;
}

function Other({ entries, onChange }: { entries: OtherEntry[]; onChange: (entries: OtherEntry[]) => void }) {
  return <>
    <div className="space-y-3">{entries.map((entry, index) => <OtherEntryEditor key={entry.id} item={entry} index={index} onChange={(next) => onChange(entries.map((item) => item.id === next.id ? next : item))} onRemove={() => onChange(entries.filter((item) => item.id !== entry.id))} />)}</div>
    <AddButton onClick={() => onChange([...entries, { id: makeId(), name: "", date: "", highlights: [] }])}>+ Add</AddButton>
  </>;
}

function OtherEntryEditor({ item, index, onChange, onRemove }: { item: OtherEntry; index: number; onChange: (item: OtherEntry) => void; onRemove: () => void }) {
  const update = <K extends keyof OtherEntry>(key: K, value: OtherEntry[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Entry ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Entry name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Student Organization Officer" /><PartialDateField label="Date" value={item.date} onChange={(value) => update("date", value)} /><div className="sm:col-span-2"><BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe what you did." addLabel="+ Add" /></div></div></EntryCard>;
}
