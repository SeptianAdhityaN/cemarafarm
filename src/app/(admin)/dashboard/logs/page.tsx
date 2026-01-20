import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { UserIcon, Clock } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { ExportButton } from "@/components/ui/export-button";

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const logs = await prisma.activityLog.findMany({
    where: {
      OR: [
        { user: { name: { contains: query, mode: "insensitive" } } },
        { action: { contains: query, mode: "insensitive" } },
        { details: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const exportLogs = logs.map((l) => ({
    Waktu: format(l.createdAt, "dd/MM/yyyy HH:mm"),
    Staff: l.user.name,
    Aksi: l.action,
    Detail: l.details,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">
            Riwayat Aktivitas
          </h1>
        <div className="flex items-center gap-2">
          <ExportButton data={exportLogs} fileName="Audit_Log_CemaraFarm" />
          <SearchBar placeholder="Cari aksi atau staff..." />
        </div>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 italic">
              Belum ada aktivitas yang tercatat.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors"
            >
              <div className="bg-slate-50 p-2 rounded-full mt-1">
                <UserIcon size={16} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {log.user.name || "System"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">
                      ID: {log.id.slice(-8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    <Clock size={12} />
                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded leading-none mt-0.5">
                    {log.action}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
