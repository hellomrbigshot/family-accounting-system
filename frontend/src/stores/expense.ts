import { defineStore } from 'pinia';
import { expenseApi } from '@/api/expense';
import type { ExpenseData, ExpenseQuery, ExpenseStats } from '@/api/expense';

interface ExpenseState {
  expenses: ExpenseData[];
  stats: ExpenseStats | null;
  loading: boolean;
  error: string | null;
}

export const useExpenseStore = defineStore('expense', {
  state: (): ExpenseState => ({
    expenses: [],
    stats: null,
    loading: false,
    error: null,
  }),

  getters: {
    totalExpense: (state) => state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
  },

  actions: {
    async fetchExpenses(query?: ExpenseQuery) {
      this.loading = true;
      this.error = null;
      try {
        const expenses = await expenseApi.getList(query);
        this.expenses = expenses;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取支出记录失败';
      } finally {
        this.loading = false;
      }
    },

    async createExpense(expense: Omit<ExpenseData, 'id' | 'createdAt'>) {
      this.loading = true;
      this.error = null;
      try {
        const newExpense = await expenseApi.create(expense);
        this.expenses.unshift(newExpense);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建支出记录失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getStatistics(query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>) {
      this.loading = true;
      this.error = null;
      try {
        this.stats = await expenseApi.getStats(query);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取统计数据失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 