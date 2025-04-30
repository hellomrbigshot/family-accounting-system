import axios from './axios';

export interface Account {
  id: string;
  name: string;
  type: 'CASH' | 'BANK' | 'CREDIT_CARD' | 'INVESTMENT' | 'OTHER';
  balance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: 'CASH' | 'BANK' | 'CREDIT_CARD' | 'INVESTMENT' | 'OTHER';
  balance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  description?: string;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}

export interface TransferDto {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  remark?: string;
}

export interface AdjustBalanceDto {
  amount: number;
  remark?: string;
}

export const accountApi = {
  async getAll(): Promise<Account[]> {
    try {
      const response = await axios.get<Account[]>('/api/accounts');
      return response.data;
    } catch (error) {
      console.error('获取账户列表失败:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Account> {
    try {
      const response = await axios.get<Account>(`/api/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`获取账户 ${id} 失败:`, error);
      throw error;
    }
  },

  async create(data: CreateAccountDto): Promise<Account> {
    try {
      const response = await axios.post<Account>('/api/accounts', data);
      return response.data;
    } catch (error) {
      console.error('创建账户失败:', error);
      throw error;
    }
  },

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    try {
      const response = await axios.put<Account>(`/api/accounts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`更新账户 ${id} 失败:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`/api/accounts/${id}`);
    } catch (error) {
      console.error(`删除账户 ${id} 失败:`, error);
      throw error;
    }
  },

  async transfer(data: TransferDto): Promise<void> {
    try {
      await axios.post('/api/accounts/transfer', data);
    } catch (error) {
      console.error('转账失败:', error);
      throw error;
    }
  },

  async adjustBalance(id: string, data: AdjustBalanceDto): Promise<Account> {
    try {
      const response = await axios.post<Account>(`/api/accounts/${id}/adjust`, data);
      return response.data;
    } catch (error) {
      console.error(`调整账户 ${id} 余额失败:`, error);
      throw error;
    }
  }
}; 