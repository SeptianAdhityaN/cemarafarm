import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { VarietyListClient } from "@/components/settings/variety-list-client";
import { Variety } from "@/types/variety";

export default async function VarietyPage() {
  // 1. Ambil data mentah dari Prisma
  const rawVarieties = await prisma.variety.findMany({
    where: { isArchived: false },
    orderBy: { name: "asc" },
  });

  // 2. Lakukan transformasi data secara eksplisit
  // Ini mengubah tipe Decimal (Prisma) menjadi number (TypeScript/JS)
  const varieties: Variety[] = rawVarieties.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description,
    price: Number(v.price), // Konversi Decimal ke number di sini
    imageUrl: v.imageUrl,
    category: v.category,
    isArchived: v.isArchived,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 relative animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex items-start gap-4">
        <Link
          href="/settings"
          className="mt-1 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm shrink-0"
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

      {/* Oper data yang sudah bersih ke Client Component */}
      <VarietyListClient initialVarieties={varieties} />
    </div>
  );
}