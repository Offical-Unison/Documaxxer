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
  if (!ownerId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.savedDocument.findFirst({ where: { id, ownerId } });
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  return NextResponse.json(document);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const ownerId = await getOwnerId();
  if (!ownerId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, content, selectedFontId } = body as {
    name?: unknown;
    content?: unknown;
    selectedFontId?: unknown;
  };
  if (name === undefined && content === undefined && selectedFontId === undefined) {
    return NextResponse.json({ error: "At least one field is required." }, { status: 400 });
  }
  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return NextResponse.json({ error: "Name must be a non-empty string." }, { status: 400 });
  }
  if (content !== undefined && (!content || typeof content !== "object")) {
    return NextResponse.json({ error: "Content must be an object." }, { status: 400 });
  }

  const existing = await prisma.savedDocument.findFirst({ where: { id, ownerId }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const document = await prisma.savedDocument.update({
    where: { id: existing.id },
    data: {
      ...(name !== undefined ? { name: (name as string).trim() } : {}),
      ...(content !== undefined ? { content: JSON.stringify(content) } : {}),
      ...(selectedFontId !== undefined ? { selectedFontId: typeof selectedFontId === "string" ? selectedFontId : null } : {}),
    },
  });

  return NextResponse.json(document);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const ownerId = await getOwnerId();
  if (!ownerId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.savedDocument.findFirst({ where: { id, ownerId }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  await prisma.savedDocument.delete({ where: { id: existing.id } });
  return new NextResponse(null, { status: 204 });
}
