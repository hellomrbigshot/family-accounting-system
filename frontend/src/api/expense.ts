import axios from '@/utils/axios'

export interface ExpenseData {
  id: string
  date: string
  category: string
  amount: number
  description: string
  createdAt: string
  tags: string[]
}

export interface ExpenseQuery {
  startDate?: string
  endDate?: string
  category?: string
  tags?: string[]
}

export interface ExpenseStats {
  total: number
  byCategory: Record<string, number>
  byDate: Record<string, number>
  byTag: Record<string, number>
}

class ExpenseApi {
  private baseUrl = '/expenses'

  async getList(query?: ExpenseQuery) {
    const response = await axios.get(this.baseUrl, { params: query })
    return response.data
  }

  async create(expense: Omit<ExpenseData, 'id' | 'createdAt'>) {
    const response = await axios.post(this.baseUrl, expense)
    return response.data
  }

  async getStats(query?: ExpenseQuery) {
    const response = await axios.get(`${this.baseUrl}/stats`, { params: query })
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

export const expenseApi = new ExpenseApi() 