<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-lg font-medium mb-4">转账</h2>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="fromAccount" class="block text-sm font-medium text-gray-700">从账户</label>
            <select
              id="fromAccount"
              v-model="formData.fromAccountId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">请选择账户</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }} (余额: ¥{{ account.balance.toFixed(2) }})
              </option>
            </select>
          </div>

          <div>
            <label for="toAccount" class="block text-sm font-medium text-gray-700">到账户</label>
            <select
              id="toAccount"
              v-model="formData.toAccountId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">请选择账户</option>
              <option
                v-for="account in availableTargetAccounts"
                :key="account.id"
                :value="account.id"
              >
                {{ account.name }} (余额: ¥{{ account.balance.toFixed(2) }})
              </option>
            </select>
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">转账金额</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">¥</span>
              </div>
              <input
                type="number"
                id="amount"
                v-model="formData.amount"
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
              v-model="formData.remark"
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
            确认转账
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account, TransferDto } from '../api/account';

const props = defineProps<{
  accounts: Account[];
}>();

const emit = defineEmits<{
  (e: 'submit', data: TransferDto): void;
  (e: 'cancel'): void;
}>();

const formData = ref<TransferDto>({
  fromAccountId: '',
  toAccountId: '',
  amount: 0,
  remark: ''
});

const availableTargetAccounts = computed(() => {
  if (!formData.value.fromAccountId) return props.accounts;
  return props.accounts.filter(account => account.id !== formData.value.fromAccountId);
});

const isValid = computed(() => {
  if (!formData.value.fromAccountId || !formData.value.toAccountId || formData.value.amount <= 0) {
    return false;
  }
  const fromAccount = props.accounts.find(a => a.id === formData.value.fromAccountId);
  return fromAccount && fromAccount.balance >= formData.value.amount;
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script> 