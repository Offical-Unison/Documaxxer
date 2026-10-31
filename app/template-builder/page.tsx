import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BuilderHeader } from "@/components/builder/builder-header";
import { TemplateBuilder } from "@/components/templates/template-builder";

export default async function TemplateBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <BuilderHeader />
      <Suspense fallback={<main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Loading editor…</main>}>
        <TemplateBuilder />
      </Suspense>
    </>
  );
}
