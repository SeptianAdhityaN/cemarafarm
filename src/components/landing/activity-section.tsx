import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { STATIC_ACTIVITIES } from "@/lib/constants";

export default function ActivitySection() {
  return (
    <section className="relative bg-primary/5 rounded-[4rem] py-28 mx-4 md:mx-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <Badge
              variant="outline"
              className="w-fit border-primary/30 text-primary rounded-full px-4"
            >
              Aktivitas Kebun
            </Badge>

            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Cerita dari Kebun Kami
            </h2>

            <p className="text-muted-foreground text-lg">
              Proses perawatan, panen, dan keseharian di kebun selada
              hidroponik kami.
            </p>
          </div>

          <Button
            variant="link"
            asChild
            className="text-primary font-semibold p-0 h-auto"
          >
            <Link href="/aktivitas" className="group inline-flex items-center">
              Lihat Semua
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Activity Cards */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {STATIC_ACTIVITIES.slice(0, 3).map((activity) => (
            <article
              key={activity.id}
              className="group bg-background rounded-[2rem] overflow-hidden border border-border
                         transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/90 backdrop-blur text-primary border-none shadow-sm">
                    {activity.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <Calendar size={14} className="text-primary" />
                  {activity.date}
                </div>

                <h3 className="font-serif text-xl font-bold leading-snug transition-colors group-hover:text-primary">
                  {activity.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
