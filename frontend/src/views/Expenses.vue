<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-4">
      <!-- 欢迎区域 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">支出记录</h1>
        <p class="text-gray-600">今天是 {{ currentDate }}</p>
      </div>

      <!-- 顶部搜索栏 -->
      <div class="sticky top-0 z-10 bg-white shadow-sm">
        <div class="p-4">
          <div class="flex items-center space-x-2">
            <van-search
              v-model="searchQuery"
              placeholder="搜索支出记录"
              shape="round"
              background="transparent"
            />
          </div>
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="grid grid-cols-2 gap-4">
          <van-field
            v-model="query.startDate"
            readonly
            is-link
            placeholder="开始日期"
            @click="showStartDatePicker = true"
          />
          <van-field
            v-model="query.endDate"
            readonly
            is-link
            placeholder="结束日期"
            @click="showEndDatePicker = true"
          />
        </div>

        <div class="mt-4">
          <van-button size="small" type="primary" @click="handleSearch">
            搜索
          </van-button>
        </div>
      </div>

      <!-- 支出列表 -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">支出记录</h2>
        </div>

        <ExpenseList :expenses="filteredExpenses" @refresh="fetchExpenses" />
      </div>

      <!-- 新增支出表单弹窗 -->
      <ExpenseForm
        v-model:show="showForm"
        @success="handleSuccess"
      />

      <!-- 日期选择器 -->
      <van-popup v-model:show="showStartDatePicker" position="bottom">
        <van-date-picker
          v-model="currentStartDate"
          title="选择开始日期"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onStartDateConfirm"
          @cancel="showStartDatePicker = false"
        />
      </van-popup>

      <van-popup v-model:show="showEndDatePicker" position="bottom">
        <van-date-picker
          v-model="currentEndDate"
          title="选择结束日期"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onEndDateConfirm"
          @cancel="showEndDatePicker = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import type { ExpenseQuery } from '@/api/expense';
import dayjs from '@/utils/dayjs';

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const showForm = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const searchQuery = ref('');

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日');
});

const query = reactive<ExpenseQuery>({
  startDate: undefined,
  endDate: undefined,
});

const minDate = dayjs('2020-01-01').toDate();
const maxDate = dayjs().toDate();

const currentStartDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString(),
  dayjs().date().toString()
]);

const currentEndDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString(),
  dayjs().date().toString()
]);

// 设置默认日期范围（最近一周）
const setDefaultDateRange = () => {
  const end = dayjs();
  const start = end.subtract(6, 'day');
  
  query.startDate = start.format('YYYY-MM-DD');
  query.endDate = end.format('YYYY-MM-DD');
  
  // 更新日期选择器的当前值
  currentStartDate.value = [
    start.year().toString(),
    (start.month() + 1).toString(),
    start.date().toString()
  ];
  
  currentEndDate.value = [
    end.year().toString(),
    (end.month() + 1).toString(),
    end.date().toString()
  ];
};

const onStartDateConfirm = (value: string[]) => {
  const [year, month, day] = value;
  query.startDate = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).format('YYYY-MM-DD');
  showStartDatePicker.value = false;
};

const onEndDateConfirm = (value: string[]) => {
  const [year, month, day] = value;
  query.endDate = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).format('YYYY-MM-DD');
  showEndDatePicker.value = false;
};

const handleSearch = () => {
  expenseStore.fetchExpenses(query);
};

const handleSuccess = () => {
  showForm.value = false;
  expenseStore.fetchExpenses(query);
};

const expenses = computed(() => expenseStore.expenses);

const filteredExpenses = computed(() => {
  if (!searchQuery.value) return expenses.value;
  
  const query = searchQuery.value.toLowerCase();
  return expenses.value.filter(expense => {
    const category = categoryStore.categories.find(c => c.id === expense.category);
    return (
      expense.description.toLowerCase().includes(query) ||
      (category?.name || '').toLowerCase().includes(query) ||
      expense.amount.toString().includes(query)
    );
  });
});

const fetchExpenses = async () => {
  try {
    await expenseStore.fetchExpenses(query);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
  }
};

// 在组件挂载时设置默认日期范围并加载数据
onMounted(() => {
  setDefaultDateRange();
  fetchExpenses();
});
</script>

<style>
.van-button--primary {
  @apply bg-indigo-600 border-indigo-600;
}

.van-button--primary:active {
  @apply bg-indigo-700 border-indigo-700;
}

.van-field__label {
  @apply text-gray-700 font-medium;
}

.van-field__control {
  @apply text-gray-900;
}

.van-floating-bubble {
  @apply shadow-lg;
}

.van-floating-bubble:active {
  @apply shadow-xl;
}
</style> 