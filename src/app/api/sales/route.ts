import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SalesService } from "@/services/sales.service";
import { createSaleSchema } from "@/lib/validations/sales";
import { ZodError, ZodIssue } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Handler untuk Mengambil List Penjualan
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        },
      },
      select: {
        id: true,
        customerName: true,
        quantityKg: true,
        totalPrice: true,
        createdAt: true,
        batch: { select: { batchCode: true } },
        channel: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(sales);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Handler untuk Mencatat Penjualan Baru (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Silahkan login terlebih dahulu" }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedData = createSaleSchema.parse(body);
    const newSale = await SalesService.createSale(validatedData);

    return NextResponse.json(newSale, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: error.issues.map((e: ZodIssue) => ({ 
          field: e.path.join('.'), 
          message: e.message 
        })) 
      }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Gagal mencatat penjualan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}