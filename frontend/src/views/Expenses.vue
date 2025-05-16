<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 欢迎区域 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">支出记录</h1>
      <p class="text-gray-600">今天是 {{ currentDate }}</p>
    </div>

    <!-- 搜索区域 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
          <van-field
            v-model="query.startDate"
            readonly
            is-link
            placeholder="请选择开始日期"
            @click="showStartDatePicker = true"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
          <van-field
            v-model="query.endDate"
            readonly
            is-link
            placeholder="请选择结束日期"
            @click="showEndDatePicker = true"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="handleSearch"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- 支出列表 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900">支出记录</h2>
        <button
          @click="showForm = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          新增支出
        </button>
      </div>

      <ExpenseList />
    </div>

    <!-- 新增支出表单弹窗 -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">新增支出</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">关闭</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ExpenseForm
          :categories="categories"
          :paymentMethods="paymentMethods"
          @success="handleSuccess"
          @cancel="showForm = false"
        />
      </div>
    </div>

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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import type { ExpenseQuery } from '@/api/expense';
import dayjs from 'dayjs';

const expenseStore = useExpenseStore();
const showForm = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日');
});

const categories = ['食品餐饮', '购物消费', '出行交通', '休闲娱乐', '医疗保健', '教育学习', '其他'];
const paymentMethods = ['支付宝', '微信', '银联', '现金'];

const query = reactive<ExpenseQuery>({
  startDate: undefined,
  endDate: undefined,
});

const minDate = new Date(2020, 0, 1);
const maxDate = new Date();

const currentStartDate = ref<string[]>([
  new Date().getFullYear().toString(),
  (new Date().getMonth() + 1).toString(),
  new Date().getDate().toString()
]);

const currentEndDate = ref<string[]>([
  new Date().getFullYear().toString(),
  (new Date().getMonth() + 1).toString(),
  new Date().getDate().toString()
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
  query.startDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  showStartDatePicker.value = false;
};

const onEndDateConfirm = (value: string[]) => {
  const [year, month, day] = value;
  query.endDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  showEndDatePicker.value = false;
};

const handleSearch = () => {
  expenseStore.fetchExpenses(query);
};

const handleSuccess = () => {
  showForm.value = false;
  expenseStore.fetchExpenses(query);
};

// 在组件挂载时设置默认日期范围并加载数据
onMounted(() => {
  setDefaultDateRange();
  expenseStore.fetchExpenses(query);
});
</script>

<style>
.van-field__label {
  color: #4b5563;
  font-weight: 500;
}

.van-field__control {
  color: #1f2937;
}

.van-button--primary {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.van-button--primary:active {
  background-color: #4338ca;
  border-color: #4338ca;
}
</style> 