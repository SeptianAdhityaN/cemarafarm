import { prisma } from "@/lib/prisma";
import { AddSaleForm } from "@/components/sales/add-sale-form";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { SearchBar } from "@/components/ui/search-bar";
import { History } from "lucide-react";
import Link from "next/link";
import { ExportButton } from "@/components/ui/export-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const [rawSales, batches, channels] = await Promise.all([
    prisma.sale.findMany({
      where: {
        OR: [
          { customerName: { contains: query, mode: "insensitive" } },
          {
            batch: {
              variety: { name: { contains: query, mode: "insensitive" } },
            },
          },
          { batch: { batchCode: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { batch: { include: { variety: true } }, channel: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productionBatch.findMany({
      where: {
        status: "READY_TO_HARVEST",
        currentStockKg: { gt: 0 },
      },
      include: { variety: true },
      orderBy: { batchCode: "asc" },
    }),
    prisma.salesChannel.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const sales = rawSales.map((sale) => ({
    ...sale,
    unitPrice: Number(sale.unitPrice),
    totalPrice: Number(sale.totalPrice),
    quantityKg: Number(sale.quantityKg),
  }));

  const formattedBatches = batches.map((batch) => ({
    ...batch,
    currentStockKg: Number(batch.currentStockKg),
    variety: {
      ...batch.variety,
      price: Number(batch.variety.price),
    },
  }));

  const salesDataset = sales.map((sale) => ({
    Waktu: format(sale.createdAt, "dd/MM/yyyy HH:mm"),
    Produk: sale.batch.variety.name,
    Kode_Batch: sale.batch.batchCode,
    Pembeli: sale.customerName,
    Kanal: sale.channel.name,
    "Jumlah (KG)": sale.quantityKg,
    "Harga Satuan": sale.unitPrice,
    "Total Pendapatan": sale.totalPrice,
  }));

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Riwayat Penjualan
          </h1>
          <p className="text-muted-foreground text-sm font-sans">
            {query
              ? `Ditemukan ${sales.length} hasil untuk "${query}"`
              : `Total ${sales.length} transaksi`}
          </p>
        </div>

        {/* REFACTORED ACTION GROUP: Organized for Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Sub-group 1: Utilities (Logs & Export) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/logs"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-xl bg-card hover:bg-muted transition-all shadow-sm flex-1 sm:flex-none font-sans text-muted-foreground"
            >
              <History size={16} />
              <span>Logs</span>
            </Link>

            <div className="flex-1 sm:flex-none">
              <ExportButton
                data={salesDataset}
                fileName="Laporan_Penjualan_CemaraFarm"
              />
            </div>
          </div>

          {/* Desktop Divider */}
          <div className="hidden xl:block h-8 w-px bg-border mx-1" />

          {/* Sub-group 2: Primary Actions (Search & Add) */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <div className="flex-1 min-w-37.5 md:w-64">
              <SearchBar placeholder="Cari..." />
            </div>
            <div className="shrink-0">
              <AddSaleForm batches={formattedBatches} channels={channels} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card rounded-2xl border border-border shadow-sm w-full overflow-hidden">
        <Table>
          {/* Desktop Header */}
          <TableHeader className="hidden md:table-header-group bg-muted/50">
            <TableRow>
              <TableHead className="w-45 font-bold">Waktu</TableHead>
              <TableHead className="font-bold">Produk / Batch</TableHead>
              <TableHead className="font-bold">Kanal / Pembeli</TableHead>
              <TableHead className="font-bold">Jumlah</TableHead>
              <TableHead className="text-right font-bold">
                Total Harga
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {sales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-10 text-center text-muted-foreground italic font-sans"
                >
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="block md:table-row hover:bg-muted/30 transition-colors"
                >
                  {/* --- MOBILE ONLY: MERGED CELL --- */}
                  <TableCell className="block md:hidden p-4">
                    <div className="flex justify-between gap-4">
                      {/* Left Info Column */}
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          {format(sale.createdAt, "dd MMM yyyy • HH:mm", {
                            locale: localeId,
                          })}
                        </div>
                        <div className="font-bold text-foreground">
                          {sale.batch.variety.name}
                        </div>
                        <div className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded inline-block">
                          {sale.batch.batchCode}
                        </div>
                        <div className="text-sm mt-1">{sale.customerName}</div>
                        <div className="mt-1">
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
                            {sale.channel.name}
                          </span>
                        </div>
                      </div>

                      {/* Right Info Column (Price Aligned Right) */}
                      <div className="text-right shrink-0 flex flex-col justify-between">
                        <div className="text-sm font-semibold text-foreground italic">
                          {sale.quantityKg} kg
                        </div>
                        <div className="font-bold text-primary text-lg">
                          Rp {sale.totalPrice.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* --- DESKTOP ONLY: INDIVIDUAL CELLS --- */}
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm font-sans">
                    {format(sale.createdAt, "dd MMM yyyy, HH:mm", {
                      locale: localeId,
                    })}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="font-bold text-foreground">
                      {sale.batch.variety.name}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-tight">
                      {sale.batch.batchCode}
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="font-medium text-foreground">
                      {sale.customerName}
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {sale.channel.name}
                    </span>
                  </TableCell>

                  <TableCell className="hidden md:table-cell font-medium">
                    {sale.quantityKg} kg
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-right font-bold text-primary">
                    Rp {sale.totalPrice.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
