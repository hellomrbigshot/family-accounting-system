<template>
  <div class="bg-white">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="expense in expenses"
          :key="expense.id"
          :title="getCategoryName(expense.category)"
          :label="expense.description"
          :value="`¥${expense.amount.toFixed(2)}`"
          :border="false"
          class="mb-2"
        >
          <template #title>
            <div class="flex items-center">
              <span class="mr-2">{{ getCategoryIcon(expense.category) }}</span>
              <span>{{ getCategoryName(expense.category) }}</span>
            </div>
          </template>
          <template #label>
            <div class="flex flex-col">
              <span class="text-gray-500">{{ expense.description }}</span>
              <span class="text-gray-500 text-sm mt-1">{{ formatDate(expense.date) }}</span>
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import dayjs from '@/utils/dayjs';

const props = defineProps<{
  expenses: Array<{
    id: string;
    date: string;
    category: string;
    amount: number;
    description: string;
  }>;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category?.name || '未知分类';
};

// 获取分类图标
const getCategoryIcon = (categoryId: string) => {
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category?.icon || '📦';
};

// 格式化日期
const formatDate = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  
  if (now.isSame(target, 'day')) {
    return '今天 ' + target.format('HH:mm');
  } else if (now.isSame(target, 'year')) {
    return target.format('MM月DD日 HH:mm');
  } else {
    return target.format('YYYY年MM月DD日');
  }
};

const onRefresh = () => {
  refreshing.value = true;
  emit('refresh');
  refreshing.value = false;
};

const onLoad = () => {
  loading.value = false;
  finished.value = true;
};
</script>

<style>
.van-cell {
  @apply bg-white rounded-lg shadow-sm mb-2;
}

.van-cell__title {
  @apply text-base font-medium text-gray-900;
}

.van-cell__value {
  @apply text-base font-medium text-red-600;
}

.van-tag {
  @apply text-xs;
}
</style> 