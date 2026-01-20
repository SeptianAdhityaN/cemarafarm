"use client";

import { createSalesChannel } from "@/lib/actions/sales-channel";
import { useActionState, useEffect, useRef } from "react";
import { Store, Loader2, Plus } from "lucide-react";

export function ChannelForm() {
  const [state, formAction, isPending] = useActionState(createSalesChannel, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="w-full">
      {/* Label Header - Tanpa Card Container */}
      <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-emerald-900">
        <Store className="text-emerald-600" size={20} /> Tambah Kanal Penjualan
      </h2>
      
      <form ref={formRef} action={formAction} className="space-y-3">
        {/* Container Input & Button: Stack di Mobile, Row di Desktop */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              name="name"
              placeholder="Misal: WhatsApp, Reseller A, Pasar Wage..."
              required
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:bg-slate-50 text-sm"
              disabled={isPending}
            />
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Plus size={18} />
            )}
            <span className="whitespace-nowrap">
              {isPending ? "Menyimpan..." : "Simpan Kanal"}
            </span>
          </button>
        </div>
        
        {state?.error && (
          <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
            ⚠️ {state.error}
          </p>
        )}
      </form>
    </div>
  );
}