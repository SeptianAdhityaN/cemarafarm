"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function createSalesChannel(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;

  if (!name || name.length < 2) {
    return { error: "Nama kanal minimal 2 karakter" };
  }

  try {
    await prisma.salesChannel.create({
      data: { name },
    });
    revalidatePath("/settings/channels");
    return { success: true };
  } catch {
    return { error: "Kanal penjualan ini sudah ada" };
  }
}

export async function deleteSalesChannel(id: string) {
  try {
    await prisma.salesChannel.delete({
      where: { id },
    });
    revalidatePath("/settings/channels");
  } catch {
    throw new Error("Gagal menghapus kanal");
  }
}