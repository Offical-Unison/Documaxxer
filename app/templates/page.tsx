"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TemplatePicker } from "@/components/builder/template-picker";
import { useDocumentContext } from "@/context/document-context";
import { BuilderHeader } from "@/components/builder/builder-header";
import { getTemplate, RESUME_TEMPLATES, type TemplateId } from "@/lib/templates/templates";
import { Button } from "@/components/ui/button";
import { initialDocumentState } from "@/context/document-reducer";
import type { DocumentType } from "@/types/document";

const documentTypes: DocumentType[] = ["resume", "cv", "cover-letter", "authorization-letter", "excuse-letter"];

function isDocumentType(value: string): value is DocumentType {
  return documentTypes.includes(value as DocumentType);
}

function TemplateSelectionContent() {
  const searchParams = useSearchParams();
  const { state, dispatch, isHydrated } = useDocumentContext();

  const typeParam = searchParams.get("type");
  
  useEffect(() => {
    if (!isHydrated) return;
    if (typeParam && isDocumentType(typeParam)) {
      dispatch({ type: "SET_DOCUMENT_TYPE", payload: typeParam });
      // If the current template doesn't match the new type, reset to the first one of that type
      const currentTemplate = getTemplate(state.selectedTemplateId);
      if (currentTemplate.type !== typeParam) {
        const firstOfType = RESUME_TEMPLATES.find((t) => t.type === typeParam);
        if (firstOfType) {
          dispatch({ type: "SET_TEMPLATE", payload: firstOfType.id });
        }
      }
    }
  }, [typeParam, dispatch, state.selectedTemplateId, isHydrated]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleTemplateSelect = (id: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", payload: id });
  };

  async function createSelectedTemplate() {
    if (!state.selectedTemplateId) return;
    setCreating(true);
    setCreateError("");
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Untitled ${state.documentType === "cv" ? "CV" : RESUME_TEMPLATES.find((template) => template.type === state.documentType)?.name ?? "Document"}`,
          documentType: state.documentType,
          templateId: state.selectedTemplateId,
          content: initialDocumentState.document,
          selectedFontId: state.selectedFontId,
        }),
      });
      if (!response.ok) {
        setCreateError(response.status === 401 ? "Log in to save a document." : "The document could not be created.");
        return;
      }
      const saved = (await response.json()) as { id: string };
      window.location.href = `/builder?document=${saved.id}`;
    } catch {
      setCreateError("The document could not be created.");
    } finally {
      setCreating(false);
    }
  }

  const title = state.documentType === "cv" ? "Curriculum Vitae" : RESUME_TEMPLATES.find((template) => template.type === state.documentType)?.name ?? "Document";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Choose a template for your {title}
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          Select a starting design. You can always change this later in the builder.
        </p>
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <TemplatePicker selectedId={state.selectedTemplateId} onSelect={handleTemplateSelect} variant="grid" />
      </div>

      <div className="mt-12 flex justify-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <Button asChild className="group px-8 py-3.5 text-base">
          <button type="button" onClick={() => void createSelectedTemplate()} disabled={creating} className="inline-flex items-center justify-center px-8 py-3.5 text-base">{creating ? "Creating..." : "Use this template"}<span className="ml-2" aria-hidden="true">→</span></button>
        </Button>
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
