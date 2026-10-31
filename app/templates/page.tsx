"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { TemplatePicker } from "@/components/builder/template-picker";
import { useDocumentContext } from "@/context/document-context";
import { BuilderHeader } from "@/components/builder/builder-header";
import { getTemplate, RESUME_TEMPLATES, type TemplateId } from "@/lib/templates/templates";
import { initialDocumentState } from "@/context/document-reducer";
import { DOCUMENT_TYPE_LABELS } from "@/lib/documents/document-layout";
import { hasUserContent } from "@/lib/documents/statistics";
import { isDocumentType } from "@/types/document";

function TemplateSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const { state, dispatch, isHydrated } = useDocumentContext();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const typeParam = searchParams.get("type");
  const templateParam = searchParams.get("template");

  // Sync the document type (and a valid template for it) from the URL.
  useEffect(() => {
    if (!isHydrated) return;
    const requested = templateParam ? RESUME_TEMPLATES.find((template) => template.id === templateParam) : undefined;
    const type = requested?.type ?? (isDocumentType(typeParam) ? typeParam : null);
    if (!type) return;
    if (state.documentType !== type) dispatch({ type: "SET_DOCUMENT_TYPE", payload: type });
    if (requested) {
      if (state.selectedTemplateId !== requested.id) dispatch({ type: "SET_TEMPLATE", payload: requested.id });
    } else if (getTemplate(state.selectedTemplateId).type !== type || !RESUME_TEMPLATES.some((template) => template.id === state.selectedTemplateId)) {
      const firstOfType = RESUME_TEMPLATES.find((template) => template.type === type);
      if (firstOfType) dispatch({ type: "SET_TEMPLATE", payload: firstOfType.id });
    }
  }, [typeParam, templateParam, dispatch, state.documentType, state.selectedTemplateId, isHydrated]);

  const handleTemplateSelect = (id: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", payload: id });
  };

  const typeLabel = DOCUMENT_TYPE_LABELS[state.documentType];
  const selected = getTemplate(state.selectedTemplateId);

  async function createSelectedTemplate() {
    if (!state.selectedTemplateId || selected.type !== state.documentType) return;
    setCreateError("");

    // Signed-out users build locally (no sign-up wall); the draft lives in this browser.
    if (status !== "authenticated") {
      const hasDraft = hasUserContent(state.document, state.documentType);
      const keepDraft = hasDraft && !window.confirm(`Start a new ${typeLabel.toLowerCase()}? Choose Cancel to keep editing your current draft with this template.`);
      if (!keepDraft) dispatch({ type: "START_NEW_DOCUMENT", payload: { documentType: state.documentType, templateId: selected.id } });
      router.push("/builder");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Untitled ${typeLabel}`,
          documentType: state.documentType,
          templateId: selected.id,
          content: initialDocumentState.document,
          selectedFontId: state.selectedFontId,
        }),
      });
      if (!response.ok) {
        setCreateError("The document could not be created. Please try again.");
        return;
      }
      const saved = (await response.json()) as { id: string };
      dispatch({ type: "START_NEW_DOCUMENT", payload: { documentType: state.documentType, templateId: selected.id } });
      router.push(`/builder?document=${encodeURIComponent(saved.id)}`);
    } catch {
      setCreateError("The document could not be created. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Choose a template for your {typeLabel}
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          Select a starting design. You can always change this later in the builder.
        </p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <TemplatePicker selectedId={state.selectedTemplateId} onSelect={handleTemplateSelect} variant="grid" />
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <button
          type="button"
          onClick={() => void createSelectedTemplate()}
          disabled={creating || !isHydrated}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {creating ? "Creating..." : "Use this template"}<span className="ml-2" aria-hidden="true">→</span>
        </button>
        {status !== "authenticated" && status !== "loading" && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your draft is saved in this browser. <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Log in</Link> to keep documents in your account.
          </p>
        )}
      </div>
      {createError && <p role="alert" className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{createError}</p>}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-slate-50 dark:bg-[#0B0F19]">
      <BuilderHeader />
      <div className="flex-1">
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <TemplateSelectionContent />
        </Suspense>
      </div>
    </main>
  );
}
