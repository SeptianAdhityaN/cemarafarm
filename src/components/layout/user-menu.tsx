"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, User, Home } from "lucide-react";
import Link from "next/link";

interface UserMenuProps {
  user: {
    name?: string | null;
    role?: string;
  };
  isAdmin: boolean;
}

export function UserMenu({ user, isAdmin }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase hover:bg-primary/20 transition-all focus:ring-2 focus:ring-primary/30 outline-none"
      >
        {user.name?.charAt(0) || <User size={16} />}
      </button>

      {/* Backdrop untuk menutup modal saat klik di luar */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-background border border-border rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-border mb-1">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {user.role}
            </p>
          </div>

          <div className="flex flex-col gap-1 px-2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-primary/5 rounded-xl transition-colors">
                  <Home size={16} className="text-primary" />
                  Lihat Situs Publik
                </button>
              </Link>
              {isAdmin && (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-primary/5 rounded-xl transition-colors">
                    <LayoutDashboard size={16} className="text-primary" />
                    Portal Admin
                  </button>
                </Link>
              )}
              <div className="h-px bg-border my-1 mx-2" /> {/* Separator */}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                Keluar (Logout)
              </button>
          </div>
        </div>
      )}
    </div>
  );
}
