import { defineStore } from 'pinia';
import { budgetApi } from '@/api/budget';
import dayjs from '@/utils/dayjs';

interface BudgetState {
  currentBudget: {
    amount: number;
    year: number;
    month: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useBudgetStore = defineStore('budget', {
  state: (): BudgetState => ({
    currentBudget: null,
    loading: false,
    error: null
  }),

  getters: {
    isOverBudget: (state) => {
      if (!state.currentBudget?.amount) return false;
      return state.currentBudget.amount > 0;
    }
  },

  actions: {
    async fetchCurrentBudget(year?: number, month?: number) {
      this.loading = true;
      this.error = null;
      try {
        const now = dayjs();
        const targetYear = year || now.year();
        const targetMonth = month || now.month() + 1;
        
        const response = await budgetApi.getCurrent({
          year: targetYear,
          month: targetMonth
        });
        this.currentBudget = response;
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        this.error = '获取预算失败';
      } finally {
        this.loading = false;
      }
    },

    async updateBudget(amount: number, year?: number, month?: number) {
      this.loading = true;
      this.error = null;
      try {
        const now = dayjs();
        const targetYear = year || now.year();
        const targetMonth = month || now.month() + 1;
        
        const response = await budgetApi.update({
          amount,
          year: targetYear,
          month: targetMonth
        });
        this.currentBudget = response;
      } catch (error) {
        console.error('Failed to update budget:', error);
        this.error = '更新预算失败';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 