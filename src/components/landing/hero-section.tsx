import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ArrowRight, Sparkles } from "lucide-react";
import { FARM_INFO } from "@/lib/constants"; // Import data farm

export default function HeroSection() {
  // Buat pesan otomatis agar pembeli tidak bingung mau nanya apa
  const waMessage = encodeURIComponent(
    `Halo ${FARM_INFO.name}, saya tertarik untuk memesan selada. Bisa dibantu list stoknya?`
  );
  const waLink = `https://wa.me/${FARM_INFO.whatsapp}?text=${waMessage}`;

  return (
    <section className="relative pt-32 md:pt-48 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* TEXT CONTENT */}
        <div className="space-y-8">
          <Badge className="w-fit bg-primary/10 text-primary border border-primary/20 flex items-center gap-2">
            <Sparkles size={14} /> Panen Setiap Pagi
          </Badge>

          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
            Selada Hidroponik <br />
            <span className="text-primary italic">Segar & Sehat</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Sayuran hidroponik premium dari kebun lokal Surabaya.
            Tanpa pestisida, higienis, dan dipanen sesuai pesanan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Tombol WhatsApp dengan Link */}
            <Button size="lg" className="h-14 rounded-xl font-bold group shadow-lg shadow-primary/20" asChild>
              <Link href={waLink} target="_blank">
                <Phone className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Pesan via WhatsApp
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-xl border-primary/30 text-primary hover:bg-primary/5 transition-all"
              asChild
            >
              <Link href="/katalog">
                Lihat Katalog <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* VISUAL IMAGE */}
        <div className="relative group">
          <div className="absolute -inset-6 bg-primary/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

          <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-2xl bg-muted border border-border/50">
            <Image
              src="/hero-farm.jpg"
              alt="Kebun selada hidroponik Cemara Farm"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linier-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold">
                Fresh From Our Farm
              </p>
              <h3 className="text-2xl font-serif font-bold">
                Selada Panen Hari Ini
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}