import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const channels = await prisma.salesChannel.findMany({
      select: { 
        id: true, 
        name: true 
      },
      orderBy: { 
        name: "asc" 
      }
    });

    return NextResponse.json(channels);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500 }
    );
  }
}