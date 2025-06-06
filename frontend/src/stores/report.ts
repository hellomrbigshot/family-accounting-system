import { defineStore } from 'pinia';
import { reportApi } from '@/api/report';
import type { ReportData } from '@/api/report';
import type { ExpenseQuery } from '@/api/expense';
import dayjs from '@/utils/dayjs';

interface ReportState {
  data: ReportData;
  loading: boolean;
  error: string | null;
}

const defaultReportData: ReportData = {
  expenses: {
    total: 0,
    byCategory: {},
    byPaymentMethod: {},
    byDate: {}
  },
  incomes: {
    total: 0,
    byCategory: {},
    byPaymentMethod: {},
    byDate: {}
  },
  balance: 0,
  trends: {
    daily: {},
    weekly: {},
    monthly: {}
  }
};

export const useReportStore = defineStore('report', {
  state: (): ReportState => ({
    data: defaultReportData,
    loading: false,
    error: null,
  }),

  getters: {
    expenseCategories: (state) => {
      return Object.entries(state.data.expenses.byCategory)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    },
    incomeCategories: (state) => {
      return Object.entries(state.data.incomes.byCategory)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    },
    paymentMethods: (state) => {
      return Object.entries(state.data.expenses.byPaymentMethod)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    },
    dailyTrends: (state) => {
      return Object.entries(state.data.trends.daily)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    weeklyTrends: (state) => {
      return Object.entries(state.data.trends.weekly)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    monthlyTrends: (state) => {
      return Object.entries(state.data.trends.monthly)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
  },

  actions: {
    async fetchReport(query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>) {
      this.loading = true;
      this.error = null;
      try {
        const data = await reportApi.getReport(query);
        this.data = data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取报表数据失败';
        this.data = defaultReportData;
      } finally {
        this.loading = false;
      }
    },

    async exportReport(query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>) {
      this.loading = true;
      this.error = null;
      try {
        const blob = await reportApi.exportReport(query);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${dayjs().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '导出报表失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 