import { prisma } from "@/lib/prisma";
import { AddSaleForm } from "@/components/sales/add-sale-form";
import { format, startOfDay } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { SearchBar } from "@/components/ui/search-bar";
import { History, ShoppingBag, Scale, Wallet } from "lucide-react"; // Tambah icon baru
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
  const today = startOfDay(new Date());

  // --- Data Fetching Paralel ---
  const [rawSales, batches, channels, todayStats] = await Promise.all([
    prisma.sale.findMany({
      where: {
        OR: [
          { customerName: { contains: query, mode: "insensitive" } },
          { batch: { variety: { name: { contains: query, mode: "insensitive" } } } },
          { batch: { batchCode: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { batch: { include: { variety: true } }, channel: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productionBatch.findMany({
      where: { status: "READY_TO_HARVEST", currentStockKg: { gt: 0 } },
      include: { variety: true },
      orderBy: { batchCode: "asc" },
    }),
    prisma.salesChannel.findMany({ orderBy: { name: "asc" } }),
    // Tambahan: Ringkasan penjualan hari ini
    prisma.sale.aggregate({
      _sum: { totalPrice: true, quantityKg: true },
      _count: { id: true },
      where: { createdAt: { gte: today } }
    })
  ]);

  // Transformasi Data
  const sales = rawSales.map((sale) => ({
    ...sale,
    unitPrice: Number(sale.unitPrice),
    totalPrice: Number(sale.totalPrice),
    quantityKg: Number(sale.quantityKg),
  }));

  const formattedBatches = batches.map((batch) => ({
    ...batch,
    currentStockKg: Number(batch.currentStockKg),
    variety: { ...batch.variety, price: Number(batch.variety.price) },
  }));

  // Dataset untuk Excel Export
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
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Riwayat Penjualan
          </h1>
          <p className="text-muted-foreground text-sm font-sans">
            {query
              ? `Ditemukan ${sales.length} hasil untuk "${query}"`
              : `Total ${sales.length} transaksi tercatat`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/logs"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-xl bg-card hover:bg-muted transition-all shadow-sm flex-1 sm:flex-none font-sans text-muted-foreground"
            >
              <History size={16} />
              <span>Logs</span>
            </Link>
            <div className="flex-1 sm:flex-none">
              <ExportButton data={salesDataset} fileName="Laporan_Penjualan_CemaraFarm" />
            </div>
          </div>
          <div className="hidden xl:block h-8 w-px bg-border mx-1" />
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <div className="flex-1 min-w-[150px] md:w-64">
              <SearchBar placeholder="Cari pembeli atau batch..." />
            </div>
            <div className="shrink-0">
              <AddSaleForm batches={formattedBatches} channels={channels} />
            </div>
          </div>
        </div>
      </div>

      {/* MINI STATS SECTION - New Addition */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Omzet Hari Ini</p>
            <p className="text-lg font-bold text-emerald-900">Rp {Number(todayStats._sum.totalPrice || 0).toLocaleString("id-ID")}</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Volume Terjual</p>
            <p className="text-lg font-bold text-blue-900">{Number(todayStats._sum.quantityKg || 0).toFixed(2)} kg</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Total Transaksi</p>
            <p className="text-lg font-bold text-orange-900">{todayStats._count.id} Pesanan</p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card rounded-[2rem] border border-border shadow-sm w-full overflow-hidden">
        <Table>
          <TableHeader className="hidden md:table-header-group bg-muted/30">
            <TableRow>
              <TableHead className="w-48 font-bold text-foreground">Waktu</TableHead>
              <TableHead className="font-bold text-foreground">Produk / Batch</TableHead>
              <TableHead className="font-bold text-foreground">Kanal / Pembeli</TableHead>
              <TableHead className="font-bold text-foreground">Jumlah</TableHead>
              <TableHead className="text-right font-bold text-foreground">Total Harga</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-20 text-center text-muted-foreground italic font-sans">
                  Tidak ada data transaksi yang sesuai.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id} className="block md:table-row hover:bg-muted/30 transition-colors group">
                  {/* MOBILE VIEW */}
                  <TableCell className="block md:hidden p-4">
                    <div className="flex justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
                          {format(sale.createdAt, "dd MMM yyyy • HH:mm", { locale: localeId })}
                        </div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {sale.batch.variety.name}
                        </div>
                        <div className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded inline-block text-muted-foreground">
                          {sale.batch.batchCode}
                        </div>
                        <div className="text-sm font-medium pt-1 text-slate-600">{sale.customerName}</div>
                        <div className="pt-1">
                          <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                            {sale.channel.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col justify-between py-1">
                        <div className="text-sm font-bold text-slate-800">{sale.quantityKg} kg</div>
                        <div className="font-black text-emerald-700 text-lg">
                          Rp {sale.totalPrice.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* DESKTOP VIEW */}
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-medium">
                    {format(sale.createdAt, "dd MMM yyyy", { locale: localeId })}
                    <br />
                    <span className="text-[10px] text-slate-400 font-normal">{format(sale.createdAt, "HH:mm")}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-bold text-slate-800">{sale.batch.variety.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{sale.batch.batchCode}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-semibold text-slate-700">{sale.customerName}</div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                      {sale.channel.name}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-bold text-slate-700">
                    {sale.quantityKg} <span className="text-[10px] font-normal text-muted-foreground">kg</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right font-black text-emerald-700 text-base">
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