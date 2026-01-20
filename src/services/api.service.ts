// src/services/api.service.ts
import axiosInstance from "@/lib/axios";
import { 
  ProductionBatch, 
  CreateBatchInput, 
  UpdateBatchInput,
  Variety,
  SalesChannel,
  CreateSaleInput,
  SalesReportParams,
  Sale,             
  DashboardSummary  
} from "@/types/api";

export const ApiService = {
  // --- PRODUKSI ---
  production: {
    getAll: () => 
      axiosInstance.get<ProductionBatch[]>("/production").then(res => res.data),
    
    getDetail: (id: string) => 
      axiosInstance.get<ProductionBatch>(`/production/${id}`).then(res => res.data),
    
    create: (data: CreateBatchInput) => 
      axiosInstance.post<ProductionBatch>("/production", data).then(res => res.data),
    
    update: (id: string, data: UpdateBatchInput) => 
      axiosInstance.patch<ProductionBatch>(`/production/${id}`, data).then(res => res.data),
    
    delete: (id: string) => 
      axiosInstance.delete<{ success: boolean; message: string }>(`/production/${id}`).then(res => res.data),
  },

  // --- PENJUALAN ---
  sales: {
    getAll: (params?: SalesReportParams) => 
      axiosInstance.get<Sale[]>("/sales", { params }).then(res => res.data),
    
    create: (data: CreateSaleInput) => 
      axiosInstance.post<Sale>("/sales", data).then(res => res.data),
  },

  // --- MASTER DATA ---
  master: {
    getVarieties: () => 
      axiosInstance.get<Variety[]>("/varieties").then(res => res.data),
    
    getChannels: () => 
      axiosInstance.get<SalesChannel[]>("/channels").then(res => res.data),
  },

  // --- DASHBOARD ---
  dashboard: {
    getSummary: () => 
      axiosInstance.get<DashboardSummary>("/dashboard").then(res => res.data),
  }
};