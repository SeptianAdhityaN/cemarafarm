"use client"

import { createBatch } from "@/lib/actions/production";
import { useState } from "react";

// Mendefinisikan struktur data Variety yang dikirim dari Server
interface VarietyOption {
  id: string;
  name: string;
}

interface AddBatchFormProps {
  varieties: VarietyOption[];
}

export function AddBatchForm({ varieties }: AddBatchFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium"
      >
        + Semai Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Mulai Batch Baru</h2>
            
            <form action={async (fd: FormData) => {
              setIsSubmitting(true);
              try {
                await createBatch(fd);
                setIsOpen(false);
              } catch (error) {
                console.error("Gagal menyimpan:", error);
                alert("Terjadi kesalahan saat menyimpan data.");
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Pilih Varietas</label>
                <select 
                  name="varietyId" 
                  required 
                  className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500 bg-slate-50 focus:bg-white transition-all"
                >
                  <option value="">Pilih sayuran...</option>
                  {varieties.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Tanggal Semai</label>
                <input 
                  type="date" 
                  name="sowingDate" 
                  required 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Jumlah Benih (Butir/Netpot)</label>
                <input 
                  type="number" 
                  name="initialSeeds" 
                  required 
                  min="1"
                  placeholder="Contoh: 100"
                  className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-md shadow-emerald-200 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}