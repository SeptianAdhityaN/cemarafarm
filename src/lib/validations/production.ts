import { z } from "zod";
import { BatchStatus } from "@prisma/client";

export const createBatchSchema = z.object({
  varietyId: z.string().min(1, "Jenis selada harus dipilih"),
  sowingDate: z.string().or(z.date()), 
  initialSeeds: z.number().min(1, "Jumlah benih minimal 1"),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;

export const updateBatchSchema = z.object({
  status: z.nativeEnum(BatchStatus).optional(),
  actualHarvestDate: z.string().datetime().optional().nullable(),
  currentStockKg: z.number().min(0).optional(),
});

export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;

export const updateBatchStatusSchema = z.object({
  status: z.enum(["GROWING", "READY_TO_HARVEST", "COMPLETED", "FAILED"]),
  currentStockKg: z.number().min(0).optional(),
  actualHarvestDate: z.string().datetime().optional(),
});

export type updateBatchStatusInput = z.infer<typeof updateBatchStatusSchema>;