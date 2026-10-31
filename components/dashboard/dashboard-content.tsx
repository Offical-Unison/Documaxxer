"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { exportDocumentToDocx } from "@/lib/export/docx-export";
import { DOCUMENT_TYPE_LABELS } from "@/lib/documents/document-layout";
import { isDocumentType, type DocumentData } from "@/types/document";

type DocumentSummary = {
  id: string;
  name: string;
  documentType: string;
  templateId: string;
  content: string;
  selectedFontId: string | null;
  updatedAt: string;
};

type BuiltInTemplate = { id: string; name: string; description: string; documentType: string };
type OwnedTemplate = BuiltInTemplate & { kind: "visual" | "form"; updatedAt: string };

const PROFILE_FIELDS = [
  { key: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { key: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { key: "location", label: "Location", type: "text", autoComplete: "address-level2" },
] as const;

type ProfileKey = (typeof PROFILE_FIELDS)[number]["key"];
type Profile = Record<ProfileKey, string>;

const typeLabel = (documentType: string) => (isDocumentType(documentType) ? DOCUMENT_TYPE_LABELS[documentType] : documentType.replace(/-/g, " "));

function parseContent(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return {}; }
}

export function DashboardContent({ userName }: { userName: string }) {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [builtInTemplates, setBuiltInTemplates] = useState<BuiltInTemplate[]>([]);
  const [ownedTemplates, setOwnedTemplates] = useState<OwnedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ firstName: "", lastName: "", email: "", phone: "", location: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const [documentsResponse, templatesResponse, profileResponse] = await Promise.all([
          fetch("/api/documents"),
          fetch("/api/templates"),
          fetch("/api/profile"),
        ]);
        if (!documentsResponse.ok || !templatesResponse.ok || !profileResponse.ok) {
          throw new Error("Workspace data could not be loaded.");
        }

        const documentsData = (await documentsResponse.json()) as DocumentSummary[];
        const templatesData = (await templatesResponse.json()) as { builtIn: BuiltInTemplate[]; owned: OwnedTemplate[] };
        const profileData = (await profileResponse.json()) as { data: Record<string, unknown> };
        setDocuments(documentsData);
        setBuiltInTemplates(templatesData.builtIn);
        setOwnedTemplates(templatesData.owned);
        setHasProfile(Object.values(profileData.data).some((value) => typeof value === "string" && value.trim()));
        setProfile(Object.fromEntries(PROFILE_FIELDS.map(({ key }) => [key, typeof profileData.data[key] === "string" ? profileData.data[key] : ""])) as Profile);
      } catch {
        setError("Workspace data could not be loaded. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadWorkspace();
  }, []);

  async function renameDocument(documentId: string) {
    if (!editingName.trim()) return;
    setBusyId(documentId);
    setError("");
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      if (!response.ok) throw new Error();
      const updated = (await response.json()) as DocumentSummary;
      setDocuments((current) => current.map((document) => document.id === updated.id ? { ...document, name: updated.name, updatedAt: updated.updatedAt } : document));
      setEditingId(null);
    } catch {
      setError("The document could not be renamed.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteDocument(document: DocumentSummary) {
    if (!window.confirm(`Delete "${document.name}"? This cannot be undone.`)) return;
    setBusyId(document.id);
    setError("");
    try {
      const response = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setDocuments((current) => current.filter((item) => item.id !== document.id));
    } catch {
      setError("The document could not be deleted.");
    } finally {
      setBusyId(null);
    }
  }

  async function duplicateDocument(document: DocumentSummary) {
    setBusyId(document.id);
    setError("");
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${document.name} (Copy)`,
          documentType: document.documentType,
          templateId: document.templateId,
          content: parseContent(document.content),
          selectedFontId: document.selectedFontId,
        }),
      });
      if (!response.ok) throw new Error();
      const duplicate = (await response.json()) as DocumentSummary;
      setDocuments((current) => [duplicate, ...current]);
    } catch {
      setError("The document could not be duplicated.");
    } finally {
      setBusyId(null);
    }
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, value.trim()]))),
      });
      setProfileMessage(response.ok ? "Profile saved. New documents will be pre-filled with it." : "Profile could not be saved.");
      if (response.ok) setHasProfile(Object.values(profile).some((value) => value.trim()));
    } catch {
      setProfileMessage("Profile could not be saved.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function exportWord(document: DocumentSummary) {
    setBusyId(document.id);
    setError("");
    try {
      await exportDocumentToDocx({
        document: parseContent(document.content) as DocumentData,
        documentType: document.documentType,
        templateId: document.templateId,
        fontId: document.selectedFontId,
      });
    } catch {
      setError("The Word document could not be exported.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteTemplate(template: OwnedTemplate) {
    if (!window.confirm(`Delete the template "${template.name}"? This cannot be undone.`)) return;
    setBusyId(template.id);
    setError("");
    try {
      const response = await fetch(`/api/templates/${template.id}`, { method: "DELETE" });
      if (response.status === 409) {
        setError("This template is used by saved documents and cannot be deleted.");
        return;
      }
      if (!response.ok) throw new Error();
      setOwnedTemplates((current) => current.filter((item) => item.id !== template.id));
    } catch {
      setError("The template could not be deleted.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-slate-50 px-5 py-10 dark:bg-[#0B0F19] sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Welcome back, {userName}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Pick up where you left off or start a new document.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">Log out</button>
            <Link href="/create" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">New document</Link>
          </div>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Workspace overview">
          <Summary label="Saved documents" value={loading ? "…" : documents.length.toString()} />
          <Summary label="Available templates" value={loading ? "…" : (builtInTemplates.length + ownedTemplates.length).toString()} />
          <Summary label="Profile" value={loading ? "…" : hasProfile ? "Ready" : "Not started"} />
        </section>

        <section className="mt-10" aria-labelledby="documents-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="documents-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">My documents</h2>
            <Link href="/create" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Create one</Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading your documents…</p>
          ) : documents.length === 0 ? (
            <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/60">
              <p className="font-semibold text-slate-900 dark:text-slate-100">No saved documents yet</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your saved work will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {documents.map((document) => (
                <article key={document.id} className="border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
                  <div className="flex items-start justify-between gap-4">
                    {editingId === document.id ? (
                      <form onSubmit={(event) => { event.preventDefault(); void renameDocument(document.id); }} className="flex min-w-0 flex-1 gap-2">
                        <label htmlFor={`document-name-${document.id}`} className="sr-only">Document name</label>
                        <input id={`document-name-${document.id}`} value={editingName} onChange={(event) => setEditingName(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditingId(null); }} autoFocus maxLength={200} className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                        <button type="submit" disabled={busyId === document.id} className="text-sm font-semibold text-blue-600 disabled:opacity-50">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-sm font-semibold text-slate-500">Cancel</button>
                      </form>
                    ) : (
                      <h3 className="min-w-0 break-words font-semibold text-slate-900 dark:text-slate-100"><Link href={`/builder?document=${document.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">{document.name}</Link></h3>
                    )}
                    <span className="shrink-0 text-xs font-medium uppercase text-slate-400">{typeLabel(document.documentType)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Updated {new Date(document.updatedAt).toLocaleDateString()}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <Link href={`/builder?document=${document.id}`} className="font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">Edit</Link>
                    <button type="button" onClick={() => { setEditingId(document.id); setEditingName(document.name); }} disabled={busyId === document.id || editingId === document.id} className="font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-100">Rename</button>
                    <button type="button" onClick={() => void duplicateDocument(document)} disabled={busyId === document.id} className="font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-100">Duplicate</button>
                    <button type="button" onClick={() => void exportWord(document)} disabled={busyId === document.id} className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">Word</button>
                    <Link href={`/builder?document=${document.id}&export=pdf`} className="font-semibold text-blue-600 hover:text-blue-700">PDF</Link>
                    <button type="button" onClick={() => void deleteDocument(document)} disabled={busyId === document.id} className="font-semibold text-red-600 hover:text-red-700 disabled:opacity-50">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-label="Profile and templates">
          <form onSubmit={saveProfile} className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Profile</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Used to pre-fill empty fields in new documents. It never overwrites what you type.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PROFILE_FIELDS.map((field) => (
                <label key={field.key} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {field.label}
                  <input type={field.type} autoComplete={field.autoComplete} value={profile[field.key]} onChange={(event) => setProfile({ ...profile, [field.key]: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-normal text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="submit" disabled={savingProfile} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{savingProfile ? "Saving…" : "Save profile"}</button>
              <span role="status" className="text-sm text-slate-500">{profileMessage}</span>
            </div>
          </form>
          <div className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Templates</h2><Link href="/template-builder" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Build template</Link></div>

            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">My visual templates</h3>
            {ownedTemplates.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You haven&apos;t designed a template yet. Use <Link href="/template-builder" className="font-semibold text-blue-600 dark:text-blue-400">Build template</Link> to create one.</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-200 border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
                {ownedTemplates.map((template) => (
                  <li key={template.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                    <Link href={template.kind === "visual" ? `/template-builder?template=${template.id}` : "/create"} className="min-w-0 truncate font-semibold text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400">{template.name}<span className="ml-2 text-xs font-normal capitalize text-slate-400">{typeLabel(template.documentType)}</span></Link>
                    <button type="button" onClick={() => void deleteTemplate(template)} disabled={busyId === template.id} className="shrink-0 font-semibold text-red-600 hover:text-red-700 disabled:opacity-50">Delete</button>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Built-in templates</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {builtInTemplates.map((template) => (
                <Link key={template.id} href={`/templates?type=${template.documentType}&template=${template.id}`} className="border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-800 hover:border-blue-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-700">
                  {template.name}
                  <span className="mt-0.5 block text-xs font-normal text-slate-400">{typeLabel(template.documentType)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
