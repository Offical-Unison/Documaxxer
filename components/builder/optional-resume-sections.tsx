"use client";

import { AddButton, EntryCard, Field, TagInput, Textarea } from "@/components/builder/form-controls";
import { useResumeContext } from "@/context/resume-context";
import type { Award, Certification, Language, OptionalSectionKey, Project, VolunteerExperience } from "@/types/resume";

const makeId = () => crypto.randomUUID();

const sectionOptions: { key: OptionalSectionKey; label: string; description: string; recommended?: boolean }[] = [
  { key: "projects", label: "Projects", description: "Showcase personal, academic, or professional projects.", recommended: true },
  { key: "certifications", label: "Certifications", description: "Add certifications, licenses, or completed courses." },
  { key: "awards", label: "Awards", description: "Highlight academic or professional achievements." },
  { key: "volunteerExperiences", label: "Volunteer Experience", description: "Include relevant volunteer work and organizations." },
  { key: "languages", label: "Languages", description: "List languages and your proficiency level." },
  { key: "interests", label: "Interests", description: "Add a few interests that represent you." },
];

export function OptionalResumeSections() {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;
  const addSection = (key: OptionalSectionKey) => dispatch({ type: "SET_OPTIONAL_SECTIONS", payload: [...resume.optionalSections, key] });
  const removeSection = (key: OptionalSectionKey) => dispatch({ type: "SET_OPTIONAL_SECTIONS", payload: resume.optionalSections.filter((section) => section !== key) });
  return <section><div className="grid gap-4 sm:grid-cols-2">{sectionOptions.map((section) => {
    const added = resume.optionalSections.includes(section.key);
    return <article key={section.key} className={`flex min-h-45 flex-col rounded-2xl border p-5 transition ${section.recommended ? "border-blue-200 bg-blue-50/65 shadow-[0_8px_20px_rgba(37,99,235,0.08)]" : "border-slate-200/90 bg-white/60"}`}>
      <div className="flex items-start justify-between gap-3"><h3 className="text-base font-semibold text-slate-900">{section.label}</h3>{section.recommended && <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">Recommended for students</span>}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
      <div className="mt-auto pt-5">{added ? <span className="inline-flex min-h-10 items-center rounded-xl bg-green-50 px-3 text-sm font-semibold text-green-700">✓ Added</span> : <button type="button" onClick={() => addSection(section.key)} className="min-h-10 rounded-xl border border-blue-200 bg-white/70 px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50">+ Add</button>}</div>
    </article>;
  })}</div>
    {resume.optionalSections.length > 0 && <div className="mt-8 border-t border-slate-200/80 pt-7"><h3 className="text-base font-semibold text-slate-900">Added sections</h3><div className="mt-4 space-y-5">{resume.optionalSections.map((section) => <OptionalSection key={section} section={section} onRemove={() => removeSection(section)} />)}</div></div>}
  </section>;
}

function OptionalSection({ section, onRemove }: { section: OptionalSectionKey; onRemove: () => void }) {
  const { state, dispatch } = useResumeContext();
  const resume = state.resume;
  const heading = sectionOptions.find((option) => option.key === section)?.label ?? section;
  return <section className="rounded-2xl border border-slate-200/90 bg-white/60 p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><h4 className="font-semibold text-slate-900">{heading}</h4><button type="button" onClick={onRemove} className="min-h-10 rounded-xl px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700">Remove section</button></div><div className="mt-4">
    {section === "projects" && <Projects items={resume.projects} onChange={(payload) => dispatch({ type: "SET_PROJECTS", payload })} />}
    {section === "certifications" && <Certifications items={resume.certifications} onChange={(payload) => dispatch({ type: "SET_CERTIFICATIONS", payload })} />}
    {section === "awards" && <Awards items={resume.awards} onChange={(payload) => dispatch({ type: "SET_AWARDS", payload })} />}
    {section === "volunteerExperiences" && <Volunteering items={resume.volunteerExperiences} onChange={(payload) => dispatch({ type: "SET_VOLUNTEER_EXPERIENCES", payload })} />}
    {section === "languages" && <Languages items={resume.languages} onChange={(payload) => dispatch({ type: "SET_LANGUAGES", payload })} />}
    {section === "interests" && <TagInput label="Interests" values={resume.interests} onChange={(payload) => dispatch({ type: "SET_INTERESTS", payload })} placeholder="Type an interest and press Enter" />}
  </div></section>;
}

function Projects({ items, onChange }: { items: Project[]; onChange: (items: Project[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <ProjectEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", role: "", url: "", githubUrl: "", technologies: [], startDate: "", endDate: "", description: "", highlights: [] }])}>+ Add project</AddButton></>;
}
function ProjectEditor({ item, index, onChange, onRemove }: { item: Project; index: number; onChange: (item: Project) => void; onRemove: () => void }) {
  const update = <K extends keyof Project>(key: K, value: Project[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Project ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Project name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="Portfolio website" /><Field label="Project URL" type="url" value={item.url} onChange={(event) => update("url", event.target.value)} placeholder="https://example.com" /><Field label="GitHub URL" type="url" value={item.githubUrl} onChange={(event) => update("githubUrl", event.target.value)} placeholder="https://github.com/..." /><Field label="Start date" type="month" value={item.startDate} onChange={(event) => update("startDate", event.target.value)} /><Field label="End date" type="month" value={item.endDate} onChange={(event) => update("endDate", event.target.value)} /><div className="sm:col-span-2"><TagInput label="Technologies" values={item.technologies} onChange={(value) => update("technologies", value)} placeholder="Type a technology and press Enter" /></div><Textarea label="Description" className="sm:col-span-2" value={item.description} onChange={(event) => update("description", event.target.value)} placeholder="What did you build and why did it matter?" /></div></EntryCard>;
}

function Certifications({ items, onChange }: { items: Certification[]; onChange: (items: Certification[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <CertificationEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", issuer: "", issueDate: "", expiryDate: "", credentialUrl: "" }])}>+ Add certification</AddButton></>;
}
function CertificationEditor({ item, index, onChange, onRemove }: { item: Certification; index: number; onChange: (item: Certification) => void; onRemove: () => void }) {
  const update = <K extends keyof Certification>(key: K, value: Certification[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.name || `Certification ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Certification name" value={item.name} onChange={(event) => update("name", event.target.value)} placeholder="AWS Certified Developer" /><Field label="Issuing organization" value={item.issuer} onChange={(event) => update("issuer", event.target.value)} placeholder="Amazon Web Services" /><Field label="Issue date" type="month" value={item.issueDate} onChange={(event) => update("issueDate", event.target.value)} /><Field label="Expiration date" type="month" value={item.expiryDate} onChange={(event) => update("expiryDate", event.target.value)} /><Field label="Credential URL" type="url" className="sm:col-span-2" value={item.credentialUrl} onChange={(event) => update("credentialUrl", event.target.value)} placeholder="https://..." /></div></EntryCard>;
}

function Awards({ items, onChange }: { items: Award[]; onChange: (items: Award[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <AwardEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), title: "", issuer: "", date: "", description: "" }])}>+ Add award</AddButton></>;
}
function AwardEditor({ item, index, onChange, onRemove }: { item: Award; index: number; onChange: (item: Award) => void; onRemove: () => void }) {
  const update = <K extends keyof Award>(key: K, value: Award[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.title || `Award ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Award name" value={item.title} onChange={(event) => update("title", event.target.value)} placeholder="Design excellence award" /><Field label="Organization" value={item.issuer} onChange={(event) => update("issuer", event.target.value)} placeholder="Design Association" /><Field label="Date" type="month" value={item.date} onChange={(event) => update("date", event.target.value)} /><Textarea label="Description" className="sm:col-span-2" value={item.description} onChange={(event) => update("description", event.target.value)} placeholder="What was recognized?" /></div></EntryCard>;
}

function Volunteering({ items, onChange }: { items: VolunteerExperience[]; onChange: (items: VolunteerExperience[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <VolunteerEditor key={item.id} item={item} index={index} onChange={(next) => onChange(items.map((entry) => entry.id === next.id ? next : entry))} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))} />)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), organization: "", role: "", location: "", startDate: "", endDate: "", description: "", highlights: [] }])}>+ Add volunteer experience</AddButton></>;
}
function VolunteerEditor({ item, index, onChange, onRemove }: { item: VolunteerExperience; index: number; onChange: (item: VolunteerExperience) => void; onRemove: () => void }) {
  const update = <K extends keyof VolunteerExperience>(key: K, value: VolunteerExperience[K]) => onChange({ ...item, [key]: value });
  return <EntryCard title={item.role || item.organization || `Volunteer experience ${index + 1}`} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><Field label="Organization" value={item.organization} onChange={(event) => update("organization", event.target.value)} placeholder="Community food bank" /><Field label="Role" value={item.role} onChange={(event) => update("role", event.target.value)} placeholder="Volunteer coordinator" /><Field label="Start date" type="month" value={item.startDate} onChange={(event) => update("startDate", event.target.value)} /><Field label="End date" type="month" value={item.endDate} onChange={(event) => update("endDate", event.target.value)} /><Textarea label="Description" className="sm:col-span-2" value={item.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe your contribution." /></div></EntryCard>;
}

function Languages({ items, onChange }: { items: Language[]; onChange: (items: Language[]) => void }) {
  return <><div className="space-y-3">{items.map((item, index) => <EntryCard key={item.id} title={item.name || `Language ${index + 1}`} onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}><div className="grid gap-4 sm:grid-cols-2"><Field label="Language" value={item.name} onChange={(event) => onChange(items.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry))} placeholder="Spanish" /><label className="block text-sm font-medium text-slate-700">Proficiency<select value={item.proficiency} onChange={(event) => onChange(items.map((entry) => entry.id === item.id ? { ...entry, proficiency: event.target.value } : entry))} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"><option value="">Select proficiency</option>{["Beginner", "Elementary", "Intermediate", "Upper Intermediate", "Advanced", "Native"].map((level) => <option key={level}>{level}</option>)}</select></label></div></EntryCard>)}</div><AddButton onClick={() => onChange([...items, { id: makeId(), name: "", proficiency: "" }])}>+ Add language</AddButton></>;
}
