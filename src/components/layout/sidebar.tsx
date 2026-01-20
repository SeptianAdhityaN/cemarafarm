"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, ShoppingCart, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { FARM_INFO } from "@/lib/constants";

export function Sidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Produksi", href: "/production", icon: Leaf },
    { name: "Penjualan", href: "/sales", icon: ShoppingCart },
    { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col sticky top-0 h-screen">
      <div className="p-6 gap-2 flex flex-col">
        <Link href="/dashboard" className="flex items-center gap-group gap-2">
            {/* Logo tetap ada di mobile */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold">
              {FARM_INFO.name}
            </span>
          </Link>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Hydroponic Management</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}