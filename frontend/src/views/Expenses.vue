<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 pb-6 pt-2">
      <!-- 欢迎区域 -->
      <div class="mb-2">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">支出记录</h1>
        <p class="text-sm text-gray-500 font-medium">今天是 {{ currentDate }}</p>
      </div>

      <!-- 搜索框 -->
      <van-search
        v-model="searchQuery"
        placeholder="搜索支出记录"
        shape="round"
        background="transparent"
        class="custom-search !px-0"
      />

      <!-- 搜索区域 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <van-field
            v-model="query.startDate"
            readonly
            is-link
            placeholder="开始日期"
            class="custom-field"
            @click="showStartDatePicker = true"
          />
          <van-field
            v-model="query.endDate"
            readonly
            is-link
            placeholder="结束日期"
            class="custom-field"
            @click="showEndDatePicker = true"
          />
        </div>

        <div class="mt-4">
          <van-button size="small" type="primary" class="w-full" @click="handleSearch">
            搜索
          </van-button>
        </div>
      </div>

      <!-- 支出列表 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-800">支出记录</h2>
        </div>

        <ExpenseList
          :expenses="filteredExpenses"
          show-delete
          :show-refresh="false"
          @refresh="handleRefresh"
        />
      </div>

      <!-- 新增支出表单弹窗 -->
      <ExpenseForm
        v-model:show="showForm"
        @success="handleSuccess"
      />

      <!-- 日期选择器 -->
      <van-popup v-model:show="showStartDatePicker" position="bottom" round>
        <van-date-picker
          v-model="currentStartDate"
          title="选择开始日期"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onStartDateConfirm"
          @cancel="showStartDatePicker = false"
        />
      </van-popup>

      <van-popup v-model:show="showEndDatePicker" position="bottom" round>
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
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);

const currentEndDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
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

const onStartDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  query.startDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  showStartDatePicker.value = false;
};

const onEndDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  query.endDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
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

// 处理删除成功后的刷新
const handleRefresh = async () => {
  await fetchExpenses();
};
</script>

<style scoped>
.custom-search :deep(.van-search__content) {
  background-color: #ffffff !important;
  border-radius: 12px !important;
  padding: 6px 12px !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 36px !important;
}

.custom-search :deep(.van-field__control) {
  font-size: 14px !important;
  min-height: 24px !important;
  line-height: 24px !important;
}

.custom-search :deep(.van-search) {
  padding: 0 !important;
  background: transparent !important;
  height: 36px !important;
}

.custom-field :deep(.van-field__control) {
  font-size: 14px !important;
  color: #1e293b !important;
}

.custom-field :deep(.van-field__placeholder) {
  color: #94a3b8 !important;
}
</style> 