import { prisma } from "@/lib/prisma";
import { deleteVariety } from "@/lib/actions/variety";
import { Trash2, ArrowLeft, Leaf } from "lucide-react"; // Tambahkan ArrowLeft & Leaf
import { VarietyForm } from "@/components/settings/variety-form";
import Link from "next/link"; // Tambahkan Link

export default async function VarietyPage() {
  const varieties = await prisma.variety.findMany({
    where: { isArchived: false },
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
            Master Varietas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola daftar jenis sayuran dan standarisasi harga CemaraFarm.
          </p>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        <VarietyForm />
      </div>

      {/* DAFTAR VARIETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {varieties.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 italic font-sans">Belum ada varietas yang terdaftar.</p>
          </div>
        ) : (
          varieties.map((v) => (
            <div 
              key={v.id} 
              className="flex justify-between items-center bg-card p-5 rounded-2xl border border-border shadow-sm hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Leaf size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-none">{v.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold uppercase text-muted-foreground">
                      {v.category || "General"}
                    </span>
                    <span className="text-xs font-medium text-primary">
                      Rp {Number(v.price).toLocaleString("id-ID")}/kg
                    </span>
                  </div>
                </div>
              </div>
              
              <form action={deleteVariety.bind(null, v.id)}>
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