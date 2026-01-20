import { prisma } from "@/lib/prisma";
import { CreateSaleInput } from "@/lib/validations/sales";
import { Prisma } from "@prisma/client"; // Tambahkan import ini

export const SalesService = {
  async createSale(input: CreateSaleInput) {
    const totalPrice = input.quantityKg * input.unitPrice;

    // Definisikan 'tx' sebagai TransactionClient milik Prisma
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Cek stok
      const batch = await tx.productionBatch.findUnique({
        where: { id: input.batchId },
      });

      if (!batch || batch.currentStockKg < input.quantityKg) {
        throw new Error("Stok tidak mencukupi atau Batch tidak ditemukan");
      }

      // 2. Buat record penjualan
      const sale = await tx.sale.create({
        data: {
          batchId: input.batchId,
          channelId: input.channelId,
          customerName: input.customerName,
          quantityKg: input.quantityKg,
          unitPrice: input.unitPrice,
          totalPrice: totalPrice,
          paymentStatus: "PAID",
        },
      });

      // 3. Kurangi stok secara otomatis (Atomic Update)
      await tx.productionBatch.update({
        where: { id: input.batchId },
        data: {
          currentStockKg: {
            decrement: input.quantityKg,
          },
        },
      });

      return sale;
    });
  },

  async getSalesReport(startDate?: Date, endDate?: Date) {
    return await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        batch: { include: { variety: true } },
        channel: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
};