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
    byTag: {},
    byDate: {}
  },
  balance: 0,
  trends: {
    expenses: {}
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
    expenseTags: (state) => {
      return Object.entries(state.data.expenses.byTag)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    },
    dailyTrends: (state) => {
      return Object.entries(state.data.trends.expenses)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    weeklyTrends: (state) => {
      const dailyData = Object.entries(state.data.trends.expenses)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // 按周聚合
      const weeklyMap = new Map<string, number>();
      
      dailyData.forEach(({ date, amount }) => {
        const d = new Date(date);
        // 获取该周的周一作为周标识
        const dayOfWeek = d.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(d);
        monday.setDate(d.getDate() - daysToMonday);
        const weekKey = monday.toISOString().split('T')[0];
        
        weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + amount);
      });
      
      return Array.from(weeklyMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    monthlyTrends: (state) => {
      const dailyData = Object.entries(state.data.trends.expenses)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // 按月聚合
      const monthlyMap = new Map<string, number>();
      
      dailyData.forEach(({ date, amount }) => {
        const d = new Date(date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);
      });
      
      return Array.from(monthlyMap.entries())
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