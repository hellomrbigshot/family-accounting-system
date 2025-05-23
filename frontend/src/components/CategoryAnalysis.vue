<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <h3 class="text-lg font-medium text-gray-900">支出分类</h3>
        <div class="mt-4">
          <div v-for="item in expenseCategories" :key="item.name" class="mb-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">{{ item.name }}</span>
              <span class="text-sm font-medium text-gray-900">
                ¥{{ item.amount.toFixed(2) }}
              </span>
            </div>
            <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-red-600 h-2 rounded-full"
                :style="{ width: `${(item.amount / totalExpense) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useReportStore } from '@/stores/report';

const reportStore = useReportStore();

const expenseCategories = computed(() => reportStore.expenseCategories);

const totalExpense = computed(() => {
  return expenseCategories.value.reduce((sum, item) => sum + item.amount, 0);
});
</script> 