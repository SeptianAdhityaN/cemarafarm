"use client";

import { createVariety } from "@/lib/actions/variety";
import { useActionState, useEffect, useRef } from "react";
import { Leaf, DollarSign, Image as ImageIcon, Tag, AlignLeft } from "lucide-react";

export function VarietyForm() {
  const [state, formAction, isPending] = useActionState(createVariety, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
      <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2 text-foreground">
        <Leaf className="text-primary" size={24} /> Konfigurasi Varietas Sayur
      </h2>
      
      <form ref={formRef} action={formAction} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Varietas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <Tag size={12} /> Nama Varietas
            </label>
            <input
              name="name"
              placeholder="Misal: Selada Romaine"
              required
              className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              disabled={isPending}
            />
          </div>

          {/* Harga Default */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <DollarSign size={12} /> Harga Default (per Kg)
            </label>
            <input
              name="price"
              type="number"
              placeholder="35000"
              required
              className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              disabled={isPending}
            />
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <Tag size={12} /> Kategori
            </label>
            <input
              name="category"
              placeholder="Misal: Sayuran Hijau / Herbs"
              className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              disabled={isPending}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <ImageIcon size={12} /> URL Gambar Produk
            </label>
            <input
              name="imageUrl"
              placeholder="https://..."
              className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
            <AlignLeft size={12} /> Deskripsi Produk (untuk Katalog)
          </label>
          <textarea
            name="description"
            rows={2}
            placeholder="Jelaskan kesegaran atau manfaat sayur ini..."
            className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isPending ? "Menyimpan ke Database..." : "Simpan Varietas"}
          </button>
          
          {state?.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-sm text-destructive font-medium text-center">
                ⚠️ {state.error}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}