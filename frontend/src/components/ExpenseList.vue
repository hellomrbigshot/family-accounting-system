<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="expense in expenses" :key="expense.id" class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ expense.category }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ expense.description }}
            </p>
          </div>
          <div class="flex-shrink-0 ml-4">
            <p class="text-sm font-medium text-gray-900">
              ¥{{ expense.amount.toFixed(2) }}
            </p>
            <p class="text-sm text-gray-500">
              {{ new Date(expense.date).toLocaleDateString() }}
            </p>
          </div>
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {{ expense.paymentMethod }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useExpenseStore } from '@/stores/expense';

const expenseStore = useExpenseStore();
const expenses = computed(() => expenseStore.expenses);
</script> 