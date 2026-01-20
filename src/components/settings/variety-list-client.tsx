"use client";

import { useState } from "react";
import { Trash2, Edit3, Leaf } from "lucide-react";
import { deleteVariety } from "@/lib/actions/variety";
import { VarietyForm } from "./variety-form";
import { Variety } from "@/types/variety";
import { formatRelativeTime } from "@/lib/utils";

export function VarietyListClient({
  initialVarieties,
}: {
  initialVarieties: Variety[];
}) {
  const [editingVariety, setEditingVariety] = useState<Variety | null>(null);

  return (
    <div className="space-y-8">
      {/* FORM SECTION */}
      <div className="bg-card p-6 rounded-[2rem] border-2 border-emerald-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-emerald-800">
            {editingVariety
              ? `Edit: ${editingVariety.name}`
              : "Tambah Varietas Baru"}
          </h2>
          {editingVariety && (
            <button
              onClick={() => setEditingVariety(null)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              Batal Edit
            </button>
          )}
        </div>
        <VarietyForm
          key={editingVariety?.id || "new"}
          initialData={editingVariety}
          onSuccess={() => setEditingVariety(null)}
        />
      </div>

      {/* LIST SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialVarieties.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 italic font-sans">
              Belum ada varietas yang terdaftar.
            </p>
          </div>
        ) : (
          initialVarieties.map((v) => (
            <div
              key={v.id}
              className="flex justify-between items-center bg-card p-5 rounded-2xl border border-border group hover:border-emerald-200 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Leaf size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-none">
                    {v.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold uppercase text-slate-500">
                      {v.category || "General"}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Rp {v.price.toLocaleString("id-ID")}/kg
                    </span>
                    <p suppressHydrationWarning className="text-[9px] text-slate-400 italic">
                      Update: {formatRelativeTime(v.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingVariety(v)}
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <Edit3 size={18} />
                </button>
                <form action={deleteVariety.bind(null, v.id)}>
                  <button className="text-slate-300 hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
