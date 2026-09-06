"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { exportDocumentToDocx } from "@/lib/export/docx-export";

type DocumentSummary = {
  id: string;
  name: string;
  documentType: string;
  templateId: string;
  content: string;
  selectedFontId: string | null;
  updatedAt: string;
};

type TemplateSummary = { id: string; name: string; description: string };

export function DashboardContent({ userName }: { userName: string }) {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", location: "" });
  const [profileMessage, setProfileMessage] = useState("");

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
        const templatesData = (await templatesResponse.json()) as { builtIn: TemplateSummary[]; owned: TemplateSummary[] };
        const profileData = (await profileResponse.json()) as { data: Record<string, unknown> };
        setDocuments(documentsData);
        setTemplates([...templatesData.owned, ...templatesData.builtIn]);
        setHasProfile(Object.keys(profileData.data).length > 0);
        setProfile({
          firstName: typeof profileData.data.firstName === "string" ? profileData.data.firstName : "",
          lastName: typeof profileData.data.lastName === "string" ? profileData.data.lastName : "",
          email: typeof profileData.data.email === "string" ? profileData.data.email : "",
          location: typeof profileData.data.location === "string" ? profileData.data.location : "",
        });
      } catch {
        setError("Workspace data could not be loaded. Please refresh and try again.");
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

  async function deleteDocument(documentId: string) {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    setBusyId(documentId);
    setError("");
    try {
      const response = await fetch(`/api/documents/${documentId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setDocuments((current) => current.filter((document) => document.id !== documentId));
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
          content: JSON.parse(document.content),
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
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setProfileMessage(response.ok ? "Profile saved." : "Profile could not be saved.");
    if (response.ok) setHasProfile(true);
  }

  async function exportWord(document: DocumentSummary) {
    setBusyId(document.id);
    try {
      await exportDocumentToDocx(JSON.parse(document.content), document.selectedFontId ?? undefined, document.documentType as "resume" | "cv");
    } catch {
      setError("The Word document could not be exported.");
    } finally {
      setBusyId(null);
    }
  }

  function openForPdf(document: DocumentSummary) {
    window.localStorage.setItem("documaxxer:document-state:v1", JSON.stringify({
      document: JSON.parse(document.content),
      selectedTemplateId: document.templateId,
      selectedFontId: document.selectedFontId,
      documentType: document.documentType,
      generateUnlocked: true,
    }));
    window.open("/builder", "_blank", "noopener,noreferrer");
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
          <Link href="/create" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">New document</Link>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Workspace overview">
          <Summary label="Saved documents" value={documents.length.toString()} />
          <Summary label="Available templates" value={templates.length.toString()} />
          <Summary label="Profile" value={hasProfile ? "Ready" : "Not started"} />
        </section>

        <section className="mt-10" aria-labelledby="documents-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="documents-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">My documents</h2>
            <Link href="/create" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Create one</Link>
          </div>
          {documents.length === 0 ? (
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
                        <input id={`document-name-${document.id}`} value={editingName} onChange={(event) => setEditingName(event.target.value)} autoFocus className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                        <button type="submit" disabled={busyId === document.id} className="text-sm font-semibold text-blue-600 disabled:opacity-50">Save</button>
                      </form>
                    ) : (
                      <h3 className="min-w-0 font-semibold text-slate-900 dark:text-slate-100"><Link href={`/builder?document=${document.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">{document.name}</Link></h3>
                    )}
                    <span className="text-xs font-medium uppercase text-slate-400">{document.documentType}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Updated {new Date(document.updatedAt).toLocaleDateString()}</p>
                  <div className="mt-4 flex gap-4 text-sm">
                    <button type="button" onClick={() => { setEditingId(document.id); setEditingName(document.name); }} disabled={busyId === document.id || editingId === document.id} className="font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-100">Rename</button>
                    <button type="button" onClick={() => void duplicateDocument(document)} disabled={busyId === document.id} className="font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-100">Duplicate</button>
                    <button type="button" onClick={() => void exportWord(document)} disabled={busyId === document.id} className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">Word</button>
                    <button type="button" onClick={() => openForPdf(document)} disabled={busyId === document.id} className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">PDF</button>
                    <button type="button" onClick={() => void deleteDocument(document.id)} disabled={busyId === document.id} className="font-semibold text-red-600 hover:text-red-700 disabled:opacity-50">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-label="Profile and templates">
          <form onSubmit={saveProfile} className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Profile</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(profile) as Array<keyof typeof profile>).map((field) => (
                <label key={field} className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                  {field}
                  <input value={profile[field]} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-normal text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3"><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save profile</button><span className="text-sm text-slate-500">{profileMessage}</span></div>
          </form>
          <div className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Templates</h2><Link href="/template-builder" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Build template</Link></div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose from the available built-in and saved templates.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {templates.map((template) => <Link key={template.id} href={`/templates?template=${template.id}`} className="border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-800 hover:border-blue-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-700">{template.name}</Link>)}
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
