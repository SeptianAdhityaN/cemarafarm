"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Mendefinisikan struktur state agar type-safe
export interface VarietyState {
  success?: boolean;
  error?: string | null;
}

export async function createVariety(
  prevState: VarietyState | null, 
  formData: FormData
): Promise<VarietyState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const category = formData.get("category") as string;

  // Validasi Input
  if (!name || !price) {
    return { error: "Nama dan Harga wajib diisi" };
  }

  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) {
    return { error: "Harga harus berupa angka valid" };
  }

  try {
    await prisma.variety.create({
      data: {
        name,
        description: description || null,
        price: numericPrice,
        imageUrl: imageUrl || null,
        category: category || "Sayuran",
      },
    });

    revalidatePath("/dashboard/production");
    return { success: true, error: null };
  } catch (error: unknown) {
    // Pengecekan error Prisma secara aman tanpa 'any'
    if (
      typeof error === "object" && 
      error !== null && 
      "code" in error && 
      (error as { code: string }).code === "P2002"
    ) {
      return { error: "Jenis sayur dengan nama ini sudah ada" };
    }

    return { error: "Terjadi kesalahan saat menyimpan data" };
  }
}

export async function deleteVariety(id: string) {
  await prisma.variety.update({
    where: { id },
    data: { isArchived: true },
  });
  revalidatePath("/settings/varieties");
}