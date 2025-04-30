<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 欢迎区域 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">欢迎回来</h1>
      <p class="text-gray-600">今天是 {{ currentDate }}</p>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">总资产</p>
            <p class="text-2xl font-bold text-gray-900">¥{{ formatNumber(totalAssets) }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">本月支出</p>
            <p class="text-2xl font-bold text-red-500">¥{{ formatNumber(monthlyExpenses) }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">本月收入</p>
            <p class="text-2xl font-bold text-green-500">¥{{ formatNumber(monthlyIncome) }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">账户数量</p>
            <p class="text-2xl font-bold text-gray-900">{{ accountCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <router-link to="/expenses/new" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">记一笔</h3>
          <p class="text-sm text-gray-500">快速记录收支</p>
        </div>
      </router-link>

      <router-link to="/accounts" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">账户管理</h3>
          <p class="text-sm text-gray-500">管理您的账户</p>
        </div>
      </router-link>

      <router-link to="/reports" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">报表分析</h3>
          <p class="text-sm text-gray-500">查看收支分析</p>
        </div>
      </router-link>

      <router-link to="/categories" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">分类管理</h3>
          <p class="text-sm text-gray-500">管理收支分类</p>
        </div>
      </router-link>
    </div>

    <!-- 最近交易和账户余额 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 最近交易 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">最近交易</h2>
          <router-link to="/expenses" class="text-sm text-blue-600 hover:text-blue-500">查看全部</router-link>
        </div>
        <div class="space-y-4">
          <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                transaction.type === 'expense' ? 'bg-red-50' : 'bg-green-50'
              ]">
                <svg :class="[
                  'w-5 h-5',
                  transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                ]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path v-if="transaction.type === 'expense'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ transaction.category }}</p>
                <p class="text-sm text-gray-500">{{ transaction.date }}</p>
              </div>
            </div>
            <p :class="[
              'font-medium',
              transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
            ]">
              {{ transaction.type === 'expense' ? '-' : '+' }}¥{{ formatNumber(transaction.amount) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 账户余额 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">账户余额</h2>
          <router-link to="/accounts" class="text-sm text-blue-600 hover:text-blue-500">管理账户</router-link>
        </div>
        <div class="space-y-4">
          <div v-for="account in accounts" :key="account.id" class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ account.name }}</p>
                <p class="text-sm text-gray-500">{{ account.type }}</p>
              </div>
            </div>
            <p class="font-medium text-gray-900">¥{{ formatNumber(account.balance) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日');
});

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 模拟数据
const totalAssets = ref(100000);
const monthlyExpenses = ref(5000);
const monthlyIncome = ref(8000);
const accountCount = ref(3);

// 最近交易记录
interface Transaction {
  id: number;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  date: string;
}

const recentTransactions = ref<Transaction[]>([
  {
    id: 1,
    type: 'expense',
    category: '餐饮',
    amount: 128.5,
    date: '2024-04-28'
  },
  {
    id: 2,
    type: 'income',
    category: '工资',
    amount: 8000,
    date: '2024-04-25'
  },
  {
    id: 3,
    type: 'expense',
    category: '购物',
    amount: 299,
    date: '2024-04-24'
  }
]);

// 账户列表
interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

const accounts = ref<Account[]>([
  {
    id: 1,
    name: '现金',
    type: '现金账户',
    balance: 5000
  },
  {
    id: 2,
    name: '支付宝',
    type: '电子钱包',
    balance: 30000
  },
  {
    id: 3,
    name: '工资卡',
    type: '储蓄卡',
    balance: 65000
  }
]);
</script> 