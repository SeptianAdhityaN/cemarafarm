import { STATIC_ACTIVITIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Image from "next/image";

export default function PublicActivityPage() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold">Aktivitas Kebun</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Melihat lebih dekat proses budidaya hidroponik kami dari benih hingga sampai ke tangan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STATIC_ACTIVITIES.map((act) => (
          <div key={act.id} className="group cursor-default">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-4 border border-border shadow-sm">
              <Image 
                src={act.image} 
                alt={act.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105 duration-500"
              />
              <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary border-none font-bold">
                {act.category}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Calendar size={12} className="text-primary" />
                {new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {act.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}