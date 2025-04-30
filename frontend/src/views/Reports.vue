<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">报表分析</h1>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <label for="startDate" class="text-sm font-medium text-gray-700">开始日期</label>
          <input
            type="date"
            id="startDate"
            v-model="query.startDate"
            class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div class="flex items-center space-x-2">
          <label for="endDate" class="text-sm font-medium text-gray-700">结束日期</label>
          <input
            type="date"
            id="endDate"
            v-model="query.endDate"
            class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button
          @click="handleSearch"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          搜索
        </button>
        <button
          @click="handleExport"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          导出
        </button>
      </div>
    </div>

    <ReportOverview />
    <CategoryAnalysis />
    <TrendAnalysis />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useReportStore } from '@/stores/report';
import ReportOverview from '@/components/ReportOverview.vue';
import CategoryAnalysis from '@/components/CategoryAnalysis.vue';
import TrendAnalysis from '@/components/TrendAnalysis.vue';
import type { ExpenseQuery } from '@/api/expense';

const reportStore = useReportStore();

const query = reactive<Pick<ExpenseQuery, 'startDate' | 'endDate'>>({
  startDate: undefined,
  endDate: undefined,
});

const handleSearch = () => {
  reportStore.fetchReport(query);
};

const handleExport = () => {
  reportStore.exportReport(query);
};
</script> 