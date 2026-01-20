import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { CreateBatchInput } from "@/lib/validations/production";

export const ProductionService = {
  async createBatch(input: CreateBatchInput) {
    const sowingDate = new Date(input.sowingDate);
    const estimatedHarvestDate = addDays(sowingDate, 45);

    const year = sowingDate.getFullYear();
    const count = await prisma.productionBatch.count();
    const batchCode = `CF-${year}-${(count + 1).toString().padStart(3, "0")}`;

    return await prisma.productionBatch.create({
      data: {
        batchCode,
        varietyId: input.varietyId,
        sowingDate,
        estimatedHarvestDate,
        initialSeeds: input.initialSeeds,
        currentStockKg: 0, // Pastikan ini diinisialisasi agar tidak null
        status: "SEEDING",
      },
    });
  },

  async getActiveBatches() {
    return await prisma.productionBatch.findMany({
      where: {
        status: { not: "COMPLETED" },
        isArchived: false
      },
      include: { variety: true },
      orderBy: { sowingDate: "desc" }
    });
  },

  async updateToHarvest(id: string, actualWeightKg: number) {
    return await prisma.productionBatch.update({
      where: { id },
      data: {
        actualHarvestDate: new Date(),
        currentStockKg: actualWeightKg,
        status: "READY_TO_HARVEST",
      },
    });
  },
};