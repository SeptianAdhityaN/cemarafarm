import { prisma } from "@/lib/prisma";
import { deleteSalesChannel } from "@/lib/actions/sales-channel";
import { Trash2, Store, ArrowLeft } from "lucide-react"; // Tambahkan ArrowLeft
import { ChannelForm } from "@/components/settings/channel-form";
import Link from "next/link"; // Tambahkan Link

export default async function ChannelsPage() {
  const channels = await prisma.salesChannel.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 relative">
      {/* HEADER SECTION */}
      <div className="flex items-start gap-4">
        {/* Tombol Kembali ke Settings */}
        <Link 
          href="/settings" 
          className="mt-1 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm shrink-0"
          title="Kembali ke Pengaturan"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-900 leading-tight">
            Kanal Penjualan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tentukan ke mana saja hasil panen CemaraFarm didistribusikan.
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
         <ChannelForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 italic font-sans">Belum ada kanal penjualan.</p>
          </div>
        ) : (
          channels.map((channel) => (
            <div
              key={channel.id}
              className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                  <Store size={18} className="transition-colors" />
                </div>
                <span className="font-bold text-foreground">{channel.name}</span>
              </div>
              
              <form action={async () => {
                "use server";
                await deleteSalesChannel(channel.id);
              }}>
                <button className="text-slate-300 hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}