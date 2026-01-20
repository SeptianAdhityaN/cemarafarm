"use client";

import * as XLSX from "xlsx";
import { Download } from "lucide-react";
// Import tipe data asli tapi kita akan modifikasi sedikit
import { Sale, ProductionBatch, Variety, SalesChannel } from "@prisma/client";

// Gunakan Omit untuk membuang tipe Decimal dan menggantinya dengan number
interface SaleWithRelations extends Omit<Sale, "unitPrice" | "totalPrice"> {
  unitPrice: number;
  totalPrice: number;
  batch: ProductionBatch & {
    variety: Variety;
  };
  channel: SalesChannel;
}

interface ExportSalesButtonProps {
  data: SaleWithRelations[];
}

export function ExportSalesButton({ data }: ExportSalesButtonProps) {
  const handleExport = () => {
    const excelData = data.map((sale) => ({
      Waktu: new Date(sale.createdAt).toLocaleString("id-ID"),
      Produk: sale.batch.variety.name,
      Kode_Batch: sale.batch.batchCode,
      Pembeli: sale.customerName,
      Kanal: sale.channel.name,
      Jumlah_KG: sale.quantityKg,
      // Karena sudah number, tidak perlu fungsi Number() lagi di sini
      Harga_Satuan: sale.unitPrice,
      Total_Harga: sale.totalPrice,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-width columns
    const wscols = [
      { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
      { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
    ];
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Laporan_Penjualan_CemaraFarm_${dateStr}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all shadow-sm whitespace-nowrap"
    >
      <Download size={18} />
      <span>Export Excel</span>
    </button>
  );
}