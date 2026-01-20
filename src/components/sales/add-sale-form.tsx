"use client";

import { useActionState, useState } from "react";
import { createSale } from "@/lib/actions/sales";
import { ShoppingCart } from "lucide-react";

interface BatchOption {
  id: string;
  batchCode: string;
  currentStockKg: number;
  variety: { name: string };
}

interface ChannelOption {
  id: string;
  name: string;
}

export function AddSaleForm({
  batches,
  channels,
}: {
  batches: BatchOption[];
  channels: ChannelOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createSale, null);

  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);

  const clientAction = async (formData: FormData) => {
    await formAction(formData);

    setIsOpen(false);
    setQty(0);
    setPrice(0);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all font-bold flex items-center gap-2 shadow-sm whitespace-nowrap"
      >
        <ShoppingCart size={18} />
        <span className="hidden sm:inline">Catat Penjualan</span>
        <span className="sm:hidden">Catat</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-emerald-900 mb-4 font-serif">
              Transaksi Baru
            </h2>

            {/* Gunakan clientAction sebagai pengganti formAction langsung */}
            <form action={clientAction} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Pilih Batch (Stok Tersedia)
                </label>
                <select
                  name="batchId"
                  required
                  className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500 bg-white shadow-sm"
                >
                  <option value="">-- Pilih Batch --</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} - {b.variety.name} ({b.currentStockKg}kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Kanal Jual
                  </label>
                  <select
                    name="channelId"
                    required
                    className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500 bg-white shadow-sm"
                  >
                    {channels.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Nama Pelanggan
                  </label>
                  <input
                    name="customerName"
                    placeholder="Umum"
                    required
                    className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500 px-3 shadow-sm py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Berat (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="quantityKg"
                    required
                    onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500 px-3 shadow-sm py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Harga /Kg (Rp)
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    required
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 mt-1 border border-slate-200 rounded-lg outline-emerald-500 px-3 shadow-sm py-2"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-widest">
                    Estimasi Total
                  </p>
                  <p className="text-xl font-black text-emerald-800">
                    Rp {(qty * price).toLocaleString("id-ID")}
                  </p>
                </div>
                <ShoppingCart className="text-emerald-200" size={32} />
              </div>

              {/* Tampilkan error jika ada */}
              {state?.error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 italic font-medium">
                  ⚠️ {state.error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-100 transition-all active:scale-95"
                >
                  {isPending ? "Proses..." : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
