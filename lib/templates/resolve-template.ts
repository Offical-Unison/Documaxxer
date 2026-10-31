import { prisma } from "@/lib/auth/prisma";
import { TEMPLATE_DEFINITIONS, type TemplateId } from "@/lib/templates/templates";
import type { TemplateDefinition } from "@/types/template";

type ResolvedTemplate =
  | { ok: true; id: string; documentType: string; snapshot: string }
  | { ok: false; status: 400 | 404; error: string };

/**
 * Finds the template a document is built from: a built-in template (its row is
 * created on first use, since SavedDocument.templateId is a foreign key) or a
 * template owned by `ownerId`. Unknown ids and other users' templates are rejected.
 */
export async function resolveTemplateForDocument(templateId: string, ownerId: string, documentType: string): Promise<ResolvedTemplate> {
  const builtIn: TemplateDefinition | undefined = TEMPLATE_DEFINITIONS[templateId as TemplateId];
  const existing = await prisma.template.findUnique({ where: { id: templateId } });

  if (existing && !existing.builtIn && existing.ownerId !== ownerId) {
    return { ok: false, status: 404, error: "Template not found." };
  }
  if (!existing && !builtIn) {
    return { ok: false, status: 404, error: "Template not found." };
  }

  const template = existing ?? await prisma.template.upsert({
    where: { id: templateId },
    update: {},
    create: {
      id: templateId,
      name: builtIn!.name,
      description: builtIn!.description,
      documentType: builtIn!.documentType,
      builtIn: true,
      schema: JSON.stringify(builtIn),
    },
  });

  if (template.documentType !== documentType) {
    return { ok: false, status: 400, error: "Template and document type do not match." };
  }
  return { ok: true, id: template.id, documentType: template.documentType, snapshot: builtIn ? JSON.stringify(builtIn) : template.schema };
}
