"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TemplatePicker } from "@/components/builder/template-picker";
import { useResumeContext } from "@/context/resume-context";
import { BuilderHeader } from "@/components/builder/builder-header";
import { getTemplate, RESUME_TEMPLATES, type TemplateId } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function TemplateSelectionContent() {
  const searchParams = useSearchParams();
  const { state, dispatch } = useResumeContext();

  const typeParam = searchParams.get("type");
  
  useEffect(() => {
    if (typeParam === "resume" || typeParam === "cv") {
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
  }, [typeParam, dispatch, state.selectedTemplateId]);

  const handleTemplateSelect = (id: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", payload: id });
  };

  const title = state.documentType === "cv" ? "Curriculum Vitae" : "Resume";

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
          <Link href="/builder">
            Start building <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </Button>
      </div>
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
