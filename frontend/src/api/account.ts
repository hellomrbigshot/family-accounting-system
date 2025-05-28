import axios from '@/utils/axios'

export interface Account {
  id: string
  name: string
  type: 'cash' | 'bank' | 'credit'
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface CreateAccountDto {
  name: string
  type: 'cash' | 'bank' | 'credit'
  balance: number
  currency: string
}

export interface UpdateAccountDto {
  name?: string
  type?: 'cash' | 'bank' | 'credit'
  currency?: string
}

export interface TransferDto {
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
}

export interface AdjustBalanceDto {
  amount: number
  description?: string
}

class AccountApi {
  private baseUrl = '/accounts'

  async getAll() {
    const response = await axios.get(this.baseUrl)
    return response.data
  }

  async getById(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(account: CreateAccountDto) {
    const response = await axios.post(this.baseUrl, account)
    return response.data
  }

  async update(id: string, account: UpdateAccountDto) {
    const response = await axios.put(`${this.baseUrl}/${id}`, account)
    return response.data
  }

  async delete(id: string) {
    await axios.delete(`${this.baseUrl}/${id}`)
  }

  async transfer(data: TransferDto) {
    const response = await axios.post(`${this.baseUrl}/transfer`, data)
    return response.data
  }

  async adjustBalance(id: string, data: AdjustBalanceDto) {
    const response = await axios.post(`${this.baseUrl}/${id}/adjust`, data)
    return response.data
  }
}

export const accountApi = new AccountApi() 