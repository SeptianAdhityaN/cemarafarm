import Link from "next/link";
import {
  Leaf,
  Store,
  ChevronRight,
  Settings2,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const menuItems = [
    {
      title: "Master Varietas",
      description:
        "Kelola daftar jenis sayuran yang ditanam (misal: Selada, Pakcoy).",
      icon: <Leaf className="text-primary" size={24} />,
      href: "/settings/varieties",
      color: "bg-primary/10",
    },
    {
      title: "Kanal Penjualan",
      description:
        "Atur kemana hasil panen didistribusikan (misal: WhatsApp, Pasar).",
      icon: <Store className="text-primary" size={24} />,
      href: "/settings/channels",
      color: "bg-primary/10",
    },
    {
      title: "Manajemen Tim",
      description: "Atur role user (Admin, Staff, atau User Biasa).",
      icon: <ShieldCheck className="text-primary" size={24} />,
      href: "/settings/users",
      color: "bg-primary/10",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <Settings2 className="text-muted-foreground" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Pengaturan
          </h1>
          <p className="text-muted-foreground text-sm font-sans">
            Kelola data master dan konfigurasi aplikasi CemaraFarm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group block p-6 bg-card rounded-2xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors font-sans">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Placeholder untuk fitur masa depan (opsional) */}
      <div className="mt-12 p-8 border-2 border-dashed border-border rounded-3xl text-center">
        <p className="text-muted-foreground text-sm italic font-medium font-sans">
          Fitur pengaturan lainnya (Profil, User Management) akan segera hadir.
        </p>
      </div>
    </div>
  );
}
