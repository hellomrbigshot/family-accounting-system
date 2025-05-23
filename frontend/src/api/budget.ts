import axios from '@/utils/axios';

export interface BudgetData {
  id: string;
  year: number;
  month: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetQuery {
  year?: number;
  month?: number;
}

class BudgetApi {
  private baseUrl = '/budgets';

  async getCurrent(): Promise<BudgetData> {
    const response = await axios.get(`${this.baseUrl}/current`);
    return response.data;
  }

  async update(amount: number): Promise<BudgetData> {
    const response = await axios.put(`${this.baseUrl}/current`, { amount });
    return response.data;
  }
}

export const budgetApi = new BudgetApi(); 