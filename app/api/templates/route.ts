import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/auth/prisma";
import { RESUME_TEMPLATES, TEMPLATE_DEFINITIONS } from "@/lib/templates/templates";

const MAX_SCHEMA_BYTES = 8_000_000; // images are stored inline as data URLs

/** Visual templates may describe any kind of document (invoice, report, …), not only the built-in types. */
function isTemplateDocumentType(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]{0,59}$/.test(value);
}

function templateKind(schema: unknown): "visual" | "form" {
  return schema && typeof schema === "object" && Array.isArray((schema as { pages?: unknown }).pages) ? "visual" : "form";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const builtInTemplates = RESUME_TEMPLATES.map((template) => TEMPLATE_DEFINITIONS[template.id]);
  const userTemplates = await prisma.template.findMany({
    where: { ownerId: session.user.id, builtIn: false },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    builtIn: builtInTemplates,
    owned: userTemplates.map((template) => {
      const schema = JSON.parse(template.schema) as unknown;
      return { ...template, schema, kind: templateKind(schema) };
    }),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, description, documentType, schema } = body as {
    name?: unknown;
    description?: unknown;
    documentType?: unknown;
    schema?: unknown;
  };
  if (typeof name !== "string" || !name.trim() || !isTemplateDocumentType(documentType) || !schema || typeof schema !== "object" || Array.isArray(schema)) {
    return NextResponse.json({ error: "Name, a valid documentType (lowercase letters, numbers, dashes), and schema are required." }, { status: 400 });
  }
  const serialized = JSON.stringify({ ...schema, id: undefined });
  if (serialized.length > MAX_SCHEMA_BYTES) {
    return NextResponse.json({ error: "Template is too large. Use smaller images." }, { status: 413 });
  }

  const id = randomUUID();
  const template = await prisma.template.create({
    data: {
      id,
      name: name.trim().slice(0, 120),
      description: typeof description === "string" ? description.trim().slice(0, 500) : "",
      documentType,
      builtIn: false,
      schema: JSON.stringify({ ...schema, id }),
      ownerId: session.user.id,
    },
  });

  return NextResponse.json({ ...template, schema: JSON.parse(template.schema), kind: templateKind(schema) }, { status: 201 });
}
