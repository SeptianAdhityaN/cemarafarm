"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import { logActivity } from "../logger";

export async function updateUserRole(targetUserId: string, newRole: Role) {
  const session = await getServerSession(authOptions);

  // Proteksi: Hanya ADMIN yang bisa ubah role
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Akses ditolak. Hanya Admin yang bisa mengubah role.");
  }

  // Proteksi: Admin tidak bisa mengubah rolenya sendiri (agar tidak terkunci luar)
  if (session.user.id === targetUserId) {
    throw new Error("Anda tidak bisa mengubah role Anda sendiri.");
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });
    await logActivity("USER_ROLE", `Mengubah role user ${targetUserId} menjadi ${newRole}`);
    revalidatePath("/settings/users");
    return { success: true };
  } catch {
    return { error: "Gagal memperbarui role user." };
  }
}