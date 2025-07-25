<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 pb-6 pt-2">
      <!-- 欢迎区域 -->
      <div class="mb-2">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">支出记录</h1>
        <p class="text-sm text-gray-500 font-medium">今天是 {{ currentDate }}</p>
      </div>

      <!-- 搜索框和筛选器 -->
      <div class="flex items-center space-x-2 mb-4">
        <van-search
          v-model="searchQuery"
          placeholder="搜索支出记录"
          shape="round"
          background="transparent"
          class="custom-search !px-0 flex-1"
        />
        <van-button
          size="small"
          type="primary"
          @click="showFilterManager = true"
        >
          筛选器
        </van-button>
      </div>

      <!-- 当前筛选器显示 -->
      <div v-if="currentFilter" class="mb-3 p-2 bg-blue-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <van-icon name="filter-o" class="text-blue-500" size="16" />
            <span class="text-sm font-medium text-blue-900">{{ currentFilter.name }}</span>
          </div>
          <van-button
            size="mini"
            type="default"
            @click="clearCurrentFilter"
          >
            清除
          </van-button>
        </div>
      </div>

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
          <div class="flex items-center space-x-3">
            <h2 class="text-lg font-medium text-gray-800">支出记录</h2>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
              总计: ¥{{ totalAmount.toFixed(2) }}
            </span>
          </div>
        </div>

        <ExpenseList
          :expenses="filteredExpenses"
          show-delete
          :show-refresh="false"
          @refresh="handleRefresh"
          @edit="handleEdit"
        />
      </div>

      <!-- 新增支出表单弹窗 -->
      <ExpenseForm
        v-model:show="showForm"
        @success="handleSuccess"
      />

      <!-- 编辑支出表单弹窗 -->
      <ExpenseForm
        v-model:show="showEditForm"
        :edit-mode="true"
        :edit-data="editData"
        @success="handleEditSuccess"
      />

      <!-- 筛选器管理弹窗 -->
      <FilterManager
        v-model:show="showFilterManager"
        :current-filter="currentFilter"
        @filter-applied="handleFilterApplied"
        @filter-cleared="handleFilterCleared"
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
import { useTagStore } from '@/stores/tag';
import { useFilterStore } from '@/stores/filter';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import FilterManager from '@/components/FilterManager.vue';
import type { ExpenseQuery } from '@/api/expense';
import type { FilterData } from '@/api/filter';
import dayjs from '@/utils/dayjs';

const route = useRoute();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();
const filterStore = useFilterStore();
const showForm = ref(false);
const showEditForm = ref(false);
const editData = ref<any>(null);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const searchQuery = ref('');
const showFilterManager = ref(false);

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

const handleEditSuccess = () => {
  showEditForm.value = false;
  expenseStore.fetchExpenses(query);
};

const handleEdit = (expense: any) => {
  editData.value = expense;
  showEditForm.value = true;
};

const expenses = computed(() => expenseStore.expenses);

const filteredExpenses = computed(() => {
  // 如果有搜索查询，应用本地搜索（用于快速搜索提示）
  if (!searchQuery.value) return expenses.value;
  
  const query = searchQuery.value.toLowerCase();
  return expenses.value.filter(expense => {
    const category = categoryStore.allCategoriesForMapping.find(c => c.id === expense.category);
    
    // 检查标签匹配
    const matchedTags = expense.tags?.some(tagId => {
      const tag = tagStore.tags.find(t => t.id === tagId);
      return tag?.name.toLowerCase().includes(query);
    }) || false;
    
    return (
      expense.description.toLowerCase().includes(query) ||
      (category?.name || '').toLowerCase().includes(query) ||
      expense.amount.toString().includes(query) ||
      matchedTags
    );
  });
});

const fetchExpenses = async () => {
  try {
    let expenseQuery: ExpenseQuery = {
      startDate: query.startDate,
      endDate: query.endDate
    };

    // 如果有当前筛选器，应用筛选器条件
    if (currentFilter.value) {
      const conditions = currentFilter.value.conditions;
      
      // 应用时间范围
      if (conditions.timeRange) {
        if (conditions.timeRange.type === 'preset' && conditions.timeRange.preset) {
          // 根据预设时间范围设置查询参数
          const now = dayjs();
          switch (conditions.timeRange.preset) {
            case 'week':
              expenseQuery.startDate = now.startOf('week').format('YYYY-MM-DD');
              expenseQuery.endDate = now.endOf('week').format('YYYY-MM-DD');
              break;
            case 'month':
              expenseQuery.startDate = now.startOf('month').format('YYYY-MM-DD');
              expenseQuery.endDate = now.endOf('month').format('YYYY-MM-DD');
              break;
            case 'quarter':
              // dayjs 不支持 quarter，使用月份计算
              const quarterStart = now.month(Math.floor(now.month() / 3) * 3);
              expenseQuery.startDate = quarterStart.startOf('month').format('YYYY-MM-DD');
              expenseQuery.endDate = quarterStart.add(2, 'month').endOf('month').format('YYYY-MM-DD');
              break;
            case 'year':
              expenseQuery.startDate = now.startOf('year').format('YYYY-MM-DD');
              expenseQuery.endDate = now.endOf('year').format('YYYY-MM-DD');
              break;
            case 'lastWeek':
              expenseQuery.startDate = now.subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
              expenseQuery.endDate = now.subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
              break;
            case 'lastMonth':
              expenseQuery.startDate = now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
              expenseQuery.endDate = now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
              break;
            case 'lastYear':
              expenseQuery.startDate = now.subtract(1, 'year').startOf('year').format('YYYY-MM-DD');
              expenseQuery.endDate = now.subtract(1, 'year').endOf('year').format('YYYY-MM-DD');
              break;
          }
        } else if (conditions.timeRange.custom) {
          expenseQuery.startDate = conditions.timeRange.custom.startDate;
          expenseQuery.endDate = conditions.timeRange.custom.endDate;
        }
      }
      
      // 应用额外支出筛选
      if (conditions.isExtra !== undefined) {
        expenseQuery.isExtra = conditions.isExtra;
      }
      
      // 应用标签筛选
      if (conditions.tags && conditions.tags.length > 0) {
        expenseQuery.tags = conditions.tags;
      }
      
      // 应用金额范围筛选
      if (conditions.amountRange) {
        expenseQuery.amountOperator = conditions.amountRange.operator;
        expenseQuery.amountValue = conditions.amountRange.value;
      }
      
      // 应用描述关键词筛选
      if (conditions.description) {
        expenseQuery.description = conditions.description;
      }
    }

    await expenseStore.fetchExpenses(expenseQuery);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
  }
};

// 在组件挂载时设置默认日期范围并加载数据
onMounted(async () => {
  setDefaultDateRange();
  
  // 处理路由查询参数，设置搜索框内容
  if (route.query.category) {
    const categoryId = route.query.category as string;
    const category = categoryStore.allCategoriesForMapping.find(c => c.id === categoryId);
    if (category) {
      searchQuery.value = category.name;
    }
  }
  
  if (route.query.tags) {
    const tagsParam = route.query.tags;
    if (Array.isArray(tagsParam)) {
      const tagIds = tagsParam.filter(tag => tag !== null) as string[];
      const tagNames = tagIds.map(tagId => {
        const tag = tagStore.tags.find(t => t.id === tagId);
        return tag?.name;
      }).filter(Boolean);
      if (tagNames.length > 0) {
        searchQuery.value = tagNames.join(' ');
      }
    } else {
      const tagId = tagsParam as string;
      const tag = tagStore.tags.find(t => t.id === tagId);
      if (tag) {
        searchQuery.value = tag.name;
      }
    }
  }
  
  await Promise.all([
    fetchExpenses(),
    tagStore.fetchTags(),
    categoryStore.fetchCategories()
  ]);
});

// 处理删除成功后的刷新
const handleRefresh = async () => {
  await fetchExpenses();
};

const totalAmount = computed(() => {
  return filteredExpenses.value.reduce((total, expense) => total + expense.amount, 0);
});

// 当前筛选器
const currentFilter = computed(() => filterStore.currentFilter);

// 清除当前筛选器
const clearCurrentFilter = () => {
  filterStore.clearCurrentFilter();
  // 重新获取支出数据
  fetchExpenses();
};

// 处理筛选器应用
const handleFilterApplied = (filter: FilterData) => {
  // 根据筛选器条件重新获取支出数据
  fetchExpenses();
};

// 处理筛选器清除
const handleFilterCleared = () => {
  // 重新获取支出数据
  fetchExpenses();
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