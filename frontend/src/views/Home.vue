<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 欢迎区域 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">欢迎回来</h1>
      <p class="text-gray-600">今天是 {{ currentDate }}</p>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">本月支出</p>
            <p class="text-2xl font-bold text-indigo-600">¥{{ formatNumber(monthlyExpenses) }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">分类数量</p>
            <p class="text-2xl font-bold text-indigo-600">{{ categoryCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <router-link to="/expenses/new" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">记一笔</h3>
          <p class="text-sm text-gray-500">快速记录支出</p>
        </div>
      </router-link>

      <router-link to="/categories" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">分类管理</h3>
          <p class="text-sm text-gray-500">管理支出分类</p>
        </div>
      </router-link>
    </div>

    <!-- 最近交易 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">最近交易</h2>
        <router-link to="/expenses" class="text-sm text-indigo-600 hover:text-indigo-500">查看全部</router-link>
      </div>
      <div class="space-y-4">
        <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ transaction.category }}</p>
              <p class="text-sm text-gray-500">{{ transaction.date }}</p>
            </div>
          </div>
          <p class="font-medium text-indigo-600">-¥{{ formatNumber(transaction.amount) }}</p>
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
const monthlyExpenses = ref(5000);
const categoryCount = ref(8);

// 最近交易记录
interface Transaction {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const recentTransactions = ref<Transaction[]>([
  {
    id: 1,
    category: '餐饮',
    amount: 128.5,
    date: '2024-04-28'
  },
  {
    id: 2,
    category: '购物',
    amount: 299,
    date: '2024-04-24'
  },
  {
    id: 3,
    category: '交通',
    amount: 50,
    date: '2024-04-23'
  }
]);
</script> 