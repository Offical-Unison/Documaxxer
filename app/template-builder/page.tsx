import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { BuilderHeader } from "@/components/builder/builder-header";
import { TemplateBuilder } from "@/components/templates/template-builder";

export default async function TemplateBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <BuilderHeader />
      <TemplateBuilder />
    </>
  );
}
