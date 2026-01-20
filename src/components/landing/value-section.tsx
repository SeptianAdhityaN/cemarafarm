// components/landing/value-section.tsx
import { Droplets, Sun, Wind } from "lucide-react";

const VALUES = [
  {
    icon: Droplets,
    title: "Hidroponik Bersih",
    desc: "Sistem air tertutup menjaga nutrisi dan kebersihan tanaman.",
  },
  {
    icon: Sun,
    title: "Cahaya Alami",
    desc: "Greenhouse dengan kontrol cahaya optimal sepanjang hari.",
  },
  {
    icon: Wind,
    title: "Tanpa Pestisida",
    desc: "Aman dikonsumsi seluruh keluarga, termasuk anak-anak.",
  },
];

export default function ValueSection() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {VALUES.map((item, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-card border border-border hover:shadow-lg transition"
          >
            <item.icon className="text-primary mb-6" size={32} />
            <h3 className="font-serif text-xl font-bold mb-2">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
