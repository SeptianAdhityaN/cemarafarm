import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salesReportQuerySchema } from "@/lib/validations/sales";
import { ZodError } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = salesReportQuerySchema.parse({
      month: searchParams.get("month") || undefined,
      year: searchParams.get("year") || undefined,
    });

    const now = new Date();
    const filterYear = query.year ? parseInt(query.year) : now.getFullYear();
    const filterMonth = query.month ? parseInt(query.month) : undefined;

    const startDate = new Date(filterYear, filterMonth ? filterMonth - 1 : 0, 1);
    const endDate = filterMonth 
      ? new Date(filterYear, filterMonth, 0, 23, 59, 59)
      : new Date(filterYear, 11, 31, 23, 59, 59);

    const reportData = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        customerName: true,
        quantityKg: true,
        unitPrice: true,
        totalPrice: true,
        createdAt: true,
        channel: { select: { name: true } },
        batch: { 
          select: { 
            batchCode: true,
            variety: { select: { name: true } }
          } 
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reportData);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}