<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-lg font-medium mb-4">调整余额</h2>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">账户</label>
            <div class="mt-1 text-sm text-gray-900">
              {{ account.name }} (当前余额: ¥{{ account.balance.toFixed(2) }})
            </div>
          </div>

          <div>
            <label for="adjustmentType" class="block text-sm font-medium text-gray-700">调整类型</label>
            <select
              id="adjustmentType"
              v-model="adjustmentType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="increase">增加</option>
              <option value="decrease">减少</option>
            </select>
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">调整金额</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">¥</span>
              </div>
              <input
                type="number"
                id="amount"
                v-model="amount"
                min="0.01"
                step="0.01"
                class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label for="remark" class="block text-sm font-medium text-gray-700">备注</label>
            <textarea
              id="remark"
              v-model="remark"
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="emit('cancel')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            :disabled="!isValid"
          >
            确认调整
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account } from '@/api/account';

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits<{
  (e: 'submit', accountId: string, amount: number, remark?: string): void;
  (e: 'cancel'): void;
}>();

const adjustmentType = ref<'increase' | 'decrease'>('increase');
const amount = ref(0);
const remark = ref('');

const isValid = computed(() => {
  if (amount.value <= 0) return false;
  if (adjustmentType.value === 'decrease' && amount.value > props.account.balance) return false;
  return true;
});

const handleSubmit = () => {
  const adjustedAmount = adjustmentType.value === 'increase' ? amount.value : -amount.value;
  emit('submit', props.account.id, adjustedAmount, remark.value || undefined);
};
</script> 