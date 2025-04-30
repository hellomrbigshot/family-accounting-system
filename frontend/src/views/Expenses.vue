<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">支出记录</h1>
      <button
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        新增支出
      </button>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700">开始日期</label>
          <div class="mt-1">
            <input
              type="date"
              id="startDate"
              v-model="query.startDate"
              class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700">结束日期</label>
          <div class="mt-1">
            <input
              type="date"
              id="endDate"
              v-model="query.endDate"
              class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          @click="handleSearch"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          搜索
        </button>
      </div>
    </div>

    <ExpenseList />

    <div v-if="showForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">新增支出</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">关闭</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ExpenseForm
          :categories="categories"
          :paymentMethods="paymentMethods"
          @success="handleSuccess"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import type { ExpenseQuery } from '@/api/expense';

const expenseStore = useExpenseStore();
const showForm = ref(false);

const categories = ['食品餐饮', '购物消费', '出行交通', '休闲娱乐', '医疗保健', '教育学习', '其他'];
const paymentMethods = ['支付宝', '微信', '银联', '现金'];

const query = reactive<ExpenseQuery>({
  startDate: undefined,
  endDate: undefined,
});

const handleSearch = () => {
  expenseStore.fetchExpenses(query);
};

const handleSuccess = () => {
  showForm.value = false;
  expenseStore.fetchExpenses(query);
};
</script> 