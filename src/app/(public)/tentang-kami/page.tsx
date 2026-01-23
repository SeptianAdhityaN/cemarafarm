import { ABOUT_DATA } from "@/lib/constants";
import Image from "next/image";
import { Leaf, Cpu, Truck } from "lucide-react";

const iconMap = {
  Leaf: <Leaf className="w-8 h-8 text-primary" />,
  Cpu: <Cpu className="w-8 h-8 text-primary" />,
  Truck: <Truck className="w-8 h-8 text-primary" />,
};

export default function TentangKamiPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground">
          {ABOUT_DATA.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {ABOUT_DATA.tagline}
        </p>
      </section>

      {/* STORY SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div className="relative aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
          <Image 
            src="/image/hero-farm2.jpg" 
            alt="Kebun Selada Hidroponik CemaraFarm Nganjuk"
            fill 
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold">Cerita Kami</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {ABOUT_DATA.story}
          </p>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ABOUT_DATA.values.map((value, index) => (
          <div 
            key={index}
            className="p-8 rounded-[2rem] border border-border bg-card hover:shadow-xl transition-all duration-300"
          >
            <div className="mb-6 inline-block p-4 rounded-2xl bg-primary/5">
              {iconMap[value.icon as keyof typeof iconMap]}
            </div>
            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
            <p className="text-muted-foreground">
              {value.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}