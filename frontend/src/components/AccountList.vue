<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">账户列表</h2>
      <button
        @click="$emit('add')"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        添加账户
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              账户名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类型
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              余额
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状态
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="account in accounts" :key="account.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ account.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': account.type === 'bank',
                  'bg-green-100 text-green-800': account.type === 'cash',
                  'bg-yellow-100 text-yellow-800': account.type === 'credit',
                  'bg-gray-100 text-gray-800': account.type === 'other'
                }"
              >
                {{ getAccountTypeLabel(account.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">¥{{ account.balance.toFixed(2) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': account.status === 'active',
                  'bg-red-100 text-red-800': account.status === 'inactive'
                }"
              >
                {{ account.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="$emit('edit', account)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                编辑
              </button>
              <button
                @click="$emit('delete', account.id)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Account } from '@/api/account';

defineProps<{
  accounts: Account[];
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'edit', account: Account): void;
  (e: 'delete', id: string): void;
}>();

const getAccountTypeLabel = (type: Account['type']) => {
  const typeLabels: Record<Account['type'], string> = {
    bank: '银行卡',
    cash: '现金',
    credit: '信用卡',
    other: '其他'
  };
  return typeLabels[type];
};
</script> 