import { defineStore } from 'pinia';
import { ref } from 'vue';
import { expenseApi } from '@/api/expense';
import { showToast } from 'vant';
import type { ExpenseData, ExpenseQuery, ExpenseStats } from '@/api/expense';

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<ExpenseData[]>([]);
  const stats = ref<ExpenseStats | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const totalExpense = () => expenses.value.reduce((sum, expense) => sum + expense.amount, 0);

  const fetchExpenses = async (query?: ExpenseQuery) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await expenseApi.getList(query);
      expenses.value = response;
      return true;
    } catch (error) {
      console.error('获取支出列表失败:', error);
      showToast('获取支出列表失败');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const createExpense = async (expense: Omit<ExpenseData, 'id' | 'createdAt'>) => {
    loading.value = true;
    error.value = null;
    try {
      if (expense.amount <= 0) {
        showToast('支出金额必须大于0');
        return false;
      }

      const response = await expenseApi.create(expense);
      expenses.value.unshift(response);
      showToast('添加支出成功');
      return true;
    } catch (error) {
      console.error('添加支出失败:', error);
      showToast('添加支出失败');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchStats = async (query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await expenseApi.getStats(query);
      stats.value = response;
      return true;
    } catch (error) {
      console.error('获取支出统计失败:', error);
      showToast('获取支出统计失败');
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    expenses,
    stats,
    loading,
    error,
    totalExpense,
    fetchExpenses,
    createExpense,
    fetchStats
  };
}); 