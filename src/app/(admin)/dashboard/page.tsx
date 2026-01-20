import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { format, startOfMonth, endOfMonth, startOfYear, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, DollarSign, Sprout, TrendingUp, Clock } from "lucide-react"; // Tambah Clock icon
import { SalesChart } from "@/components/dashboard/sales-chart";
import { formatRelativeTime } from "@/lib/utils"; // Import utilitas baru

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const today = new Date();
  const startOfToday = startOfDay(today);
  const startOfMonthDate = startOfMonth(today);
  const endOfMonthDate = endOfMonth(today);
  const startOfYearDate = startOfYear(today);

  // --- Data Fetching ---
  const [
    activeBatches,
    readyToHarvestBatches,
    todayRevenueAggregate,      // Tambahan: Pendapatan hari ini
    monthlyRevenueAggregate,
    yearlyRevenueAggregate,
    dailySalesRaw,
    lastActivity                // Tambahan: Aktivitas terakhir
  ] = await Promise.all([
    prisma.productionBatch.count({
      where: { status: { in: ["SEEDING", "GROWING"] }, isArchived: false },
    }),
    prisma.productionBatch.count({
      where: { status: "READY_TO_HARVEST", isArchived: false },
    }),
    prisma.sale.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.sale.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: startOfMonthDate, lte: endOfMonthDate } },
    }),
    prisma.sale.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: startOfYearDate } },
    }),
    prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT DATE_TRUNC('day', "createdAt") as date, SUM("totalPrice")::float as total
      FROM "Sale"
      WHERE "createdAt" >= ${startOfMonthDate} AND "createdAt" <= ${endOfMonthDate}
      GROUP BY date
      ORDER BY date ASC
    `,
    prisma.sale.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true }
    })
  ]);

  // Mapping data chart
  const dailySalesData = dailySalesRaw.map((r) => ({
    date: r.date.toISOString(),
    totalRevenue: r.total,
    totalKg: 0, 
  }));

  const totalTodayRevenue = Number(todayRevenueAggregate._sum.totalPrice || 0);
  const totalMonthlyRevenue = Number(monthlyRevenueAggregate._sum.totalPrice || 0);
  const totalYearlyRevenue = Number(yearlyRevenueAggregate._sum.totalPrice || 0);

  return (
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      {/* WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Halo, {session.user.name}!
          </h1>
          <p className="text-muted-foreground text-sm font-sans italic">
            Berikut adalah ringkasan performa CemaraFarm hari ini.
          </p>
        </div>
        
        {/* INFO UPDATE TERAKHIR */}
        {lastActivity && (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Clock className="w-3 h-3" />
            Terakhir Update: {formatRelativeTime(lastActivity.updatedAt)}
          </div>
        )}
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Pendapatan Hari Ini"
          value={`Rp ${totalTodayRevenue.toLocaleString("id-ID")}`}
          description="Total penjualan masuk hari ini"
          icon={<DollarSign className="h-4 w-4" />}
          highlight={true} // Memberi warna beda jika ingin menonjol
        />
        <StatCard 
          title={`Omzet ${format(today, "MMMM", { locale: id })}`}
          value={`Rp ${totalMonthlyRevenue.toLocaleString("id-ID")}`}
          description="Akumulasi bulan berjalan"
          icon={<TrendingUp className="h-4 w-4" />}
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
      </div>

      {/* Chart Section */}
      <Card className="rounded-[2rem] border-border shadow-sm overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary font-serif">Tren Penjualan Bulanan</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Total Omzet Tahunan: <span className="font-bold text-foreground">Rp {totalYearlyRevenue.toLocaleString("id-ID")}</span>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <SalesChart data={dailySalesData} />
        </CardContent>
      </Card>
    </div>
  );
}

// Komponen StatCard yang disempurnakan
function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  highlight = false 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className={`hover:shadow-md transition-all duration-300 border-border rounded-2xl group ${highlight ? 'bg-emerald-50/50 border-emerald-100' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-xl transition-colors ${highlight ? 'bg-emerald-600 text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-slate-800">{value}</div>
        <p className="text-[10px] text-muted-foreground mt-1 font-sans font-medium">{description}</p>
      </CardContent>
    </Card>
  );
}