import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/auth/prisma";
import { RESUME_TEMPLATES, TEMPLATE_DEFINITIONS } from "@/lib/templates/templates";

function isDocumentType(value: unknown): value is "resume" | "cv" | "cover-letter" | "authorization-letter" | "excuse-letter" {
  return value === "resume" || value === "cv" || value === "cover-letter" || value === "authorization-letter" || value === "excuse-letter";
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
    owned: userTemplates.map((template) => ({
      ...template,
      schema: JSON.parse(template.schema),
    })),
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
  if (typeof name !== "string" || !name.trim() || !isDocumentType(documentType) || !schema || typeof schema !== "object" || Array.isArray(schema)) {
    return NextResponse.json({ error: "Name, documentType, and schema are required." }, { status: 400 });
  }

  const id = randomUUID();
  const template = await prisma.template.create({
    data: {
      id,
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      documentType,
      builtIn: false,
      schema: JSON.stringify(schema),
      ownerId: session.user.id,
    },
  });

  return NextResponse.json({ ...template, schema }, { status: 201 });
}
