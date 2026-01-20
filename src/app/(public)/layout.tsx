import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { FARM_INFO } from "@/lib/constants";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Logo tetap ada di mobile */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold">
              {FARM_INFO.name}
            </span>
          </Link>

          {/* Desktop Menu (Sembunyi di Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 pr-4 border-r border-border">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Beranda
              </Link>
              <Link href="/katalog" className="text-sm font-medium">
                Katalog
              </Link>
              <Link href="/aktivitas" className="text-sm font-medium">
                Aktivitas
              </Link>
            </div>
            {session ? (
              <UserMenu user={session.user} isAdmin={isAdmin} />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button size="sm">Masuk</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Profile/Login (Tetap ada di Top Bar Mobile) */}
          <div className="md:hidden flex items-center gap-3">
            {session ? (
              <UserMenu user={session.user} isAdmin={isAdmin} />
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 text-primary"
                >
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 pb-20 md:pb-0">
        {" "}
        {/* Tambah padding bawah agar konten tidak tertutup nav mobile */}
        {children}
      </main>
      <MobileNav /> {/* Komponen Navigasi Bawah */}
      {/* Footer Elegan sesuai Data Statis */}
      <footer className="bg-foreground text-background pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  {FARM_INFO.name}
                </h3>
              </div>
              <p className="text-background/60 text-sm leading-relaxed max-w-sm">
                Membangun masa depan ketahanan pangan melalui sistem hidroponik
                modern yang jujur, segar, dan tanpa pestisida langsung dari
                Surabaya.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-primary uppercase tracking-widest text-xs">
                Navigasi
              </h4>
              <nav className="flex flex-col gap-3 text-sm text-background/50">
                <Link
                  href="/katalog"
                  className="hover:text-primary transition-colors"
                >
                  Katalog Sayur
                </Link>
                <Link
                  href="/aktivitas"
                  className="hover:text-primary transition-colors"
                >
                  Log Aktivitas
                </Link>
                <Link
                  href="/tentang"
                  className="hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-primary uppercase tracking-widest text-xs">
                Hubungi Kami
              </h4>
              <div className="flex flex-col gap-3 text-sm text-background/50">
                <p>{FARM_INFO.address}</p>
                <Link
                  href={`https://wa.me/${FARM_INFO.whatsapp}`}
                  target="_blank"
                  className="font-bold text-background hover:text-primary transition-colors"
                >
                  WA: +{FARM_INFO.whatsapp}
                </Link>
                <p className="italic">Instagram: {FARM_INFO.instagram}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em] text-background/30">
            <p>© 2026 {FARM_INFO.name}. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
