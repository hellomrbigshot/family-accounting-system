import axios from 'axios';

export interface ExpenseData {
  id: string;
  date: string;
  category: string;
  amount: number;
  paymentMethod: string;
  description: string;
  createdAt: string;
}

export interface ExpenseQuery {
  startDate?: string;
  endDate?: string;
  category?: string;
  paymentMethod?: string;
}

export interface ExpenseStats {
  total: number;
  byCategory: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  byDate: Record<string, number>;
}

class ExpenseApi {
  private baseUrl = '/api/expenses';

  async getList(query?: ExpenseQuery): Promise<ExpenseData[]> {
    const response = await axios.get(this.baseUrl, { params: query });
    return response.data;
  }

  async create(expense: Omit<ExpenseData, 'id' | 'createdAt'>): Promise<ExpenseData> {
    const response = await axios.post(this.baseUrl, expense);
    return response.data;
  }

  async getStats(query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>): Promise<ExpenseStats> {
    const response = await axios.get(`${this.baseUrl}/stats`, { params: query });
    return response.data;
  }
}

export const expenseApi = new ExpenseApi(); 