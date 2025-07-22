import axios from '@/utils/axios';
import type { ExpenseQuery } from './expense';

export interface ReportData {
  expenses: {
    total: number;
    extraTotal: number;
    normalTotal: number;
    byCategory: Record<string, number>;
    byExtraCategory: Record<string, number>;
    byTag: Record<string, number>;
    byDate: Record<string, number>;
  };
  balance: number;
  trends: {
    expenses: Record<string, number>;
    extraExpenses: Record<string, number>;
    normalExpenses: Record<string, number>;
  };
}

class ReportApi {
  private baseUrl = '/reports';

  async getReport(query?: ExpenseQuery) {
    const response = await axios.get(this.baseUrl, { params: query });
    return response.data;
  }

  async exportReport(query?: ExpenseQuery) {
    const response = await axios.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob'
    });
    return response.data;
  }
}

export const reportApi = new ReportApi(); 