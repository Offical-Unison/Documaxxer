import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/auth/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function getOwnerId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const ownerId = await getOwnerId();
  if (!ownerId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  const template = await prisma.template.findFirst({ where: { id, ownerId, builtIn: false } });
  if (!template) return NextResponse.json({ error: "Template not found." }, { status: 404 });

  return NextResponse.json({ ...template, schema: JSON.parse(template.schema) });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const ownerId = await getOwnerId();
  if (!ownerId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, description, schema } = body as { name?: unknown; description?: unknown; schema?: unknown };
  if (name === undefined && description === undefined && schema === undefined) {
    return NextResponse.json({ error: "At least one field is required." }, { status: 400 });
  }
  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return NextResponse.json({ error: "Name must be a non-empty string." }, { status: 400 });
  }
  if (schema !== undefined && (!schema || typeof schema !== "object" || Array.isArray(schema))) {
    return NextResponse.json({ error: "Schema must be an object." }, { status: 400 });
  }

  const existing = await prisma.template.findFirst({ where: { id, ownerId, builtIn: false }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Template not found." }, { status: 404 });

  const template = await prisma.template.update({
    where: { id: existing.id },
    data: {
      ...(name !== undefined ? { name: (name as string).trim() } : {}),
      ...(description !== undefined ? { description: typeof description === "string" ? description.trim() : "" } : {}),
      ...(schema !== undefined ? { schema: JSON.stringify(schema) } : {}),
    },
  });

  return NextResponse.json({ ...template, schema: JSON.parse(template.schema) });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const ownerId = await getOwnerId();
  if (!ownerId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.template.findFirst({ where: { id, ownerId, builtIn: false }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Template not found." }, { status: 404 });

  const documentCount = await prisma.savedDocument.count({ where: { templateId: existing.id } });
  if (documentCount > 0) {
    return NextResponse.json({ error: "Template is used by saved documents and cannot be deleted." }, { status: 409 });
  }

  await prisma.template.delete({ where: { id: existing.id } });
  return new NextResponse(null, { status: 204 });
}
