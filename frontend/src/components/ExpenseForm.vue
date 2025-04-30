<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="date" class="block text-sm font-medium text-gray-700">日期</label>
      <div class="mt-1">
        <input
          type="date"
          id="date"
          v-model="form.date"
          required
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700">类别</label>
      <div class="mt-1">
        <select
          id="category"
          v-model="form.category"
          required
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label for="amount" class="block text-sm font-medium text-gray-700">金额</label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">¥</span>
        </div>
        <input
          type="number"
          id="amount"
          v-model="form.amount"
          required
          min="0"
          step="0.01"
          class="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div>
      <label for="paymentMethod" class="block text-sm font-medium text-gray-700">支付方式</label>
      <div class="mt-1">
        <select
          id="paymentMethod"
          v-model="form.paymentMethod"
          required
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option v-for="method in paymentMethods" :key="method" :value="method">
            {{ method }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
      <div class="mt-1">
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        取消
      </button>
      <button
        type="submit"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        保存
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useExpenseStore } from '@/stores/expense';

const props = defineProps<{
  categories: string[];
  paymentMethods: string[];
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const expenseStore = useExpenseStore();

const form = reactive({
  date: new Date().toISOString().split('T')[0],
  category: '',
  amount: 0,
  paymentMethod: '',
  description: '',
});

const handleSubmit = async () => {
  try {
    await expenseStore.createExpense({
      ...form,
      amount: Number(form.amount),
    });
    emit('success');
  } catch (error) {
    console.error('Failed to create expense:', error);
  }
};
</script> 