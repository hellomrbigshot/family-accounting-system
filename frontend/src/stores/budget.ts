import { defineStore } from 'pinia';
import { ref } from 'vue';
import { budgetApi } from '@/api/budget';
import { showToast } from 'vant';
import type { Budget } from '@/types/budget';

const defaultBudget: Budget = {
  amount: 0,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

export const useBudgetStore = defineStore('budget', () => {
  const currentBudget = ref<{
    amount: number
    year: number
    month: number
  } | null>(null);

  const fetchCurrentBudget = async (year: number, month: number) => {
    try {
      const response = await budgetApi.getCurrent({ year, month });
      currentBudget.value = response;
      return true;
    } catch (error) {
      console.error('获取预算失败:', error);
      showToast('获取预算失败');
      return false;
    }
  };

  const updateBudget = async (amount: number, year: number, month: number) => {
    try {
      if (amount <= 0) {
        showToast('预算金额必须大于0');
        return false;
      }

      const response = await budgetApi.update({
        amount,
        year,
        month
      });
      currentBudget.value = response;
      showToast('预算设置成功');
      return true;
    } catch (error) {
      console.error('设置预算失败:', error);
      showToast('设置预算失败');
      return false;
    }
  };

  return {
    currentBudget,
    fetchCurrentBudget,
    updateBudget
  };
}); 