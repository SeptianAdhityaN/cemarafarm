"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validasi Kecocokan
    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      return;
    }

    // 2. Validasi Kekuatan Password (Regex)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password minimal 6 karakter, harus ada huruf besar, kecil, dan angka.",
      );
      return;
    }

    setLoading(true);
    try {
      // 3. Destructuring aman (menggunakan underscore untuk membuang variabel)
      const { confirmPassword, ...dataToSend } = formData;

      // 4. Sanitisasi ringan (Trim spasi berlebih)
      const sanitizedData = {
        ...dataToSend,
        name: dataToSend.name.trim(),
        email: dataToSend.email.toLowerCase().trim(),
      };

      await axios.post("/api/register", sanitizedData);

      alert("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Terjadi kesalahan saat mendaftar.",
        );
      } else {
        setError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Sementara diarahkan ke callback yang sama dengan login
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-shake">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            className="w-full p-2 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full p-2 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none pr-10"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Konfirmasi Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full p-2 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-200"
        >
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-emerald-600 font-bold hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="bg-card px-2 text-muted-foreground">
            Atau daftar dengan
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleRegister}
        className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl bg-card text-foreground font-medium hover:bg-muted transition-all shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </button>
    </div>
  );
}
