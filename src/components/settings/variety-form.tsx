"use client";

import { useActionState, useEffect } from "react";
import { createVariety, updateVariety, VarietyState } from "@/lib/actions/variety";
import { Loader2, Save, Plus } from "lucide-react";
import { Variety } from "@/types/variety";

interface VarietyFormProps {
  initialData?: Variety | null;
  onSuccess?: () => void;
}

export function VarietyForm({ initialData, onSuccess }: VarietyFormProps) {
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
        <label className="text-sm font-medium">URL Gambar (Opsional)</label>
        <input
          name="imageUrl"
          defaultValue={initialData?.imageUrl || ""}
          placeholder="https://..."
          className="w-full p-2 border rounded-xl outline-emerald-500 bg-background"
        />
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