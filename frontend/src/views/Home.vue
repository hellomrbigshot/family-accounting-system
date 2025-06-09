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
          :expenses="expenseStore.expenses"
          :show-refresh="true"
          :max-items="5"
          empty-text="最近7天暂无支出记录"
          finished-text="只显示最近7天支出记录"
          @refresh="handleRefresh"
        />
      </div>
    </div>

    <!-- 悬浮按钮 -->
    <van-floating-bubble
      axis="xy"
      magnetic="x"
      @click="showAddExpenseDialog = true"
    >
      <van-icon name="plus" size="20" />
    </van-floating-bubble>

    <!-- 预算设置对话框 -->
    <BudgetDialog v-model:show="showBudgetDialog" />

    <!-- 添加支出对话框 -->
    <AddExpenseDialog 
      v-model:show="showAddExpenseDialog" 
      @success="handleRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budget';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { useTagStore } from '@/stores/tag';
import dayjs from 'dayjs';
import BudgetDialog from '@/components/BudgetDialog.vue';
import AddExpenseDialog from '@/components/AddExpenseDialog.vue';
import ExpenseList from '@/components/ExpenseList.vue';
import type { CategoryData } from '@/api/category';
import type { ExpenseData } from '@/api/expense';
import type { TagData } from '@/api/tag';

interface ExpenseWithCategory {
  id: string;
  date: string;
  category: CategoryData;
  amount: number;
  description: string;
  createdAt: string;
  tags: TagData[];
}

const router = useRouter();
const budgetStore = useBudgetStore();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

// 预算对话框
const showBudgetDialog = ref(false);

// 添加支出对话框
const showAddExpenseDialog = ref(false);

// 本月统计数据
const monthlyStats = computed(() => {
  const now = dayjs();
  const startOfMonth = now.startOf('month').format('YYYY-MM-DD');
  const endOfMonth = now.endOf('month').format('YYYY-MM-DD');
  
  const totalExpense = expenses.value
    .filter(expense => {
      const date = dayjs(expense.date);
      return date.isAfter(startOfMonth) && date.isBefore(endOfMonth);
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
  // 暂时总收入为0，因为还没有实现收入功能
  const totalIncome = 0;
  
  return {
    totalExpense,
    totalIncome,
    balance: totalIncome - totalExpense
  };
});

// 格式化货币
const formatCurrency = (amount: number) => {
  return `¥${amount.toFixed(2)}`;
};

// 确保 expenseStore.expenses 的类型正确
const expenses = computed<ExpenseWithCategory[]>(() => {
  return expenseStore.expenses.map(expense => {
    const category = categoryStore.categories.find(c => c.id === expense.category) || {
      id: '',
      name: '未分类',
      type: 'expense',
      icon: '💰',
      color: '#e5e7eb',
      createdAt: dayjs().format()
    };

    const tags = expense.tags.map(tagId => 
      tagStore.tags.find(t => t.id === tagId) || {
        id: tagId,
        name: '未知标签',
        color: '#e5e7eb',
        createdAt: dayjs().format()
      }
    );

    return {
      id: expense.id,
      date: expense.date,
      category,
      amount: expense.amount,
      description: expense.description,
      createdAt: expense.createdAt,
      tags
    };
  });
});

// 本月支出
const monthlyExpense = computed(() => {
  if (!Array.isArray(expenses.value)) return 0
  
  const now = dayjs()
  const startOfMonth = now.startOf('month').format('YYYY-MM-DD')
  const endOfMonth = now.endOf('month').format('YYYY-MM-DD')
  
  return expenses.value
    .filter(expense => {
      const date = dayjs(expense.date)
      return date.isAfter(startOfMonth) && date.isBefore(endOfMonth)
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)
});

// 是否超出预算
const isOverBudget = computed(() => {
  if (!budgetStore.currentBudget) return false
  return monthlyExpense.value > (budgetStore.currentBudget.amount || 0)
});

// 预算使用进度
const budgetProgress = computed(() => {
  if (!budgetStore.currentBudget || !budgetStore.currentBudget.amount) return 0
  return Math.min((monthlyExpense.value / budgetStore.currentBudget.amount) * 100, 100)
});

// 实际进度（可能超过100%）
const actualProgress = computed(() => {
  if (!budgetStore.currentBudget || !budgetStore.currentBudget.amount) return 0
  return (monthlyExpense.value / budgetStore.currentBudget.amount) * 100
});

// 格式化金额
const formatAmount = (amount?: number) => {
  if (!amount) return '¥0.00';
  return `¥${amount.toFixed(2)}`;
};

// 返回上一页
const onClickLeft = () => {
  router.back()
};

// 处理刷新
const handleRefresh = async () => {
  try {
    const now = dayjs();
    const sevenDaysAgo = now.subtract(7, 'day');
    await expenseStore.fetchExpenses({
      startDate: sevenDaysAgo.format('YYYY-MM-DD'),
      endDate: now.format('YYYY-MM-DD')
    });
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
      const sevenDaysAgo = now.subtract(7, 'day');
      await expenseStore.fetchExpenses({
        startDate: sevenDaysAgo.format('YYYY-MM-DD'),
        endDate: now.format('YYYY-MM-DD')
      });
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

// 监听月份变化，自动更新预算
watch(() => dayjs().month(), async (newMonth) => {
  const now = dayjs();
  try {
    await budgetStore.fetchCurrentBudget(now.year(), newMonth + 1);
  } catch (error) {
    console.error('Failed to fetch budget:', error);
    showToast('获取预算失败');
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
  @apply shadow-lg;
}

.van-floating-bubble:active {
  @apply shadow-xl;
}
</style> 