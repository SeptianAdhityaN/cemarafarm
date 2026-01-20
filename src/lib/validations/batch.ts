// src/lib/validations/batch.ts
import { z } from "zod";

export const batchSchema = z.object({
  varietyId: z.string().min(1, "Variety is required"),
  sowingDate: z.coerce.date(),
  initialSeeds: z.number().min(1),
});