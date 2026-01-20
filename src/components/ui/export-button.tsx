"use client";

import * as XLSX from "xlsx";
import { Download } from "lucide-react";

// Menggunakan Generic T untuk menghindari 'any'
interface ExportButtonProps<T> {
  data: T[];
  fileName: string;
  sheetName?: string;
}

export function ExportButton<T extends object>({ 
  data, 
  fileName, 
  sheetName = "Data" 
}: ExportButtonProps<T>) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Buat worksheet dari data JSON
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Buat workbook baru
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Otomatis mengatur lebar kolom berdasarkan konten terpanjang
    const objectMaxLength: number[] = [];
    data.forEach((row) => {
      Object.values(row).forEach((val, index) => {
        const textValue = val ? val.toString() : "";
        objectMaxLength[index] = Math.max(objectMaxLength[index] || 10, textValue.length + 2);
      });
    });
    worksheet["!cols"] = objectMaxLength.map((w) => ({ wch: w }));

    // Download file dengan timestamp agar unik
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${fileName}_${dateStr}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={18} />
      <span>Export Excel</span>
    </button>
  );
}