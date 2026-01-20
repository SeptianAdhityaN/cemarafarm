import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBatchSchema } from "@/lib/validations/production";
import { ZodError, ZodIssue } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Definisikan params sebagai Promise
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    // WAJIB: Unwrapping params dengan await (Next.js 15+)
    const { id } = await params;

    if (!id || id.startsWith("{{")) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const batch = await prisma.productionBatch.findUnique({
      where: { id, isArchived: false },
      include: { variety: { select: { name: true } } }
    });

    if (!batch) return NextResponse.json({ error: "Batch tidak ditemukan" }, { status: 404 });
    return NextResponse.json(batch);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Silahkan login terlebih dahulu" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateBatchSchema.parse(body);

    const updated = await prisma.productionBatch.update({
      where: { id, isArchived: false },
      data: {
        status: validatedData.status,
        actualHarvestDate: validatedData.actualHarvestDate ? new Date(validatedData.actualHarvestDate) : undefined,
        currentStockKg: validatedData.currentStockKg,
      },
      select: { id: true, batchCode: true, status: true, currentStockKg: true }
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: error.issues.map((e: ZodIssue) => ({ field: e.path.join('.'), message: e.message })) 
      }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Silahkan login terlebih dahulu" }, { status: 401 });
    }
    
    const { id } = await params;
    await prisma.productionBatch.update({
      where: { id },
      data: { isArchived: true }
    });

    return NextResponse.json({ success: true, message: "Batch archived" });
  } catch {
    return NextResponse.json({ error: "Gagal mengarsipkan" }, { status: 400 });
  }
}