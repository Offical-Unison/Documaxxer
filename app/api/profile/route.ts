import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/auth/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
    select: { data: true, updatedAt: true },
  });

  return NextResponse.json(profile ? { data: JSON.parse(profile.data), updatedAt: profile.updatedAt } : { data: {}, updatedAt: null });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Profile data must be an object." }, { status: 400 });
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: { data: JSON.stringify(body) },
    create: { userId: session.user.id, data: JSON.stringify(body) },
    select: { data: true, updatedAt: true },
  });

  return NextResponse.json({ data: JSON.parse(profile.data), updatedAt: profile.updatedAt });
}
