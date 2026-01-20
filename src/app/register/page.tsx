import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dekorasi Background Halus */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mt-32" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mb-32" />

      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-[2.5rem] shadow-sm border border-border relative group">
        {/* Tombol Kembali ke Root */}
        <Link
          href="/"
          className="absolute left-6 top-6 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
          title="Kembali ke Beranda"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="text-center pt-4">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Cemara<span className="text-primary italic">Farm</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Daftar akun baru untuk mulai hidup sehat
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/50">
          &copy; 2026 CemaraFarm. All rights reserved.
        </p>
      </div>
    </div>
  );
}
