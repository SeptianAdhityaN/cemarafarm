// src/app/(public)/katalog/error.tsx
'use client'; // File error wajib menggunakan Client Component

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorKatalog({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Anda bisa mengirim log error ke layanan monitoring di sini
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>
      
      <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
        Ups! Terjadi Kesalahan
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-10">
        Gagal memuat katalog sayuran. Hal ini mungkin karena masalah koneksi sementara ke database kami.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()} // Fungsi untuk mencoba memuat ulang halaman secara otomatis
          className="rounded-xl px-8 py-6 h-auto text-lg"
        >
          <RefreshCcw className="w-5 h-5 mr-2" /> Coba Lagi
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
          className="rounded-xl px-8 py-6 h-auto text-lg"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}