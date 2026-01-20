import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { format, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, DollarSign, Sprout, TrendingUp } from "lucide-react";
import { SalesChart } from "@/components/dashboard/sales-chart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const today = new Date();
  const startOfMonthDate = startOfMonth(today);
  const endOfMonthDate = endOfMonth(today);
  const startOfYearDate = startOfYear(today);
  // Perbaikan Error 1: Menghapus referensi endOfYearDate yang tidak ada di query, 
  // atau mendefinisikannya jika diperlukan untuk query tahunan.

  // --- Data Fetching ---
  const [
    activeBatches,
    readyToHarvestBatches,
    monthlyRevenueAggregate,
    yearlyRevenueAggregate,
    dailySalesRaw,
  ] = await Promise.all([
    prisma.productionBatch.count({
      where: { status: { in: ["SEEDING", "GROWING"] }, isArchived: false },
    }),
    prisma.productionBatch.count({
      where: { status: "READY_TO_HARVEST", isArchived: false },
    }),
    prisma.sale.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: startOfMonthDate, lte: endOfMonthDate } },
    }),
    prisma.sale.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: startOfYearDate } }, // Menggunakan gte saja untuk tahun ini
    }),
    prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT DATE_TRUNC('day', "createdAt") as date, SUM("totalPrice")::float as total
      FROM "Sale"
      WHERE "createdAt" >= ${startOfMonthDate} AND "createdAt" <= ${endOfMonthDate}
      GROUP BY date
      ORDER BY date ASC
    `,
  ]);

  // Perbaikan Error 2: Menambahkan properti 'totalKg' agar sesuai dengan tipe 'DailySale'
  const dailySalesData = dailySalesRaw.map((r) => ({
    date: r.date.toISOString(),
    totalRevenue: r.total,
    totalKg: 0, // Nilai default untuk memenuhi kontrak tipe data
  }));

  const totalMonthlyRevenue = Number(monthlyRevenueAggregate._sum.totalPrice || 0);
  const totalYearlyRevenue = Number(yearlyRevenueAggregate._sum.totalPrice || 0);

  return (
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
          Halo, {session.user.name}!
        </h1>
        <p className="text-muted-foreground text-sm font-sans">
          Berikut adalah ringkasan performa CemaraFarm hari ini.
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title={`Omzet ${format(today, "MMMM", { locale: id })}`}
          value={`Rp ${totalMonthlyRevenue.toLocaleString("id-ID")}`}
          description="Total pendapatan bulan berjalan"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard 
          title="Batch Aktif"
          value={`${activeBatches} Unit`}
          description="Tahap semai & pembesaran"
          icon={<Leaf className="h-4 w-4" />}
        />
        <StatCard 
          title="Siap Panen"
          value={`${readyToHarvestBatches} Unit`}
          description="Perlu segera ditangani"
          icon={<Sprout className="h-4 w-4" />}
        />
        <StatCard 
          title="Omzet Tahunan"
          value={`Rp ${totalYearlyRevenue.toLocaleString("id-ID")}`}
          description={`Total sepanjang tahun ${today.getFullYear()}`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Chart Section */}
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary font-serif">Laporan Penjualan</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Tren pendapatan harian bulan ini</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <SalesChart data={dailySalesData} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-[10px] text-muted-foreground mt-1 font-sans uppercase tracking-tight">{description}</p>
      </CardContent>
    </Card>
  );
}