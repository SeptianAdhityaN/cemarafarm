"use client";

import { useState } from "react";
import { updateBatchStatus } from "@/lib/actions/production";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { BatchStatus } from "@prisma/client";
import { HarvestModal } from "./harvest-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductionBatchWithVariety {
  id: string;
  batchCode: string;
  variety: {
    name: string;
  };
  sowingDate: Date;
  estimatedHarvestDate: Date;
  status: BatchStatus;
  currentStockKg: number;
}

interface ProductionTableProps {
  data: ProductionBatchWithVariety[];
}

export function ProductionTable({ data }: ProductionTableProps) {
  const [selectedHarvest, setSelectedHarvest] = useState<ProductionBatchWithVariety | null>(null);

  const getStatusStyle = (status: BatchStatus): string => {
    switch (status) {
      case "SEEDING": return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "GROWING": return "bg-blue-50 text-blue-700 border-blue-100";
      case "READY_TO_HARVEST": return "bg-primary/10 text-primary border-primary/20";
      case "COMPLETED": return "bg-muted text-muted-foreground border-border";
      default: return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const getNextStatus = (current: BatchStatus): BatchStatus | null => {
    if (current === "SEEDING") return "GROWING";
    return null;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden w-full">
      <Table>
        {/* --- DESKTOP HEADER: Identik dengan SalesPage --- */}
        <TableHeader className="hidden md:table-header-group bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Kode & Varietas</TableHead>
            <TableHead className="font-bold">Tgl Semai</TableHead>
            <TableHead className="font-bold">Estimasi Panen</TableHead>
            <TableHead className="font-bold text-center">Status</TableHead>
            <TableHead className="text-right font-bold">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border">
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-10 text-center text-muted-foreground italic font-sans">
                Belum ada data produksi.
              </TableCell>
            </TableRow>
          ) : (
            data.map((batch) => {
              const nextStatus = getNextStatus(batch.status);

              return (
                <TableRow key={batch.id} className="block md:table-row hover:bg-muted/30 transition-colors">
                  
                  {/* --- MOBILE VIEW: Merged Cell (No double wrapping) --- */}
                  <TableCell className="block md:hidden p-4">
                    <div className="space-y-4">
                      {/* Top Row: Code and Status */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-foreground font-sans tracking-tight">
                            {batch.batchCode}
                          </div>
                          <div className="text-sm text-primary font-semibold font-sans">
                            {batch.variety.name}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(batch.status)}`}>
                          {batch.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Middle Row: Dates (Left & Right Aligned) */}
                      <div className="flex justify-between items-end border-t border-dashed border-border pt-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Tgl Semai</p>
                          <p className="text-sm font-medium font-sans">
                            {format(new Date(batch.sowingDate), "dd MMM yyyy", { locale: localeId })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Estimasi Panen</p>
                          <p className="text-sm font-medium font-sans flex items-center justify-end gap-1">
                            <Clock size={12} className="text-muted-foreground" />
                            {format(new Date(batch.estimatedHarvestDate), "dd MMM yyyy", { locale: localeId })}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Row: Actions */}
                      <div className="flex justify-end pt-1">
                        {batch.status === "SEEDING" && nextStatus && (
                          <button
                            onClick={() => updateBatchStatus(batch.id, nextStatus)}
                            className="w-full py-2 flex justify-center items-center gap-2 text-xs font-bold bg-white border border-border rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm"
                          >
                            Pindah ke Pembesaran <ChevronRight size={14} />
                          </button>
                        )}

                        {batch.status === "GROWING" && (
                          <button
                            onClick={() => setSelectedHarvest(batch)}
                            className="w-full py-2 flex justify-center items-center gap-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md"
                          >
                            Panen Sekarang
                          </button>
                        )}

                        {batch.status === "READY_TO_HARVEST" && (
                          <div className="text-right flex items-center gap-2">
                             <span className="text-[10px] text-muted-foreground font-medium italic">
                              Tersedia: {batch.currentStockKg} kg
                            </span>
                            <span className="text-xs font-bold text-primary flex items-center gap-1">
                              <CheckCircle2 size={14} /> Siap Jual
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* --- DESKTOP VIEW: Individual Cells --- */}
                  <TableCell className="hidden md:table-cell">
                    <div className="font-bold text-foreground">{batch.batchCode}</div>
                    <div className="text-sm text-primary font-medium">{batch.variety.name}</div>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {format(new Date(batch.sowingDate), "dd MMM yyyy", { locale: localeId })}
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {format(new Date(batch.estimatedHarvestDate), "dd MMM yyyy", { locale: localeId })}
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(batch.status)}`}>
                      {batch.status.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell text-right">
                    {batch.status === "SEEDING" && nextStatus && (
                      <button
                        onClick={() => updateBatchStatus(batch.id, nextStatus)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-white border border-border px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-all shadow-sm"
                      >
                        Pindah ke Pembesaran <ChevronRight size={14} />
                      </button>
                    )}
                    {batch.status === "GROWING" && (
                      <button
                        onClick={() => setSelectedHarvest(batch)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-all shadow-md"
                      >
                        Panen Sekarang
                      </button>
                    )}
                    {batch.status === "READY_TO_HARVEST" && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <CheckCircle2 size={14} /> Siap Jual
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Stok: {batch.currentStockKg} kg
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Modal Panen */}
      {selectedHarvest && (
        <HarvestModal
          batch={selectedHarvest}
          onClose={() => setSelectedHarvest(null)}
        />
      )}
    </div>
  );
}