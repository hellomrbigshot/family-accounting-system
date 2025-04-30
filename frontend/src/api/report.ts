import axios from 'axios';
import type { ExpenseQuery } from './expense';

export interface ReportData {
  expenses: {
    total: number;
    byCategory: Record<string, number>;
    byPaymentMethod: Record<string, number>;
    byDate: Record<string, number>;
  };
  incomes: {
    total: number;
    byCategory: Record<string, number>;
    byPaymentMethod: Record<string, number>;
    byDate: Record<string, number>;
  };
  balance: number;
  trends: {
    daily: Record<string, number>;
    weekly: Record<string, number>;
    monthly: Record<string, number>;
  };
}

class ReportApi {
  private baseUrl = '/api/reports';

  async getReport(query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>): Promise<ReportData> {
    const response = await axios.get(this.baseUrl, { params: query });
    return response.data;
  }

  async exportReport(query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>): Promise<Blob> {
    const response = await axios.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const reportApi = new ReportApi(); 