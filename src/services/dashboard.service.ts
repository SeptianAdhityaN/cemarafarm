import { prisma } from "@/lib/prisma";

export const DashboardService = {
  async getSummary() {
    // Menjalankan query secara paralel untuk efisiensi waktu respon
    const [salesStats, activeBatches, lowStockAlert] = await Promise.all([
      // 1. Agregasi Penjualan (Total Omzet & Jumlah Transaksi)
      prisma.sale.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
      }),
      // 2. Hitung Batch yang sedang dalam proses produksi
      prisma.productionBatch.count({
        where: {
          status: { in: ["SEEDING", "GROWING", "READY_TO_HARVEST"] },
        },
      }),
      // 3. Ambil data batch yang stoknya kritis (di bawah 2kg) untuk peringatan
      prisma.productionBatch.findMany({
        where: {
          status: "READY_TO_HARVEST",
          currentStockKg: { lt: 2, gt: 0 },
        },
        select: {
          batchCode: true,
          currentStockKg: true,
          variety: { select: { name: true } },
        },
      }),
    ]);

    return {
      // Konversi Decimal ke Number agar aman untuk JSON
      totalRevenue: Number(salesStats._sum.totalPrice) || 0,
      totalSalesCount: salesStats._count.id,
      activeProductionCount: activeBatches,
      lowStockBatches: lowStockAlert,
    };
  },
};