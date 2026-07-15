import axios from '@/utils/axios'

export interface ExpenseData {
  id: string
  date: string
  category: string
  amount: number
  description: string
  createdAt: string
  tags: string[]
  isExtra: boolean
}

export interface ExpenseQuery {
  startDate?: string
  endDate?: string
  category?: string
  categories?: string[]
  tags?: string[]
  isExtra?: boolean
  minAmount?: number
  maxAmount?: number
  amountOperator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  amountValue?: number
  description?: string
  page?: number
  pageSize?: number
}

export interface ExpenseListPagination {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface ExpenseListSummary {
  count: number
  totalAmount: number
}

export interface ExpensePaginatedResponse {
  list: ExpenseData[]
  pagination: ExpenseListPagination
  summary: ExpenseListSummary
}

export type ExpenseListResponse = ExpenseData[] | ExpensePaginatedResponse

export interface ExpenseStats {
  total: number
  byCategory: Record<string, number>
  byDate: Record<string, number>
  byTag: Record<string, number>
}

export type ExpenseCategoryStatRow = {
  _id: string
  total: number
}

export type ExpenseDateStatRow = {
  _id: string
  total: number
}

export type ExpenseStatsResponse = {
  categoryStats: ExpenseCategoryStatRow[]
  dateStats: ExpenseDateStatRow[]
}

export const isExpensePaginatedResponse = (
  data: ExpenseListResponse
): data is ExpensePaginatedResponse => {
  return !Array.isArray(data) && Array.isArray(data.list)
}

class ExpenseApi {
  private baseUrl = '/expenses'

  async getList(query?: ExpenseQuery): Promise<ExpenseListResponse> {
    const response = await axios.get(this.baseUrl, { params: query })
    return response.data
  }

  async create(expense: Omit<ExpenseData, 'id' | 'createdAt'>) {
    const response = await axios.post(this.baseUrl, expense)
    return response.data
  }

  async update(id: string, expense: Omit<ExpenseData, 'id' | 'createdAt'>) {
    const response = await axios.put(`${this.baseUrl}/${id}`, expense)
    return response.data
  }

  async getStats(query?: ExpenseQuery) {
    const response = await axios.get(`${this.baseUrl}/stats`, { params: query })
    return response.data as ExpenseStatsResponse
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`)
  }
}

export const expenseApi = new ExpenseApi()
