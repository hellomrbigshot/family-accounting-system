<template>
  <van-swipe-cell
    :disabled="!showDelete"
    class="mb-2"
  >
    <van-cell
      :title="getCategoryName(expense.category)"
      :value="formatAmount(expense.amount)"
      :border="!showDelete"
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
          <div class="flex flex-wrap gap-0.5 mt-1 w-full">
            <!-- 额外支出标签 -->
            <div
              v-if="expense.isExtra"
              class="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded-full text-xs "
            >
              <div class="w-2 h-2 rounded-full mr-1 flex-shrink-0 bg-orange-400"></div>
              <span class="text-gray-700">额外支出</span>
            </div>
            <!-- 其他标签 -->
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
      <div class="flex h-full ml-[2px]">
        <div
          class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 font-medium"
          @click="handleEdit"
        >
          编辑
        </div>
        <div
          class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-medium"
          @click="handleDelete"
        >
          删除
        </div>
      </div>
    </template>
  </van-swipe-cell>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import dayjs from '@/utils/dayjs'
import { formatAmount } from '@/utils/format'
import type { CategoryData } from '@/api/category'
import type { TagData } from '@/api/tag'

interface ExpenseWithCategory {
  id: string
  date: string
  category: string
  amount: number
  description: string
  tags: string[]
  isExtra: boolean
  createdAt: string
}

const props = defineProps<{
  expense: ExpenseWithCategory
  showDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', expense: ExpenseWithCategory): void
  (e: 'delete', expense: ExpenseWithCategory): void
}>()

const categoryStore = useCategoryStore()
const tagStore = useTagStore()

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

// 获取分类名称
const getCategoryName = (category: string | CategoryData) => {
  if (typeof category === 'string') {
    const foundCategory = categoryStore.allCategoriesForMapping.find(c => c.id === category)
    return foundCategory?.name || '未知分类'
  }
  return category.name || '未知分类'
}

// 获取分类图标
const getCategoryIcon = (category: string | CategoryData) => {
  if (typeof category === 'string') {
    const foundCategory = categoryStore.allCategoriesForMapping.find(c => c.id === category)
    return foundCategory?.icon || '📦'
  }
  return category.icon || '📦'
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 处理编辑
const handleEdit = () => {
  emit('edit', props.expense)
}

// 处理删除
const handleDelete = () => {
  emit('delete', props.expense)
}
</script>

<style scoped>
:deep(.van-cell) {
  @apply bg-white px-4 py-3;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

:deep(.van-cell:hover) {
  background: var(--color-warm-50);
  transform: none;
}

:deep(.van-cell:active) {
  background: var(--color-warm-100);
  transform: none;
}

:deep(.van-cell::after) {
  display: none;
}

:deep(.van-cell__title) {
  @apply text-base text-gray-900;
  flex: 70%;
  min-width: 0;
  font-family: var(--font-body);
}

:deep(.van-cell__value) {
  @apply text-lg font-display font-bold text-warm-600 ml-2 whitespace-nowrap;
  flex-shrink: 0;
  flex: 35%;
  min-width: 8rem; /* 支持百万级金额不换行，约 ¥1234567.89 */
  transition: color 0.2s ease;
}

:deep(.van-cell__value span) {
  color: var(--color-accent-green-light);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.van-swipe-cell) {
  @apply rounded-xl overflow-hidden mb-3;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

:deep(.van-swipe-cell:hover) {
  box-shadow: var(--shadow-md);
}

:deep(.van-swipe-cell__right) {
  @apply h-full;
  width: 130px;
}

:deep(.van-swipe-cell__right > div) {
  transition: all 0.2s ease;
}

:deep(.van-swipe-cell__right > div:hover) {
  filter: brightness(0.9);
}
</style> 