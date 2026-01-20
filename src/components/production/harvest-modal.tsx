"use client"

import { useState } from "react";
import { harvestBatch } from "@/lib/actions/production";

// 1. Definisikan Interface untuk objek Batch
// Perhatikan: kita hanya menuliskan property yang benar-benar dipakai di komponen ini
interface HarvestBatchProps {
  batch: {
    id: string;
    batchCode: string;
    variety: {
      name: string;
    };
  };
  onClose: () => void;
}

export function HarvestModal({ batch, onClose }: HarvestBatchProps) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-emerald-900 mb-1">Input Hasil Panen</h2>
        <p className="text-sm text-slate-500 mb-4">
          <span className="font-semibold text-slate-700">{batch.batchCode}</span> — {batch.variety.name}
        </p>
        
        {/* 2. Berikan type FormData pada parameter action */}
        <form action={async (formData: FormData) => {
          setLoading(true);
          try {
            await harvestBatch(formData);
            onClose();
          } catch (error) {
            console.error(error);
            alert("Gagal menyimpan hasil panen");
          } finally {
            setLoading(false);
          }
        }} className="space-y-4">
          <input type="hidden" name="id" value={batch.id} />
          
          <div>
            <label className="text-sm font-medium text-slate-700">Tanggal Panen</label>
            <input 
              type="date" 
              name="harvestDate" 
              required 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500" 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Total Berat (Kg)</label>
            <input 
              type="number" 
              step="0.01" 
              name="weight" 
              placeholder="0.00" 
              required 
              min="0.01"
              className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500" 
            />
            <p className="text-[10px] text-slate-400 mt-1">*Berat ini akan menjadi stok tersedia di katalog.</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              disabled={loading}
              onClick={onClose} 
              className="flex-1 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-100 disabled:opacity-50 transition-all"
            >
              {loading ? "Menyimpan..." : "Simpan Panen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}