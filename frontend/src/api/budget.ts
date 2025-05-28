import axios from '@/utils/axios';

export interface BudgetQuery {
  year: number;
  month: number;
}

export interface UpdateBudgetDto {
  amount: number;
  year: number;
  month: number;
}

class BudgetApi {
  private baseUrl = '/budgets';

  async getCurrent(query: BudgetQuery) {
    const response = await axios.get(`${this.baseUrl}/current`, { params: query });
    return response.data;
  }

  async update(data: UpdateBudgetDto) {
    const response = await axios.put(`${this.baseUrl}/current`, data);
    return response.data;
  }
}

export const budgetApi = new BudgetApi(); 