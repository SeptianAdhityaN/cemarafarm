"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Home, ShoppingBasket } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Visual Element */}
        <div className="relative mx-auto w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
          {/* Efek Cahaya Di Belakang */}
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative text-primary flex flex-col items-center">
            {/* Ikon Daun yang "Layu" atau Miring untuk kesan 404 */}
            <Leaf size={80} className="rotate-150 opacity-20 absolute -top-4" />
            <h1 className="text-8xl md:text-9xl font-serif font-bold tracking-tighter">
              404
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Waduh, Sayurnya Belum Tumbuh!
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Halaman yang Anda cari tidak ditemukan atau sudah dipindah ke lokasi
            lain. Yuk, kembali ke jalur yang benar.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="rounded-2xl h-14 px-8 font-bold shadow-lg shadow-primary/20"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" /> Kembali ke Beranda
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl h-14 px-8 border-primary/20 text-primary"
            asChild
          >
            <Link href="/katalog">
              <ShoppingBasket className="mr-2 h-5 w-5" /> Belanja Sayur
            </Link>
          </Button>
        </div>

        {/* Decorative Hint */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold pt-8">
          Error Code: Area_Tidak_Terjangkau_Nutrisi
        </p>
      </div>
    </div>
  );
}
