// src/lib/logger.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function logActivity(action: string, details: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return;

  try {
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Gagal mencatat aktivitas:", error);
  }
}