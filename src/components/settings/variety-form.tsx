"use client";

import { useActionState, useEffect, useState } from "react";
import { createVariety, updateVariety, VarietyState } from "@/lib/actions/variety";
import { Loader2, Save, Plus, ImageIcon, X } from "lucide-react";
import { Variety } from "@/types/variety";
import { UploadButton } from "@uploadthing/react";
import Image from "next/image";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface VarietyFormProps {
  initialData?: Variety | null;
  onSuccess?: () => void;
}

export function VarietyForm({ initialData, onSuccess }: VarietyFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  // Bind ID jika dalam mode edit untuk Server Action
  const boundAction = initialData 
    ? updateVariety.bind(null, initialData.id) 
    : createVariety;

  const [state, formAction, isPending] = useActionState(boundAction, null);

  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Varietas</label>
          <input
            name="name"
            defaultValue={initialData?.name}
            placeholder="Contoh: Selada Keriting"
            className="w-full p-2 border rounded-xl outline-emerald-500 bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Harga Master (Rp/kg)</label>
          <input
            name="price"
            type="number"
            step="1"
            defaultValue={initialData?.price}
            placeholder="25000"
            className="w-full p-2 border rounded-xl outline-emerald-500 bg-background"
            required
          />
        </div>
      </div>

<div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <ImageIcon size={16} className="text-emerald-600" /> Foto Produk
        </label>

        {imageUrl ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-emerald-100">
            <Image 
              src={imageUrl} 
              alt="Preview" 
              fill 
              className="object-cover" 
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 transition-all hover:bg-slate-100">
            <UploadButton<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].url); // Otomatis mendapatkan link dari UploadThing
                alert("Upload Berhasil!");
              }}
              onUploadError={(error: Error) => {
                alert(`Error: ${error.message}`);
              }}
              appearance={{
                button: "bg-emerald-600 px-4 py-2 rounded-lg text-sm font-bold shadow-md",
                allowedContent: "text-[10px] text-slate-400 mt-2"
              }}
              content={{
                button({ ready }) {
                  if (ready) return "Pilih Foto Sayur";
                  return "Menyiapkan...";
                },
                allowedContent: "Gambar (Maks 4MB)"
              }}
            />
          </div>
        )}
        {/* Input hidden agar link URL tetap terkirim saat form disubmit */}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Kategori</label>
        <select
          name="category"
          defaultValue={initialData?.category || "Sayuran Hijau"}
          className="w-full p-2 border rounded-xl outline-emerald-500 bg-background"
        >
          <option value="Sayuran Hijau">Sayuran Hijau</option>
          <option value="Tanaman Buah">Tanaman Buah</option>
          <option value="Herbal">Herbal</option>
        </select>
      </div>

      {state?.error && (
        <p className="text-sm font-medium text-destructive animate-pulse">
          ⚠️ {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : initialData ? (
          <Save size={18} />
        ) : (
          <Plus size={18} />
        )}
        {initialData ? "Simpan Perubahan" : "Tambah Varietas"}
      </button>
    </form>
  );
}