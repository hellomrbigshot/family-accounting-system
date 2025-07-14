<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- 预算卡片 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">本月总览</h2>
          <van-button
            type="primary"
            size="small"
            @click="showBudgetDialog = true"
          >
            设置预算
          </van-button>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="text-gray-600">预算</span>
              <span class="text-lg font-medium text-gray-900">
                {{ formatAmount(budgetStore.currentBudget?.amount) }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-600">支出</span>
              <span :class="[
                'text-2xl font-bold',
                isOverBudget ? 'text-red-600' : 'text-gray-900'
              ]">
                {{ formatAmount(monthlyExpense) }}
              </span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="isOverBudget ? 'bg-red-600' : 'bg-indigo-600'"
              :style="{ width: `${actualProgress}%` }"
            />
          </div>
          <div class="text-sm text-gray-500 text-right">
            已使用 {{ actualProgress.toFixed(1) }}%
          </div>
        </div>
      </div>

      <!-- 最近支出 -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">最近支出</h2>
          <div class="flex space-x-2">
            <van-button
              type="default"
              size="small"
              @click="router.push('/expenses')"
            >
              查看全部
            </van-button>
            <van-button
              type="primary"
              size="small"
              @click="router.push('/categories')"
            >
              分类管理
            </van-button>
          </div>
        </div>
        <ExpenseList
          :expenses="expenseStore.recentExpenses"
          :show-refresh="true"
          :max-items="20"
          empty-text="7天内暂无支出"
          finished-text="只显示7天内近20条支出"
          @refresh="handleRefresh"
        />
      </div>
    </div>

    <!-- 悬浮按钮 -->
    <van-floating-bubble
      axis="xy"
      magnetic="x"
      :gap="{ x: 24, y: 60 }"
      @click="showAddExpenseDialog = true"
    >
      <van-icon name="plus" size="20" />
    </van-floating-bubble>

    <!-- 预算设置对话框 -->
    <BudgetDialog v-model:show="showBudgetDialog" />

    <!-- 添加支出对话框 -->
    <ExpenseForm 
      v-model:show="showAddExpenseDialog" 
      @success="handleRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { useTagStore } from '@/stores/tag';
import BudgetDialog from '@/components/BudgetDialog.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import ExpenseList from '@/components/ExpenseList.vue';
import type { ExpenseData } from '@/api/expense';

const router = useRouter();
const budgetStore = useBudgetStore();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

// 预算对话框
const showBudgetDialog = ref(false);

// 添加支出对话框
const showAddExpenseDialog = ref(false);

// 本月支出 - 使用本月支出数据计算
const monthlyExpense = computed(() => {
  return expenseStore.monthlyExpenses
    .reduce((sum: number, expense: ExpenseData) => sum + (expense.amount || 0), 0);
});

// 是否超出预算
const isOverBudget = computed(() => {
  if (!budgetStore.currentBudget) return false;
  return monthlyExpense.value > (budgetStore.currentBudget.amount || 0);
});

// 实际进度（可能超过100%）
const actualProgress = computed(() => {
  if (!budgetStore.currentBudget || !budgetStore.currentBudget.amount) return 0;
  return (monthlyExpense.value / budgetStore.currentBudget.amount) * 100;
});

// 格式化金额
const formatAmount = (amount?: number) => {
  if (!amount) return '¥0.00';
  return `¥${amount.toFixed(2)}`;
};

// 处理刷新 - 同时刷新本月和最近数据
const handleRefresh = async () => {
  try {
    await Promise.all([
      expenseStore.fetchMonthlyExpenses(),
      expenseStore.fetchRecentExpenses()
    ]);
  } catch (error) {
    console.error('Failed to refresh expenses:', error);
    showToast('刷新失败');
  }
};

onMounted(async () => {
  try {
    const now = dayjs();
    // 分别处理每个请求的错误
    try {
      await budgetStore.fetchCurrentBudget(now.year(), now.month() + 1);
    } catch (error) {
      console.error('Failed to fetch budget:', error);
      showToast('获取预算失败');
    }

    try {
      // 同时获取本月支出和最近支出数据
      await Promise.all([
        expenseStore.fetchMonthlyExpenses(),
        expenseStore.fetchRecentExpenses()
      ]);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      showToast('获取支出记录失败');
    }

    try {
      await categoryStore.fetchCategories();
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showToast('获取分类失败');
    }

    try {
      await tagStore.fetchTags();
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      showToast('获取标签失败');
    }
  } catch (error) {
    console.error('Failed to initialize:', error);
    showToast('初始化失败');
  }
});

// 监听月份变化，自动更新预算和本月支出数据
watch(() => dayjs().month(), async (newMonth) => {
  const now = dayjs();
  try {
    await Promise.all([
      budgetStore.fetchCurrentBudget(now.year(), newMonth + 1),
      expenseStore.fetchMonthlyExpenses()
    ]);
  } catch (error) {
    console.error('Failed to fetch budget or monthly expenses:', error);
    showToast('获取预算或本月支出失败');
  }
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
  @apply shadow-lg bg-indigo-600 border-indigo-600;
}

.van-floating-bubble:active {
  @apply shadow-xl bg-indigo-700 border-indigo-700;
}
</style> 