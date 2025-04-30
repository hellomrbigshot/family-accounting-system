<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">趋势分析</h3>
        <div class="flex space-x-2">
          <button
            @click="currentTrend = 'daily'"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentTrend === 'daily'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            日
          </button>
          <button
            @click="currentTrend = 'weekly'"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentTrend === 'weekly'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            周
          </button>
          <button
            @click="currentTrend = 'monthly'"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentTrend === 'monthly'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            月
          </button>
        </div>
      </div>

      <div class="mt-4">
        <div class="h-64 flex items-end space-x-1">
          <div
            v-for="item in currentTrendData"
            :key="item.date"
            class="flex-1 flex flex-col items-center"
          >
            <div class="w-full flex justify-center space-x-1">
              <div
                class="w-1/2 bg-red-600 rounded-t"
                :style="{ height: `${(item.amount / maxAmount) * 100}%` }"
              />
              <div
                class="w-1/2 bg-green-600 rounded-t"
                :style="{ height: `${(item.amount / maxAmount) * 100}%` }"
              />
            </div>
            <div class="mt-2 text-xs text-gray-500">
              {{ formatDate(item.date) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReportStore } from '@/stores/report';

const reportStore = useReportStore();
const currentTrend = ref<'daily' | 'weekly' | 'monthly'>('daily');

const currentTrendData = computed(() => {
  switch (currentTrend.value) {
    case 'daily':
      return reportStore.dailyTrends;
    case 'weekly':
      return reportStore.weeklyTrends;
    case 'monthly':
      return reportStore.monthlyTrends;
  }
});

const maxAmount = computed(() => {
  return Math.max(...currentTrendData.value.map(item => item.amount));
});

const formatDate = (date: string) => {
  const d = new Date(date);
  switch (currentTrend.value) {
    case 'daily':
      return `${d.getMonth() + 1}/${d.getDate()}`;
    case 'weekly':
      return `第${Math.ceil(d.getDate() / 7)}周`;
    case 'monthly':
      return `${d.getFullYear()}/${d.getMonth() + 1}`;
  }
};
</script> 