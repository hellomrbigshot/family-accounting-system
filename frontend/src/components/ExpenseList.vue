<template>
  <div class="bg-white">
    <van-pull-refresh v-if="showRefresh" v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <template v-if="showDelete">
          <van-swipe-cell
            v-for="expense in displayExpenses"
            :key="expense._id"
            class="mb-2"
          >
            <van-cell
              :title="getCategoryName(expense.category)"
              :value="formatAmount(expense.amount)"
              :border="false"
            >
              <template #title>
                <div class="flex flex-col w-full">
                  <div class="flex items-center">
                    <span class="mr-2">{{ getCategoryIcon(expense.category) }}</span>
                    <span class="font-medium">{{ getCategoryName(expense.category) }}</span>
                  </div>
                  <div v-if="expense.description" class="text-gray-600 text-sm mt-1 line-clamp-2">
                    {{ expense.description }}
                  </div>
                  <div class="text-gray-500 text-xs mt-1">
                    {{ formatDate(expense.date) }}
                  </div>
                </div>
              </template>
            </van-cell>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                class="h-full"
                @click="handleDelete(expense)"
              />
            </template>
          </van-swipe-cell>
        </template>
        <template v-else>
          <van-cell
            v-for="expense in displayExpenses"
            :key="expense._id"
            :title="getCategoryName(expense.category)"
            :value="formatAmount(expense.amount)"
            :border="false"
            class="mb-2"
          >
            <template #title>
              <div class="flex flex-col w-full">
                <div class="flex items-center">
                  <span class="mr-2">{{ getCategoryIcon(expense.category) }}</span>
                  <span class="font-medium">{{ getCategoryName(expense.category) }}</span>
                </div>
                <div v-if="expense.description" class="text-gray-600 text-sm mt-1 line-clamp-2">
                  {{ expense.description }}
                </div>
                <div class="text-gray-500 text-xs mt-1">
                  {{ formatDate(expense.date) }}
                </div>
              </div>
            </template>
          </van-cell>
        </template>
      </van-list>
    </van-pull-refresh>
    
    <!-- 无刷新功能的简单列表 -->
    <div v-else>
      <div v-if="displayExpenses.length === 0" class="text-center text-gray-500 py-8">
        {{ emptyText }}
      </div>
      <div v-else>
        <template v-if="showDelete">
          <van-swipe-cell
            v-for="expense in displayExpenses"
            :key="expense._id"
            class="mb-2"
          >
            <van-cell
              :title="getCategoryName(expense.category)"
              :value="formatAmount(expense.amount)"
              :border="false"
            >
              <template #title>
                <div class="flex flex-col w-full">
                  <div class="flex items-center">
                    <span class="mr-2">{{ getCategoryIcon(expense.category) }}</span>
                    <span class="font-medium">{{ getCategoryName(expense.category) }}</span>
                  </div>
                  <div v-if="expense.description" class="text-gray-600 text-sm mt-1 line-clamp-2">
                    {{ expense.description }}
                  </div>
                  <div class="text-gray-500 text-xs mt-1">
                    {{ formatDate(expense.date) }}
                  </div>
                </div>
              </template>
            </van-cell>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                class="h-full"
                @click="handleDelete(expense)"
              />
            </template>
          </van-swipe-cell>
        </template>
        <template v-else>
          <van-cell
            v-for="expense in displayExpenses"
            :key="expense._id"
            :title="getCategoryName(expense.category)"
            :value="formatAmount(expense.amount)"
            :border="false"
            class="mb-2"
          >
            <template #title>
              <div class="flex flex-col w-full">
                <div class="flex items-center">
                  <span class="mr-2">{{ getCategoryIcon(expense.category) }}</span>
                  <span class="font-medium">{{ getCategoryName(expense.category) }}</span>
                </div>
                <div v-if="expense.description" class="text-gray-600 text-sm mt-1 line-clamp-2">
                  {{ expense.description }}
                </div>
                <div class="text-gray-500 text-xs mt-1">
                  {{ formatDate(expense.date) }}
                </div>
              </div>
            </template>
          </van-cell>
        </template>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="确认删除"
      show-cancel-button
      @confirm="confirmDelete"
    >
      <div class="p-4 text-center">
        确定要删除这条支出记录吗？
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { showToast } from 'vant';
import dayjs from '@/utils/dayjs';

const props = defineProps<{
  expenses: Array<{
    _id: string;
    date: string;
    category: string;
    amount: number;
    description: string;
  }>;
  showRefresh?: boolean;
  maxItems?: number;
  emptyText?: string;
  finishedText?: string;
  showDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

// 设置默认值
const showRefresh = computed(() => props.showRefresh ?? true);
const maxItems = computed(() => props.maxItems ?? 0);
const emptyText = computed(() => props.emptyText ?? '暂无支出记录');
const finishedText = computed(() => props.finishedText ?? '没有更多了');
const showDelete = computed(() => props.showDelete ?? false);

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showDeleteDialog = ref(false);
const expenseToDelete = ref<{ _id: string } | null>(null);

// 显示的支出列表（可能被限制数量）
const displayExpenses = computed(() => {
  if (maxItems.value > 0) {
    return props.expenses.slice(0, maxItems.value);
  }
  return props.expenses;
});

// 加载分类数据
onMounted(async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  if (!categoryStore.categories || !Array.isArray(categoryStore.categories)) {
    return '未知分类';
  }
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category?.name || '未知分类';
};

// 获取分类图标
const getCategoryIcon = (categoryId: string) => {
  if (!categoryStore.categories || !Array.isArray(categoryStore.categories)) {
    return '📦';
  }
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category?.icon || '📦';
};

// 格式化日期
const formatDate = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  
  if (now.isSame(target, 'day')) {
    return '今天';
  } else if (now.isSame(target, 'year')) {
    return target.format('MM月DD日');
  } else {
    return target.format('YYYY年MM月DD日');
  }
};

// 格式化金额
const formatAmount = (amount: number | undefined) => {
  if (amount === undefined || amount === null) {
    return '¥0.00';
  }
  return `¥${amount.toFixed(2)}`;
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

// 处理删除点击
const handleDelete = (expense: { _id: string }) => {
  expenseToDelete.value = expense;
  showDeleteDialog.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (!expenseToDelete.value) return;
  
  try {
    await expenseStore.deleteExpense(expenseToDelete.value._id);
    showToast('删除成功');
    emit('refresh');
  } catch (error) {
    console.error('删除支出记录失败:', error);
    showToast('删除失败');
  } finally {
    expenseToDelete.value = null;
  }
};
</script>

<style scoped>
.van-cell {
  @apply bg-white rounded-lg shadow-sm;
}

.van-cell__title {
  @apply text-base text-gray-900;
  flex: 1;
  min-width: 0;
}

.van-cell__value {
  @apply text-base font-medium text-red-600;
  flex-shrink: 0;
  margin-left: 1rem;
}

.van-tag {
  @apply text-xs;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.van-swipe-cell {
  @apply rounded-lg overflow-hidden mb-2;
  height: 80px;
}

.van-swipe-cell__right {
  @apply h-full;
  width: 65px;
}

.van-button--danger {
  @apply bg-red-500 border-red-500 h-full w-full;
  border-radius: 0;
}

.van-button--danger:active {
  @apply bg-red-600 border-red-600;
}
</style> 