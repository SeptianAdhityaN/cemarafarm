"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "../logger";

export type SalesActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function createSale(prevState: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const batchId = formData.get("batchId") as string;
  const channelId = formData.get("channelId") as string;
  const customerName = formData.get("customerName") as string;
  const quantityKg = parseFloat(formData.get("quantityKg") as string);
  const unitPrice = parseFloat(formData.get("unitPrice") as string);

  if (!batchId || !channelId || quantityKg <= 0 || unitPrice <= 0) {
    return { error: "Data penjualan tidak valid" };
  }

  const totalPrice = quantityKg * unitPrice;

  try {
    // Menggunakan Transaction agar atomik (jika satu gagal, semua batal)
    await prisma.$transaction(async (tx) => {
      // 1. Cek ketersediaan stok
      const batch = await tx.productionBatch.findUnique({
        where: { id: batchId },
      });

      if (!batch || batch.currentStockKg < quantityKg) {
        throw new Error(`Stok tidak cukup. Tersedia: ${batch?.currentStockKg || 0}kg`);
      }

      // 2. Kurangi stok di batch tersebut
      await tx.productionBatch.update({
        where: { id: batchId },
        data: {
          currentStockKg: { decrement: quantityKg },
          // Jika stok jadi 0, kita bisa set status ke COMPLETED (opsional)
          status: batch.currentStockKg - quantityKg <= 0 ? "COMPLETED" : "READY_TO_HARVEST"
        }
      });

      // 3. Buat record penjualan
      await tx.sale.create({
        data: {
          batchId,
          channelId,
          customerName,
          quantityKg,
          unitPrice,
          totalPrice,
          paymentStatus: "PAID",
        }
      });

      await logActivity("PENJUALAN", `Mencatat penjualan ${quantityKg}kg senilai Rp ${totalPrice.toLocaleString('id-ID')}`);
    });

    revalidatePath("/sales");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal mencatat penjualan" };
  }
}