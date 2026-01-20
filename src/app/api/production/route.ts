import { NextResponse } from "next/server";
import { ProductionService } from "@/services/production.service";
import { createBatchSchema } from "@/lib/validations/production";
import { ZodError, ZodIssue } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Silahkan login terlebih dahulu" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createBatchSchema.parse(body);
    const newBatch = await ProductionService.createBatch(validatedData);

    return NextResponse.json(newBatch, { status: 201 });
    
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false,
        error: "Validation Failed", 
        // Menggunakan .issues dan memberikan tipe data ZodIssue pada parameter 'e'
        details: error.issues.map((e: ZodIssue) => ({ 
          field: e.path.join('.'), 
          message: e.message 
        })) 
      }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    const batches = await ProductionService.getActiveBatches();
    return NextResponse.json(batches);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}