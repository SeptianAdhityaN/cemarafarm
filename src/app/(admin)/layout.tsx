import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { UserMenu } from "@/components/layout/user-menu";
import { FARM_INFO } from "@/lib/constants";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { SessionTimeoutHandler } from "@/components/auth/session-timeout-handler";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Proteksi Route: Hanya ADMIN & STAFF yang bisa masuk
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "STAFF")
  ) {
    redirect("/");
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "STAFF";

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <SessionTimeoutHandler />
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header / Navbar Profesional */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group md:hidden"
            >
              {/* Logo tetap ada di mobile */}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold">
                {FARM_INFO.name}
              </span>
            </Link>
            <div className="hidden md:block text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Admin Dashboard
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="h-6 w-px bg-border hidden sm:block" />

            {/* User Profile Area menggunakan UserMenu */}
            <div className="flex items-center gap-3">
              <div className="flex-col items-end hidden sm:flex pointer-events-none">
                <span className="text-sm font-bold text-foreground leading-none">
                  {session.user.name}
                </span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">
                  {session.user.role}
                </span>
              </div>

              {/* Panggil UserMenu di sini */}
              <UserMenu user={session.user} isAdmin={isAdmin} />
            </div>
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <BottomNav />
    </div>
  );
}
