"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, ShoppingCart, Settings } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const menuItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kebun", href: "/production", icon: Leaf },
    { name: "Jual", href: "/sales", icon: ShoppingCart },
    { name: "Menu", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t flex justify-around items-center h-16 px-2 z-50">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} className={isActive ? "animate-pulse" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}