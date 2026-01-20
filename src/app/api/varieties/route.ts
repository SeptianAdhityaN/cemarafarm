import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const varieties = await prisma.variety.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    });
    return NextResponse.json(varieties);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Silahkan login terlebih dahulu" }, { status: 401 });
    }

    const body: { name: string } = await req.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const newVariety = await prisma.variety.create({ 
      data: { name: body.name },
      select: { id: true, name: true }
    });
    return NextResponse.json(newVariety, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menambah varietas";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}