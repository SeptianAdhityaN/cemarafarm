import { z } from "zod";

export const createSaleSchema = z.object({
  batchId: z.string().min(1, "Batch asal harus dipilih"),
  channelId: z.string().min(1, "Saluran penjualan harus dipilih"),
  customerName: z.string().min(1, "Nama pelanggan harus diisi"),
  quantityKg: z.number().positive("Jumlah harus lebih dari 0"),
  unitPrice: z.number().positive("Harga per kg harus diisi"),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export const salesReportQuerySchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export type SalesReportQuery = z.infer<typeof salesReportQuerySchema>;