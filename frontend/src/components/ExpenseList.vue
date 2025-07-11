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
            :key="expense.id"
            class="mb-2"
          >
            <van-cell
              :title="getCategoryName(expense.category)"
              :value="formatAmount(expense.amount)"
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
                  <div v-if="getExpenseTags(expense).length > 0" class="flex flex-wrap gap-0.5 mt-1 w-full">
                    <div
                      v-for="tag in getExpenseTags(expense)"
                      :key="tag.id"
                      class="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded-full text-xs"
                    >
                      <div 
                        class="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                        :style="{ backgroundColor: tag.color }"
                      ></div>
                      <span class="text-gray-700">{{ tag.name }}</span>
                    </div>
                  </div>
                  <div class="text-gray-500 text-xs mt-1">
                    {{ formatDate(expense.date) }}
                  </div>
                </div>
              </template>
            </van-cell>
            <template #right>
              <div class="flex h-full">
                <div
                  class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-colors duration-200"
                  style="background-color: #4f46e5; color: #fff;"
                  @click="handleEdit(expense)"
                  @mouseenter="(e) => (e.target as HTMLElement).style.backgroundColor = '#4338ca'"
                  @mouseleave="(e) => (e.target as HTMLElement).style.backgroundColor = '#4f46e5'"
                >
                  编辑
                </div>
                <div
                  class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-colors duration-200"
                  style="background-color: #ee0a24; color: #fff;"
                  @click="handleDelete(expense)"
                  @mouseenter="(e) => (e.target as HTMLElement).style.backgroundColor = '#dc2626'"
                  @mouseleave="(e) => (e.target as HTMLElement).style.backgroundColor = '#ee0a24'"
                >
                  删除
                </div>
              </div>
            </template>
          </van-swipe-cell>
        </template>
        <template v-else>
          <van-cell
            v-for="expense in displayExpenses"
            :key="expense.id"
            :title="getCategoryName(expense.category)"
            :value="formatAmount(expense.amount)"
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
                <div v-if="getExpenseTags(expense).length > 0" class="flex flex-wrap gap-0.5 mt-1 w-full">
                  <div
                    v-for="tag in getExpenseTags(expense)"
                    :key="tag.id"
                    class="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded-full text-xs"
                  >
                    <div 
                      class="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                      :style="{ backgroundColor: tag.color }"
                    ></div>
                    <span class="text-gray-700">{{ tag.name }}</span>
                  </div>
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
            :key="expense.id"
            class="mb-2"
          >
            <van-cell
              :title="getCategoryName(expense.category)"
              :value="formatAmount(expense.amount)"
            >
              <template #title>
                <div class="flex flex-col w-full">
                  <div class="flex items-center">
                    <span class="mr-2">{{ getCategoryIcon(expense.category) }}</span>
                    <span class="font-medium">{{ getCategoryName(expense.category) }}</span>
                  </div>
                  <div v-if="expense.description" class="text-gray-600 text-xs mt-1 line-clamp-2">
                    {{ expense.description }}
                  </div>
                  <div v-if="getExpenseTags(expense).length > 0" class="flex flex-wrap gap-0.5 mt-1 w-full">
                    <div
                      v-for="tag in getExpenseTags(expense)"
                      :key="tag.id"
                      class="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded-full text-xs"
                    >
                      <div 
                        class="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                        :style="{ backgroundColor: tag.color }"
                      ></div>
                      <span class="text-gray-700">{{ tag.name }}</span>
                    </div>
                  </div>
                  <div class="text-gray-500 text-xs mt-1">
                    {{ formatDate(expense.date) }}
                  </div>
                </div>
              </template>
            </van-cell>
            <template #right>
              <div class="flex h-full">
                <van-button
                  square
                  type="primary"
                  text="编辑"
                  class="h-full"
                  @click="handleEdit(expense)"
                />
                <van-button
                  square
                  type="danger"
                  text="删除"
                  class="h-full"
                  @click="handleDelete(expense)"
                />
              </div>
            </template>
          </van-swipe-cell>
        </template>
        <template v-else>
          <van-cell
            v-for="expense in displayExpenses"
            :key="expense.id"
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
                <div v-if="getExpenseTags(expense).length > 0" class="flex flex-wrap gap-0.5 mt-1 w-full">
                  <div
                    v-for="tag in getExpenseTags(expense)"
                    :key="tag.id"
                    class="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded-full text-xs"
                  >
                    <div 
                      class="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                      :style="{ backgroundColor: tag.color }"
                    ></div>
                    <span class="text-gray-700">{{ tag.name }}</span>
                  </div>
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
import { ref, computed, onMounted } from 'vue'
import { useExpenseStore } from '@/stores/expense'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import { showToast } from 'vant'
import dayjs from '@/utils/dayjs'
import type { CategoryData } from '@/api/category'
import type { TagData } from '@/api/tag'

interface ExpenseWithCategory {
  id: string
  date: string
  category: string
  amount: number
  description: string
  tags: string[]
  createdAt: string
}

const props = defineProps<{
  expenses: ExpenseWithCategory[]
  showRefresh?: boolean
  showDelete?: boolean
  maxItems?: number
  emptyText?: string
  finishedText?: string
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'delete', expense: ExpenseWithCategory): void
  (e: 'edit', expense: ExpenseWithCategory): void
}>()

// 设置默认值
const showRefresh = computed(() => props.showRefresh ?? true)
const maxItems = computed(() => props.maxItems ?? 0)
const emptyText = computed(() => props.emptyText ?? '暂无支出记录')
const finishedText = computed(() => props.finishedText ?? '没有更多了')
const showDelete = computed(() => props.showDelete ?? false)

const expenseStore = useExpenseStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const showDeleteDialog = ref(false)
const expenseToDelete = ref<{ id: string } | null>(null)

// 显示的支出列表（可能被限制数量）
const displayExpenses = computed(() => {
  if (maxItems.value > 0) {
    return props.expenses.slice(0, maxItems.value)
  }
  return props.expenses
})

// 根据标签ID获取标签对象
const getTagById = (tagId: string): TagData | null => {
  return tagStore.tags.find(tag => tag.id === tagId) || null
}

// 获取支出的标签对象数组
const getExpenseTags = (expense: ExpenseWithCategory): TagData[] => {
  if (!expense.tags || expense.tags.length === 0) {
    return []
  }
  
  // 将字符串数组转换为对象数组
  return expense.tags
    .map(tagId => getTagById(tagId))
    .filter((tag): tag is TagData => tag !== null)
}

// 加载分类数据
onMounted(async () => {
  try {
    await categoryStore.fetchCategories()
    await tagStore.fetchTags()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

// 获取分类名称
const getCategoryName = (category: string | CategoryData) => {
  if (typeof category === 'string') {
    const foundCategory = categoryStore.categories.find(c => c.id === category)
    return foundCategory?.name || '未知分类'
  }
  return category.name || '未知分类'
}

// 获取分类图标
const getCategoryIcon = (category: string | CategoryData) => {
  if (typeof category === 'string') {
    const foundCategory = categoryStore.categories.find(c => c.id === category)
    return foundCategory?.icon || '📦'
  }
  return category.icon || '📦'
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化金额
const formatAmount = (amount: number) => {
  return `¥${amount.toFixed(2)}`
}

// 处理刷新
const onRefresh = () => {
  finished.value = false
  emit('refresh')
  refreshing.value = false
}

// 处理加载更多
const onLoad = () => {
  if (maxItems.value > 0 && props.expenses.length >= maxItems.value) {
    finished.value = true
  }
  loading.value = false
}

// 处理删除
const handleDelete = (expense: ExpenseWithCategory) => {
  expenseToDelete.value = expense;
  showDeleteDialog.value = true;
}

// 处理编辑
const handleEdit = (expense: ExpenseWithCategory) => {
  emit('edit', expense)
}

// 确认删除
const confirmDelete = async () => {
  if (!expenseToDelete.value) return
  
  try {
    await expenseStore.deleteExpense(expenseToDelete.value.id)
    showToast('删除成功')
    emit('refresh')
  } catch (error) {
    console.error('删除支出记录失败:', error)
    showToast('删除失败')
  } finally {
    expenseToDelete.value = null
    showDeleteDialog.value = false;
  }
}
</script>

<style scoped>
:deep(.van-cell) {
  @apply bg-white px-2;
}
:deep(.van-cell::after) {
  left: 8px;
  right: 8px;
}

:deep(.van-cell__title) {
  @apply text-base text-gray-900;
  flex: 70%;
  min-width: 0;
}

:deep(.van-cell__value) {
  @apply text-base font-medium text-red-600 ml-2;
  flex-shrink: 0;
  flex: 35%;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.van-swipe-cell) {
  @apply rounded-lg overflow-hidden mb-2;
}

:deep(.van-swipe-cell__right) {
  @apply h-full;
  width: 130px;
}

:deep(.van-button--danger) {
  @apply bg-red-500 border-red-500 h-full w-full;
  border-radius: 0;
}

:deep(.van-button--danger:active) {
  @apply bg-red-600 border-red-600;
}

:deep(.van-button--primary) {
  @apply bg-indigo-600 border-indigo-600 h-full w-full;
  border-radius: 0;
}

:deep(.van-button--primary:active) {
  @apply bg-indigo-700 border-indigo-700;
}
</style> 