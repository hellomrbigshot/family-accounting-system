<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-lg font-medium mb-4">{{ isEdit ? '编辑账户' : '添加账户' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">账户名称</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">账户类型</label>
            <select
              id="type"
              v-model="formData.type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="CASH">现金</option>
              <option value="BANK">银行卡</option>
              <option value="CREDIT_CARD">信用卡</option>
              <option value="INVESTMENT">投资账户</option>
              <option value="OTHER">其他</option>
            </select>
          </div>

          <div>
            <label for="balance" class="block text-sm font-medium text-gray-700">余额</label>
            <input
              type="number"
              id="balance"
              v-model="formData.balance"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">状态</label>
            <select
              id="status"
              v-model="formData.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="ACTIVE">启用</option>
              <option value="INACTIVE">停用</option>
              <option value="ARCHIVED">归档</option>
            </select>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
            <textarea
              id="description"
              v-model="formData.description"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
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
            >
              {{ isEdit ? '保存' : '添加' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Account } from '@/api/account';
import type { CreateAccountDto, UpdateAccountDto } from '@/api/account';

const props = defineProps<{
  account?: Account;
}>();

const emit = defineEmits<{
  (e: 'submit', data: CreateAccountDto | UpdateAccountDto): void;
  (e: 'cancel'): void;
}>();

const isEdit = ref(!!props.account);

type FormData = (CreateAccountDto | UpdateAccountDto) & { id?: string };

const formData = ref<FormData>({
  name: props.account?.name || '',
  type: props.account?.type || 'CASH',
  balance: props.account?.balance || 0,
  status: props.account?.status || 'ACTIVE',
  description: props.account?.description || '',
  ...(props.account?.id ? { id: props.account.id } : {})
});

watch(() => props.account, (newAccount) => {
  if (newAccount) {
    formData.value = {
      name: newAccount.name,
      type: newAccount.type,
      balance: newAccount.balance,
      status: newAccount.status,
      description: newAccount.description,
      id: newAccount.id
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  if (props.account?.id) {
    const { id, ...updateData } = formData.value;
    emit('submit', updateData);
  } else {
    const { id, ...createData } = formData.value;
    emit('submit', createData);
  }
};
</script> 