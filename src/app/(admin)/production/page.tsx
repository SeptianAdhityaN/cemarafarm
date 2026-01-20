import { prisma } from "@/lib/prisma";
import { ProductionTable } from "@/components/production/production-table";
import { AddBatchForm } from "@/components/production/add-batch-form";
import { SearchBar } from "@/components/ui/search-bar";
import { ExportButton } from "@/components/ui/export-button";
import { format } from "date-fns";

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const [rawBatches, rawVarieties] = await Promise.all([
    prisma.productionBatch.findMany({
      where: {
        OR: [
          { batchCode: { contains: query, mode: "insensitive" } },
          { variety: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { variety: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.variety.findMany({
      where: { isArchived: false },
      orderBy: { name: "asc" },
    }),
  ]);

const batches = rawBatches.map((b) => ({
    ...b,
    currentStockKg: Number(b.currentStockKg),
    variety: {
      ...b.variety,
      price: Number(b.variety.price),
    },
  }));

  const varieties = rawVarieties.map((v) => ({
    ...v,
    price: Number(v.price),
  }));

  const exportData = batches.map((b) => ({
    Kode_Batch: b.batchCode,
    Sayur: b.variety.name,
    Tanggal_Semai: format(b.createdAt, "dd/MM/yyyy"),
    Jumlah_Lubang_Tanam: b.initialSeeds,
    Stok_Saat_Ini_KG: b.currentStockKg,
    Status: b.status,
    Estimasi_Panen: b.estimatedHarvestDate
      ? format(b.estimatedHarvestDate, "dd/MM/yyyy")
      : "-",
  }));

  return (
    <div className="p-6 space-y-6 max-w-full">
      <div className="flex flex-wrap flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Produksi
          </h1>
          <p className="text-muted-foreground text-sm font-sans">
            Kelola siklus tanam CemaraFarm
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <SearchBar placeholder="Cari batch atau sayur..." />
          </div>
          <ExportButton
            data={exportData}
            fileName="Laporan_Produksi_CemaraFarm"
          />
          <AddBatchForm varieties={varieties} />
        </div>
      </div>

      <ProductionTable data={batches} />
    </div>
  );
}
