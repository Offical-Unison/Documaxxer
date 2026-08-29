"use client";

import { useState } from "react";
import { AddButton, EntryCard, Field, TagInput } from "@/components/builder/form-controls";
import { BulletListInput } from "@/components/builder/bullet-list";
import { PartialDateField } from "@/components/builder/date-input";
import { LinkListInput } from "@/components/builder/link-list";
import { PhoneField } from "@/components/builder/phone-input";
import { EditableTitle } from "@/components/builder/editable-title";
import { OptionalResumeSections } from "@/components/builder/optional-resume-sections";
import { useResumeContext } from "@/context/resume-context";
import { isValidPhoneNumber } from "@/lib/phone";
import { getDocumentSteps } from "@/lib/document-config";
import type { Education, Experience, PersonalDetails } from "@/types/resume";

const makeId = () => crypto.randomUUID();

const SECTION_HEADING_CLASS = "text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl";

function Section({ title, description, children }: { title: React.ReactNode; description?: string; children: React.ReactNode }) {
  return (
    <section>
      {typeof title === "string" ? <h2 className={SECTION_HEADING_CLASS}>{title}</h2> : title}
      {description && <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function ResumeFormContainer() {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;
  const steps = getDocumentSteps(state.documentType);
  const LAST_STEP = steps.length - 1;
  const savedStep = Number(state.activeSection);
  const currentStep = savedStep >= 0 && savedStep <= LAST_STEP ? savedStep : 0;
  const currentStepConfig = steps[currentStep] || steps[0];
  const stepId = currentStepConfig.id;
  const [showErrors, setShowErrors] = useState(false);
  const personal = resume.personalDetails;
  const primarySkills = resume.skills;
  const titleFor = (id: keyof typeof resume.sectionTitles) => resume.sectionTitles[id];
  const renameTitle = (id: keyof typeof resume.sectionTitles) => (title: string) => dispatch({ type: "SET_SECTION_TITLE", payload: { id, title } });

  const updatePersonal = (update: Omit<Partial<PersonalDetails>, "contact"> & { contact?: Partial<PersonalDetails["contact"]> }) => {
    dispatch({ type: "UPDATE_PERSONAL_DETAILS", payload: { ...personal, ...update, contact: { ...personal.contact, ...update.contact } } });
  };
  const setExperience = (items: Experience[]) => dispatch({ type: "SET_EXPERIENCES", payload: items });
  const setEducation = (items: Education[]) => dispatch({ type: "SET_EDUCATION", payload: items });

  const phoneValid = isValidPhoneNumber(personal.contact.phoneCountry, personal.contact.phoneNumber);
  const hasPersonalErrors = !personal.firstName.trim() || !personal.lastName.trim() || !personal.contact.email.trim() || !personal.contact.phoneNumber.trim() || !phoneValid || !personal.contact.location.trim();
  const hasExperienceErrors = resume.experiences.some((item) => !item.employer.trim() || !item.role.trim() || !item.location.trim() || !item.startDate || (!item.current && !item.endDate) || !item.highlights.some((line) => line.trim()));
  const hasEducationErrors = resume.education.length === 0 || resume.education.some((item) => !item.institution.trim() || !item.degree.trim() || (item.educationType === "college" && !item.fieldOfStudy.trim()) || !item.startDate || (!item.current && !item.endDate));
  const hasSkillsErrors = primarySkills.length === 0;

  
  const invalidStep = () => {
    switch (stepId) {
      case "personal": return hasPersonalErrors;
      case "experience": return hasExperienceErrors;
      case "education": return hasEducationErrors;
      case "skills": return hasSkillsErrors;
      default: return false;
    }
  };
  const goTo = (nextStep: number) => { setShowErrors(false); dispatch({ type: "SET_ACTIVE_SECTION", payload: String(nextStep) }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => {
    if (invalidStep()) { setShowErrors(true); return; }
    if (currentStep < LAST_STEP) { goTo(currentStep + 1); }
    else { dispatch({ type: "UNLOCK_GENERATE" }); }
  };

  return (
    <div aria-labelledby="form-title" className="min-w-0 pb-12">
      <div className="flex flex-col gap-3 border-b border-slate-200/60 pb-5 dark:border-slate-700/60 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Resume content</p>
          <h1 id="form-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            {state.documentType === "cv" ? "Build your Curriculum Vitae" : "Build your resume"}
          </h1>
        </div>
        <p className="text-sm font-medium tabular-nums text-slate-400 dark:text-slate-500">Step {currentStep + 1} of {steps.length}</p>
      </div>

      <nav className="mt-5" aria-label="Resume form sections">
        <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
          {steps.map((step, number) => {
            const isCompleted = number < currentStep;
            const isCurrent = number === currentStep;
            return (
              <li key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => number < currentStep && goTo(number)}
                  disabled={number > currentStep}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-3.5 sm:py-2 ${
                    isCurrent
                      ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                      : isCompleted
                        ? "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        : "bg-transparent text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-[10px]">✓</span>
                  ) : isCurrent ? (
                    <span className="text-[10px]">●</span>
                  ) : (
                    <span className="text-[10px]">○</span>
                  )}
                  {step.label}
                </button>
                {number < LAST_STEP && <span className="mx-0.5 text-slate-300 dark:text-slate-700 sm:mx-1">→</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      <form className="mt-8 pb-20" onSubmit={(event) => { event.preventDefault(); next(); }} noValidate>
        {stepId === "personal" && (
          <Section title={<EditableTitle as="h2" className={SECTION_HEADING_CLASS} title={titleFor("personal")} onSave={renameTitle("personal")} />} description="Start with the details recruiters use to contact you.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required value={personal.firstName} onChange={(event) => updatePersonal({ firstName: event.target.value })} error={showErrors && !personal.firstName.trim() ? "First name is required." : undefined} placeholder="John" />
              <Field label="Last name" required value={personal.lastName} onChange={(event) => updatePersonal({ lastName: event.target.value })} error={showErrors && !personal.lastName.trim() ? "Last name is required." : undefined} placeholder="Doe" />
              <Field label="Title" value={personal.headline} onChange={(event) => updatePersonal({ headline: event.target.value })} placeholder="Software Developer" className="sm:col-span-2" suggestionKey="personal.headline" />
              <Field label="Email" required type="email" value={personal.contact.email} onChange={(event) => updatePersonal({ contact: { email: event.target.value } })} error={showErrors && !personal.contact.email.trim() ? "Email is required." : undefined} placeholder="john.doe@email.com" />
              <PhoneField
                required
                countryCode={personal.contact.phoneCountry}
                number={personal.contact.phoneNumber}
                onCountryChange={(code) => updatePersonal({ contact: { phoneCountry: code } })}
                onNumberChange={(value) => updatePersonal({ contact: { phoneNumber: value } })}
                error={showErrors ? (!personal.contact.phoneNumber.trim() ? "Phone number is required." : !phoneValid ? "Enter a valid phone number." : undefined) : undefined}
              />
              <Field label="Location" required value={personal.contact.location} onChange={(event) => updatePersonal({ contact: { location: event.target.value } })} error={showErrors && !personal.contact.location.trim() ? "Location is required." : undefined} placeholder="Cebu, Philippines" suggestionKey="personal.location" />
            </div>
            <div className="mt-6"><LinkListInput values={personal.links} onChange={(links) => updatePersonal({ links })} makeId={makeId} /></div>
          </Section>
        )}

        {stepId === "experience" && (
          <Section title={<EditableTitle as="h2" className={SECTION_HEADING_CLASS} title={titleFor("experience")} onSave={renameTitle("experience")} />} description="This section is optional. Add roles that best demonstrate your impact.">
            <div className="space-y-3">
              {resume.experiences.map((item, index) => (
                <ExperienceEditor key={item.id} item={item} index={index} showErrors={showErrors} onChange={(nextItem) => setExperience(resume.experiences.map((entry) => entry.id === nextItem.id ? nextItem : entry))} onRemove={() => setExperience(resume.experiences.filter((entry) => entry.id !== item.id))} />
              ))}
            </div>
            <AddButton onClick={() => setExperience([...resume.experiences, { id: makeId(), employer: "", role: "", location: "", startDate: "", endDate: "", current: false, highlights: [] }])}>+ Add</AddButton>
          </Section>
        )}

        {stepId === "education" && (
          <Section title={<EditableTitle as="h2" className={SECTION_HEADING_CLASS} title={titleFor("education")} onSave={renameTitle("education")} />} description="Add at least one college, university, or high school entry.">
            <div className="space-y-3">
              {resume.education.map((item, index) => (
                <EducationEditor key={item.id} item={item} index={index} showErrors={showErrors} onChange={(nextItem) => setEducation(resume.education.map((entry) => entry.id === nextItem.id ? nextItem : entry))} onRemove={() => setEducation(resume.education.filter((entry) => entry.id !== item.id))} />
              ))}
            </div>
            {showErrors && resume.education.length === 0 && <p className="mt-3 text-sm text-red-600 dark:text-red-400">Add at least one education entry to continue.</p>}
            <div className="mt-4">
              <AddButton onClick={() => setEducation([...resume.education, blankEducation("college")])}>+ Add</AddButton>
            </div>
          </Section>
        )}

        {stepId === "skills" && (
          <Section title={<EditableTitle as="h2" className={SECTION_HEADING_CLASS} title={titleFor("skills")} onSave={renameTitle("skills")} />} description="Add the individual skills most relevant to the role you want.">
            <TagInput label="Skills" values={primarySkills} onChange={(values) => dispatch({ type: "SET_SKILLS", payload: values })} placeholder="Type a skill and press Enter" suggestionKey="skills" />
            {showErrors && hasSkillsErrors && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Add at least one skill to continue.</p>}
          </Section>
        )}



        {stepId === "additional" && (
          <Section title="Additional Sections" description="Choose sections that strengthen your resume. These are optional, so add only what is relevant to you.">
            <OptionalResumeSections />
          </Section>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B0F19]/90 sm:px-8 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:border-r">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <button
              type="button"
              onClick={() => goTo(currentStep - 1)}
              disabled={currentStep === 0}
              className="min-h-11 rounded-xl border border-slate-200/80 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {currentStep < LAST_STEP ? "Continue →" : "Finish →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ExperienceEditor({ item, index, showErrors, onChange, onRemove }: { item: Experience; index: number; showErrors: boolean; onChange: (item: Experience) => void; onRemove: () => void }) {
  const update = <K extends keyof Experience>(key: K, value: Experience[K]) => onChange({ ...item, [key]: value });
  const hasHighlight = item.highlights.some((line) => line.trim());

  return (
    <EntryCard title={item.role || item.employer || `Experience ${index + 1}`} onRemove={onRemove}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" required value={item.employer} onChange={(event) => update("employer", event.target.value)} error={showErrors && !item.employer.trim() ? "Company is required." : undefined} placeholder="Acme Inc." suggestionKey="experience.employer" />
        <Field label="Job title" required value={item.role} onChange={(event) => update("role", event.target.value)} error={showErrors && !item.role.trim() ? "Job title is required." : undefined} placeholder="Software Developer" suggestionKey="experience.role" />
        <Field label="Location" required value={item.location} onChange={(event) => update("location", event.target.value)} error={showErrors && !item.location.trim() ? "Location is required." : undefined} placeholder="Cebu, Philippines" suggestionKey="experience.location" />
        <div className="flex items-end">
          <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={item.current} onChange={(event) => onChange({ ...item, current: event.target.checked, endDate: event.target.checked ? "" : item.endDate })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800" />
            Current job
          </label>
        </div>
        <PartialDateField label="Start date" required value={item.startDate} onChange={(value) => update("startDate", value)} error={showErrors && !item.startDate ? "Start date is required." : undefined} />
        <PartialDateField label="End date" required={!item.current} disabled={item.current} value={item.endDate} onChange={(value) => update("endDate", value)} error={showErrors && !item.current && !item.endDate ? "End date is required." : undefined} />
        <div className="sm:col-span-2">
          <BulletListInput label="Description" values={item.highlights} onChange={(value) => update("highlights", value)} placeholder="Describe an achievement or responsibility" addLabel="+ Add" />
          {showErrors && !hasHighlight && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Add at least one description.</p>}
        </div>
      </div>
    </EntryCard>
  );
}

function blankEducation(educationType: Education["educationType"]): Education {
  return { id: makeId(), educationType, institution: "", degree: "", fieldOfStudy: "", location: "", startDate: "", endDate: "", current: false, awards: [], gradeLabel: "", gradeValue: "" };
}

function EducationEditor({ item, index, showErrors, onChange, onRemove }: { item: Education; index: number; showErrors: boolean; onChange: (item: Education) => void; onRemove: () => void }) {
  const update = <K extends keyof Education>(key: K, value: Education[K]) => onChange({ ...item, [key]: value });
  const isCollege = item.educationType === "college";

  return (
    <EntryCard title={item.institution || `${isCollege ? "College / University" : "High School"} ${index + 1}`} onRemove={onRemove}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Education level
          <select
            value={item.educationType}
            onChange={(event) => onChange({ ...item, educationType: event.target.value as Education["educationType"], fieldOfStudy: event.target.value === "highSchool" ? "" : item.fieldOfStudy })}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="college">College / University</option>
            <option value="highSchool">High School</option>
          </select>
        </label>

        <Field label="School" required value={item.institution} onChange={(event) => update("institution", event.target.value)} error={showErrors && !item.institution.trim() ? "School is required." : undefined} placeholder={isCollege ? "University of San Carlos" : "Cebu City National Science High School"} suggestionKey="education.institution" />

        {isCollege ? (
          <>
            <Field label="Degree" required value={item.degree} onChange={(event) => update("degree", event.target.value)} error={showErrors && !item.degree.trim() ? "Degree is required." : undefined} placeholder="Bachelor of Science" suggestionKey="education.degree" />
            <Field label="Field of study" required value={item.fieldOfStudy} onChange={(event) => update("fieldOfStudy", event.target.value)} error={showErrors && !item.fieldOfStudy.trim() ? "Field of study is required." : undefined} placeholder="Computer Science" suggestionKey="education.fieldOfStudy" />
            <PartialDateField label="Start date" required value={item.startDate} onChange={(value) => update("startDate", value)} error={showErrors && !item.startDate ? "Start date is required." : undefined} />
            <div className="flex items-end">
              <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={item.current} onChange={(event) => onChange({ ...item, current: event.target.checked, endDate: event.target.checked ? "" : item.endDate })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800" />
                Currently studying
              </label>
            </div>
            <PartialDateField label="End date" required={!item.current} disabled={item.current} value={item.endDate} onChange={(value) => update("endDate", value)} error={showErrors && !item.current && !item.endDate ? "End date is required." : undefined} />
          </>
        ) : (
          <>
            <PartialDateField label="Start date" required value={item.startDate} onChange={(value) => update("startDate", value)} error={showErrors && !item.startDate ? "Start date is required." : undefined} />
            <Field label="Strand / Program" required value={item.degree} onChange={(event) => update("degree", event.target.value)} error={showErrors && !item.degree.trim() ? "Strand / Program is required." : undefined} placeholder="STEM" suggestionKey="education.degree" />
            <PartialDateField label="End date" required={!item.current} disabled={item.current} value={item.endDate} onChange={(value) => update("endDate", value)} error={showErrors && !item.current && !item.endDate ? "End date is required." : undefined} />
            <div className="flex items-end">
              <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={item.current} onChange={(event) => onChange({ ...item, current: event.target.checked, endDate: event.target.checked ? "" : item.endDate })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800" />
                Currently studying
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
        <BulletListInput
          label="Academic Awards / Achievements"
          values={item.awards.map((award) => award.name)}
          onChange={(values) => update("awards", values.map((name, awardIndex) => ({ id: item.awards[awardIndex]?.id ?? makeId(), name })))}
          placeholder="Dean's Lister"
          addLabel="+ Add"
          bulletMark={false}
        />
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">Optional. Shown together on one line, separated by &quot;•&quot;.</p>
      </div>

      <div className="mt-6 border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Academic Grade (optional)</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Shown under the education dates. Leave empty to hide.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Grade label" value={item.gradeLabel ?? ""} onChange={(event) => update("gradeLabel", event.target.value)} placeholder="GPA" />
          <Field label="Grade value" value={item.gradeValue ?? ""} onChange={(event) => update("gradeValue", event.target.value)} placeholder="e.g. 1.50" />
        </div>
      </div>
    </EntryCard>
  );
}
