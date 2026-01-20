// components/landing/cta-section.tsx
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Prioritas stok panen",
  "Gratis ongkir area Surabaya",
  "Varietas selada pilihan",
];

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="bg-foreground rounded-[3rem] p-16 text-white grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-4xl font-bold mb-4">
            Langganan Selada Segar
          </h2>
          <p className="text-white/70 mb-8">
            Kirim rutin setiap minggu langsung dari kebun ke rumah Anda.
          </p>

          <ul className="space-y-3">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 rounded-2xl p-10 text-center">
          <p className="text-sm uppercase tracking-widest text-primary">
            Mulai dari
          </p>
          <p className="text-5xl font-bold my-4">Rp 99rb</p>
          <Button size="lg" className="w-full rounded-xl font-bold">
            Mulai Langganan
          </Button>
        </div>
      </div>
    </section>
  );
}
