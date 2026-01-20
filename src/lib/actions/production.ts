"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BatchStatus } from "@prisma/client";

export async function createBatch(formData: FormData) {
  const varietyId = formData.get("varietyId") as string;
  const sowingDate = new Date(formData.get("sowingDate") as string);
  const initialSeeds = parseInt(formData.get("initialSeeds") as string);

  // Logika generate Batch Code otomatis: CF-2026-001
  const count = await prisma.productionBatch.count();
  const batchCode = `CF-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

  // Estimasi panen otomatis (misal 30 hari setelah semai)
  const estimatedHarvestDate = new Date(sowingDate);
  estimatedHarvestDate.setDate(sowingDate.getDate() + 30);

  await prisma.productionBatch.create({
    data: {
      batchCode,
      varietyId,
      sowingDate,
      estimatedHarvestDate,
      initialSeeds,
      status: "SEEDING",
      currentStockKg: 0,
    },
  });

  revalidatePath("/production"); // Refresh data di halaman produksi secara instan
}

export async function updateBatchStatus(id: string, newStatus: BatchStatus) {
  try {
    await prisma.productionBatch.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/production");
    return { success: true };
  } catch {
    return { error: "Gagal memperbarui status" };
  }
}

export async function harvestBatch(formData: FormData) {
  const id = formData.get("id") as string;
  const actualHarvestDate = new Date(formData.get("harvestDate") as string);
  const weight = parseFloat(formData.get("weight") as string);

  try {
    await prisma.productionBatch.update({
      where: { id },
      data: {
        status: "READY_TO_HARVEST",
        actualHarvestDate: actualHarvestDate,
        currentStockKg: weight, // Inilah stok yang tersedia untuk dijual
      },
    });
    revalidatePath("/production");
    return { success: true };
  } catch {
    return { error: "Gagal mencatat hasil panen" };
  }
}