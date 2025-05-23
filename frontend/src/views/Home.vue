<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-4">
      <!-- 欢迎区域 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">家庭记账</h1>
        <p class="text-gray-600">今天是 {{ currentDate }}</p>
      </div>

      <!-- 预算信息 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">本月预算</h2>
          <van-button size="small" type="primary" @click="showBudgetDialog = true">
            设置预算
          </van-button>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="text-gray-600">预算</span>
              <span class="text-lg font-medium text-gray-900">¥{{ budgetStore.currentBudget?.amount.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-600">支出</span>
              <span :class="[
                'text-2xl font-bold',
                isOverBudget ? 'text-red-600' : 'text-gray-900'
              ]">¥{{ monthlyExpense.toFixed(2) }}</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full"
              :class="isOverBudget ? 'bg-red-600' : 'bg-indigo-600'"
              :style="{ width: `${budgetProgress}%` }"
            />
          </div>
          <div class="text-sm text-gray-500 text-right">
            已使用 {{ budgetProgress.toFixed(1) }}%
          </div>
        </div>
      </div>

      <!-- 功能卡片区域 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <router-link to="/expenses" class="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
          <van-icon name="balance-o" size="32" class="text-indigo-600 mb-2" />
          <span class="text-gray-900 font-medium">支出记录</span>
        </router-link>
        <router-link to="/categories" class="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
          <van-icon name="apps-o" size="32" class="text-indigo-600 mb-2" />
          <span class="text-gray-900 font-medium">分类管理</span>
        </router-link>
      </div>

      <!-- 最近支出 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">最近支出</h2>
          <router-link to="/expenses" class="text-sm text-indigo-600">查看全部</router-link>
        </div>
        <ExpenseList :expenses="recentExpenses" />
      </div>
    </div>

    <!-- 新增支出表单弹窗 -->
    <ExpenseForm
      v-model:show="showForm"
      @success="handleSuccess"
    />

    <!-- 记一笔按钮 -->
    <van-floating-bubble
      axis="xy"
      magnetic="x"
      :style="{
        right: '20px',
        bottom: '20px',
      }"
      @click="showForm = true"
    >
      <div class="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full shadow-lg">
        <van-icon name="plus" size="24" color="#fff" />
      </div>
    </van-floating-bubble>

    <!-- 预算设置弹窗 -->
    <van-dialog
      v-model:show="showBudgetDialog"
      title="设置预算"
      show-cancel-button
      @confirm="handleBudgetUpdate"
    >
      <div class="p-4 space-y-4">
        <van-field
          v-model="budgetAmount"
          type="number"
          label="预算金额"
          placeholder="请输入预算金额"
          :rules="[{ required: true, message: '请输入预算金额' }]"
        />
        <van-field
          v-model="budgetYear"
          type="number"
          label="年份"
          placeholder="请输入年份"
          :rules="[{ required: true, message: '请输入年份' }]"
        />
        <van-field
          v-model="budgetMonth"
          type="number"
          label="月份"
          placeholder="请输入月份"
          :rules="[
            { required: true, message: '请输入月份' },
            { validator: validateMonth, message: '月份必须在1-12之间' }
          ]"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useBudgetStore } from '@/stores/budget';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import dayjs from '@/utils/dayjs';

const expenseStore = useExpenseStore();
const budgetStore = useBudgetStore();
const showForm = ref(false);
const showBudgetDialog = ref(false);
const budgetAmount = ref('');
const budgetYear = ref(dayjs().year().toString());
const budgetMonth = ref((dayjs().month() + 1).toString());

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日');
});

// 本月支出
const monthlyExpense = computed(() => {
  const now = dayjs();
  const startOfMonth = now.startOf('month').format('YYYY-MM-DD');
  const endOfMonth = now.endOf('month').format('YYYY-MM-DD');
  
  return expenseStore.expenses
    .filter(expense => {
      const date = dayjs(expense.date);
      return date.isAfter(startOfMonth) && date.isBefore(endOfMonth);
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
});

// 是否超出预算
const isOverBudget = computed(() => {
  if (!budgetStore.currentBudget?.amount) return false;
  return monthlyExpense.value > budgetStore.currentBudget.amount;
});

// 预算使用进度
const budgetProgress = computed(() => {
  if (!budgetStore.currentBudget?.amount) return 0;
  return (monthlyExpense.value / budgetStore.currentBudget.amount) * 100;
});

// 最近支出（最近5条）
const recentExpenses = computed(() => {
  return expenseStore.expenses.slice(0, 5);
});

const validateMonth = (val: string) => {
  const month = parseInt(val);
  return month >= 1 && month <= 12;
};

const handleSuccess = () => {
  showForm.value = false;
  fetchExpenses();
};

const handleBudgetUpdate = async () => {
  try {
    await budgetStore.updateBudget(
      parseFloat(budgetAmount.value),
      parseInt(budgetYear.value),
      parseInt(budgetMonth.value)
    );
    showBudgetDialog.value = false;
  } catch (error) {
    console.error('Failed to update budget:', error);
  }
};

const fetchExpenses = async () => {
  try {
    // 获取最近一周的支出
    const end = dayjs();
    const start = end.subtract(6, 'day');
    await expenseStore.fetchExpenses({
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    });
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
  }
};

onMounted(async () => {
  await Promise.all([
    fetchExpenses(),
    budgetStore.fetchCurrentBudget()
  ]);
});
</script>

<style>
.van-button--primary {
  @apply bg-indigo-600 border-indigo-600;
}

.van-button--primary:active {
  @apply bg-indigo-700 border-indigo-700;
}

.van-floating-bubble {
  @apply shadow-lg;
}

.van-floating-bubble:active {
  @apply shadow-xl;
}
</style> 