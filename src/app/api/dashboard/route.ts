import { NextResponse } from "next/server";
import { DashboardService } from "@/services/dashboard.service";

export async function GET() {
  try {
    const summary = await DashboardService.getSummary();
    
    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat ringkasan dashboard";
    
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}