import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/auth/prisma";
import { getTemplateDefinition } from "@/lib/templates/templates";

function isDocumentType(value: unknown): value is "resume" | "cv" {
  return value === "resume" || value === "cv";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const documents = await prisma.savedDocument.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      documentType: true,
      templateId: true,
      content: true,
      selectedFontId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { name, documentType, templateId, content, selectedFontId } = body as {
      name?: unknown;
      documentType?: unknown;
      templateId?: unknown;
      content?: unknown;
      selectedFontId?: unknown;
    };

    if (typeof name !== "string" || !name.trim() || typeof templateId !== "string" || !templateId.trim()) {
      return NextResponse.json({ error: "Name and templateId are required." }, { status: 400 });
    }
    if (!isDocumentType(documentType) || !content || typeof content !== "object") {
      return NextResponse.json({ error: "A valid documentType and content are required." }, { status: 400 });
    }

    const definition = getTemplateDefinition(templateId);
    const template = await prisma.template.upsert({
      where: { id: templateId },
      update: {},
      create: {
        id: templateId,
        name: definition.name,
        description: definition.description,
        documentType: definition.documentType,
        builtIn: true,
        schema: JSON.stringify(definition),
      },
    });

    if (template.documentType !== documentType) {
      return NextResponse.json({ error: "Template and document type do not match." }, { status: 400 });
    }

    const document = await prisma.savedDocument.create({
      data: {
        name: name.trim(),
        documentType,
        templateId: template.id,
        templateSnapshot: JSON.stringify(definition),
        content: JSON.stringify(content),
        selectedFontId: typeof selectedFontId === "string" ? selectedFontId : null,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
