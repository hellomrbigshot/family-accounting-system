import { defineStore } from 'pinia';
import { ref } from 'vue';
import { expenseApi } from '@/api/expense';
import type { ExpenseData, ExpenseQuery, ExpenseStats } from '@/api/expense';
import dayjs from '@/utils/dayjs';

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<ExpenseData[]>([]);
  const monthlyExpenses = ref<ExpenseData[]>([]); // 本月支出数据
  const recentExpenses = ref<ExpenseData[]>([]); // 最近支出数据
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

  // 获取本月支出数据
  const fetchMonthlyExpenses = async () => {
    loading.value = true;
    error.value = null;
    try {
      const now = dayjs();
      const startOfMonth = now.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = now.endOf('month').format('YYYY-MM-DD');
      
      const response = await expenseApi.getList({
        startDate: startOfMonth,
        endDate: endOfMonth
      });
      monthlyExpenses.value = response;
      return true;
    } catch (error) {
      console.error('获取本月支出失败:', error);
      showToast('获取本月支出失败');
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 获取最近支出数据
  const fetchRecentExpenses = async () => {
    loading.value = true;
    error.value = null;
    try {
      const now = dayjs();
      const sevenDaysAgo = now.subtract(7, 'day');
      
      const response = await expenseApi.getList({
        startDate: sevenDaysAgo.format('YYYY-MM-DD'),
        endDate: now.format('YYYY-MM-DD')
      });
      recentExpenses.value = response;
      return true;
    } catch (error) {
      console.error('获取最近支出失败:', error);
      showToast('获取最近支出失败');
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

      await expenseApi.create(expense);
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

  const updateExpense = async (id: string, expense: Omit<ExpenseData, 'id' | 'createdAt'>) => {
    loading.value = true;
    error.value = null;
    try {
      if (expense.amount <= 0) {
        showToast('支出金额必须大于0');
        return false;
      }

      await expenseApi.update(id, expense);
      showToast('更新支出成功');
      return true;
    } catch (error) {
      console.error('更新支出失败:', error);
      showToast('更新支出失败');
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

  const deleteExpense = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await expenseApi.delete(id);
      return true;
    } catch (error) {
      console.error('删除支出记录失败:', error);
      showToast('删除支出记录失败');
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    expenses,
    monthlyExpenses,
    recentExpenses,
    stats,
    loading,
    error,
    totalExpense,
    fetchExpenses,
    fetchMonthlyExpenses,
    fetchRecentExpenses,
    createExpense,
    updateExpense,
    fetchStats,
    deleteExpense
  };
}); 