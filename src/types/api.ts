// src/types/api.ts

export interface Variety {
  id: string;
  name: string;
}

export interface SalesChannel {
  id: string;
  name: string;
}

export interface ProductionBatch {
  id: string;
  batchCode: string;
  varietyId: string;
  variety?: Variety;
  sowingDate: string | Date;
  currentStockKg: number;
  status: 'SEEDING' | 'GROWING' | 'READY_TO_HARVEST' | 'COMPLETED' | 'FAILED';
  initialSeeds: number;
}

export interface CreateBatchInput {
  varietyId: string;
  sowingDate: string;
  initialSeeds: number;
}

export interface UpdateBatchInput {
  status?: ProductionBatch['status'];
  currentStockKg?: number;
  actualHarvestDate?: string;
}

export interface CreateSaleInput {
  batchId: string;
  channelId: string;
  customerName: string;
  quantityKg: number;
  unitPrice: number;
}

export interface SalesReportParams {
  month?: string;
  year?: string;
  start?: string;
  end?: string;
}

export interface Sale {
  id: string;
  batchId: string;
  channelId: string;
  customerName: string;
  quantityKg: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  batch?: { batchCode: string };
  channel?: { name: string };
}

export interface DailySale {
  date: string; // Format YYYY-MM-DD
  totalKg: number;
  totalRevenue: number;
}

export interface DashboardSummary {
  totalRevenueMonth: number;
  totalRevenueYear: number;
  activeBatches: number;
  readyToHarvestBatches: number;
  dailySales: DailySale[];
}