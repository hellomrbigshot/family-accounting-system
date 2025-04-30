<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">账户管理</h1>
      <div class="space-x-4">
        <button
          @click="showTransferDialog = true"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          转账
        </button>
        <button
          @click="showForm = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          添加账户
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
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
                  'bg-blue-100 text-blue-800': account.type === 'BANK',
                  'bg-green-100 text-green-800': account.type === 'CASH',
                  'bg-yellow-100 text-yellow-800': account.type === 'CREDIT_CARD',
                  'bg-gray-100 text-gray-800': account.type === 'OTHER'
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
                  'bg-green-100 text-green-800': account.status === 'ACTIVE',
                  'bg-red-100 text-red-800': account.status === 'INACTIVE'
                }"
              >
                {{ account.status === 'ACTIVE' ? '启用' : '停用' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editAccount(account)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                编辑
              </button>
              <button
                @click="showAdjustBalance(account)"
                class="text-green-600 hover:text-green-900"
              >
                调整余额
              </button>
              <button
                @click="deleteAccount(account.id)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AccountForm
      v-if="showForm"
      :account="currentAccount"
      @submit="handleSubmit"
      @cancel="() => {
        showForm = false;
        currentAccount = undefined;
      }"
    />

    <TransferDialog
      v-if="showTransferDialog"
      :accounts="accounts"
      @submit="handleTransfer"
      @cancel="showTransferDialog = false"
    />

    <AdjustBalanceDialog
      v-if="showAdjustBalanceDialog && selectedAccount"
      :account="selectedAccount"
      @submit="handleAdjustBalance"
      @cancel="showAdjustBalanceDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { accountApi, type Account, type CreateAccountDto, type UpdateAccountDto, type TransferDto } from '@/api/account';
import AccountForm from '@/components/AccountForm.vue';
import TransferDialog from '@/components/TransferDialog.vue';
import AdjustBalanceDialog from '@/components/AdjustBalanceDialog.vue';

const accounts = ref<Account[]>([]);
const showForm = ref(false);
const showTransferDialog = ref(false);
const showAdjustBalanceDialog = ref(false);
const currentAccount = ref<Account | undefined>(undefined);
const selectedAccount = ref<Account | undefined>(undefined);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchAccounts = async () => {
  loading.value = true;
  error.value = null;
  try {
    accounts.value = await accountApi.getAll();
  } catch (err) {
    error.value = '获取账户列表失败';
    console.error('Failed to fetch accounts:', err);
  } finally {
    loading.value = false;
  }
};

const editAccount = (account: Account) => {
  currentAccount.value = account;
  showForm.value = true;
};

const showAdjustBalance = (account: Account) => {
  selectedAccount.value = account;
  showAdjustBalanceDialog.value = true;
};

const deleteAccount = async (id: string) => {
  if (!confirm('确定要删除这个账户吗？')) return;
  
  loading.value = true;
  error.value = null;
  try {
    await accountApi.delete(id);
    await fetchAccounts();
  } catch (err) {
    error.value = '删除账户失败';
    console.error('Failed to delete account:', err);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (data: CreateAccountDto | UpdateAccountDto) => {
  loading.value = true;
  error.value = null;
  try {
    if ('id' in data && typeof data.id === 'string') {
      await accountApi.update(data.id, data as UpdateAccountDto);
    } else {
      await accountApi.create(data as CreateAccountDto);
    }
    showForm.value = false;
    currentAccount.value = undefined;
    await fetchAccounts();
  } catch (err) {
    error.value = '保存账户失败';
    console.error('Failed to save account:', err);
  } finally {
    loading.value = false;
  }
};

const handleTransfer = async (data: TransferDto) => {
  loading.value = true;
  error.value = null;
  try {
    await accountApi.transfer(data);
    showTransferDialog.value = false;
    await fetchAccounts();
  } catch (err) {
    error.value = '转账失败';
    console.error('Failed to transfer:', err);
  } finally {
    loading.value = false;
  }
};

const handleAdjustBalance = async (accountId: string, amount: number, remark?: string) => {
  loading.value = true;
  error.value = null;
  try {
    await accountApi.adjustBalance(accountId, { amount, remark });
    showAdjustBalanceDialog.value = false;
    selectedAccount.value = undefined;
    await fetchAccounts();
  } catch (err) {
    error.value = '调整余额失败';
    console.error('Failed to adjust balance:', err);
  } finally {
    loading.value = false;
  }
};

const getAccountTypeLabel = (type: Account['type']) => {
  const typeLabels: Record<Account['type'], string> = {
    CASH: '现金',
    BANK: '银行卡',
    CREDIT_CARD: '信用卡',
    INVESTMENT: '投资账户',
    OTHER: '其他'
  };
  return typeLabels[type];
};

const getAccountStatusLabel = (status: Account['status']) => {
  const statusLabels: Record<Account['status'], string> = {
    ACTIVE: '活跃',
    INACTIVE: '停用',
    ARCHIVED: '归档'
  };
  return statusLabels[status];
};

onMounted(() => {
  fetchAccounts();
});
</script> 