"use client";

import { createSalesChannel } from "@/lib/actions/sales-channel";
import { useActionState, useEffect, useRef } from "react";
import { Store } from "lucide-react";

export function ChannelForm() {
  const [state, formAction, isPending] = useActionState(createSalesChannel, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-900">
        <Store className="text-emerald-600" size={20} /> Tambah Kanal Penjualan
      </h2>
      
      <form ref={formRef} action={formAction} className="space-y-2">
        <div className="flex gap-2">
          <input
            name="name"
            placeholder="Misal: WhatsApp, Reseller A, Pasar Wage..."
            required
            className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-slate-50"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
        
        {state?.error && (
          <p className="text-sm text-red-600 font-medium">
            ⚠️ {state.error}
          </p>
        )}
      </form>
    </div>
  );
}