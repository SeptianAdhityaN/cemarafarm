"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBasket, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Katalog", href: "/katalog", icon: ShoppingBasket },
    { name: "Aktivitas", href: "/aktivitas", icon: Camera },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-background/80 backdrop-blur-lg border border-border shadow-2xl rounded-3xl p-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 min-w-16",
                isActive ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}