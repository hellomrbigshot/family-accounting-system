<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '80%' }"
    teleport="body"
  >
    <div class="h-full flex flex-col bg-warm-50/30">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-6 border-b border-warm-200 bg-gradient-warm-subtle">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue-light to-accent-blue flex items-center justify-center shadow-lg">
            <span class="text-2xl">📊</span>
          </div>
          <h2 class="text-xl font-display font-bold text-gray-900">筛选器管理</h2>
        </div>
        <van-icon name="cross" size="22" class="text-gray-600 hover:text-warm-600 cursor-pointer transition-colors" @click="handleClose" />
      </div>

      <!-- 当前筛选器 -->
      <div v-if="currentFilter" class="p-4 bg-gradient-to-r from-accent-blue-light/20 via-accent-blue-light/10 to-warm-100/30 border-b border-accent-blue-light/30 animate-fade-in">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue-light to-accent-blue flex items-center justify-center shadow-md">
              <span class="text-lg">✨</span>
            </div>
            <div>
              <p class="text-xs font-medium text-accent-blue-dark/70 mb-0.5">当前筛选器</p>
              <p class="text-base font-display font-bold text-accent-blue-dark">{{ currentFilter.name }}</p>
            </div>
          </div>
          <van-button
            size="small"
            type="default"
            @click="clearCurrentFilter"
            class="rounded-lg border-accent-blue-light/30 text-accent-blue-dark hover:bg-accent-blue-light/10"
          >
            清除
          </van-button>
        </div>
      </div>

      <!-- 筛选器列表 -->
      <div class="flex-1 overflow-y-auto p-6 bg-white">
        <div v-if="filterStore.loading" class="flex justify-center py-12">
          <van-loading size="32px" color="#f97316">加载中...</van-loading>
        </div>

        <div v-else-if="filterStore.filters.length === 0" class="text-center py-12 animate-fade-in">
          <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center shadow-warm">
            <span class="text-5xl animate-pulse-warm">📁</span>
          </div>
          <p class="text-gray-600 font-display font-bold text-lg mb-2">暂无筛选器</p>
          <p class="text-sm text-gray-400 mb-6">创建筛选器以快速查找支出记录</p>
          <van-button
            type="primary"
            size="small"
            icon="plus"
            @click="showCreateForm = true"
            class="rounded-xl shadow-warm"
          >
            创建第一个筛选器
          </van-button>
        </div>

        <div v-else class="space-y-3 animate-fade-in">
          <div
            v-for="(filter, index) in filterStore.filters"
            :key="filter.id"
            class="bg-white rounded-2xl border border-warm-200 p-5 hover:shadow-md transition-all duration-300 card-hover group animate-fade-in-up"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1 mr-2">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-warm-300 to-warm-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                    <span class="text-lg">🔍</span>
                  </div>
                  <h3 class="font-display font-bold text-gray-900 truncate text-base">{{ filter.name }}</h3>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                  <button
                    @click="applyFilter(filter)"
                    class="p-2 rounded-lg bg-gradient-to-r from-accent-blue-light to-accent-blue text-white hover:from-accent-blue hover:to-accent-blue-dark transition-all duration-200 shadow-md hover:shadow-lg"
                    title="应用筛选器"
                  >
                    <van-icon name="play-circle-o" size="18" />
                  </button>
                  <button
                    @click="editFilter(filter)"
                    class="p-2 rounded-lg bg-warm-100 text-warm-600 hover:bg-warm-200 transition-all duration-200"
                    title="编辑筛选器"
                  >
                    <van-icon name="edit" size="18" />
                  </button>
                  <button
                    @click="deleteFilter(filter)"
                    class="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200"
                    title="删除筛选器"
                  >
                    <van-icon name="delete-o" size="18" />
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 break-words leading-relaxed pl-13">
                {{ formatFilterConditions(filter.conditions) }}
              </p>
              <p class="text-xs text-gray-400 pl-13 flex items-center space-x-1">
                <van-icon name="clock-o" size="12" />
                <span>{{ formatDate(filter.createdAt) }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 新建筛选器按钮 -->
        <div class="mt-6 px-2">
          <van-button
            type="primary"
            block
            icon="plus"
            @click="createNewFilter"
            class="rounded-xl shadow-warm font-semibold"
          >
            新建筛选器
          </van-button>
        </div>
      </div>
    </div>

    <!-- 筛选器表单 -->
    <FilterForm
      v-model:show="showCreateForm"
      :edit-data="editingFilter"
      @success="handleFormSuccess"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { useFilterStore } from '@/stores/filter'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import { formatAmount } from '@/utils/format'
import type { FilterData } from '@/api/filter'
import FilterForm from './FilterForm.vue'
import dayjs from '@/utils/dayjs'

const props = defineProps<{
  show: boolean
  currentFilter?: FilterData | null
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'filter-applied', filter: FilterData): void
  (e: 'filter-cleared'): void
}>()

const filterStore = useFilterStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()
const showCreateForm = ref(false)
const editingFilter = ref<FilterData | null>(null)

// 当前筛选器
const currentFilter = computed(() => props.currentFilter)

// 处理显示状态更新
const handleShowUpdate = (value: boolean) => {
  emit('update:show', value)
}

// 关闭弹窗
const handleClose = () => {
  emit('update:show', false)
}

// 应用筛选器
const applyFilter = (filter: FilterData) => {
  filterStore.applyFilter(filter)
  emit('filter-applied', filter)
  handleClose()
}

// 清除当前筛选器
const clearCurrentFilter = () => {
  filterStore.clearCurrentFilter()
  emit('filter-cleared')
}

// 新建筛选器
const createNewFilter = () => {
  editingFilter.value = null
  showCreateForm.value = true
}

// 编辑筛选器
const editFilter = (filter: FilterData) => {
  editingFilter.value = filter
  showCreateForm.value = true
}

// 删除筛选器
const deleteFilter = async (filter: FilterData) => {
  try {
    await showDialog({
      title: '确认删除',
      message: `确定要删除筛选器"${filter.name}"吗？`,
      showCancelButton: true
    })

    await filterStore.deleteFilter(filter.id)

    // 如果删除的是当前筛选器，清除当前筛选器
    if (currentFilter.value?.id === filter.id) {
      clearCurrentFilter()
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 处理表单成功
const handleFormSuccess = () => {
  showCreateForm.value = false
  editingFilter.value = null
}

// 格式化筛选条件
const formatFilterConditions = (conditions: any) => {
  const parts = []

  // 时间范围
  if (conditions?.timeRange) {
    if (conditions.timeRange.type === 'unlimited') {
      parts.push('不限时间')
    } else if (conditions.timeRange.type === 'preset' && conditions.timeRange.preset) {
      const presetMap: Record<string, string> = {
        week: '本周',
        month: '本月',
        quarter: '本季度',
        year: '本年度',
        lastWeek: '上周',
        lastMonth: '上月',
        lastYear: '去年'
      }
      parts.push(presetMap[conditions.timeRange.preset] || '自定义时间')
    } else if (conditions.timeRange.type === 'custom' && conditions.timeRange.custom) {
      // 显示具体的自定义时间范围
      const start = dayjs(conditions.timeRange.custom.startDate).format('YYYY/MM/DD')
      const end = dayjs(conditions.timeRange.custom.endDate).format('YYYY/MM/DD')
      parts.push(`${start} - ${end}`)
    } else {
      parts.push('不限时间')
    }
  } else {
    parts.push('不限时间')
  }

  // 金额范围
  if (conditions?.amountRange &&
      conditions.amountRange.operator &&
      conditions.amountRange.value !== undefined &&
      conditions.amountRange.value !== null &&
      conditions.amountRange.value !== '') {
    const operatorMap: Record<string, string> = {
      gt: '大于',
      lt: '小于',
      eq: '等于',
      gte: '大于等于',
      lte: '小于等于'
    }
    const operator = conditions.amountRange.operator
    parts.push(`${operatorMap[operator]} ${formatAmount(conditions.amountRange.value)}`)
  } else {
    parts.push('不限')
  }

  // 分类筛选
  if (conditions?.categories && conditions.categories.length > 0) {
    const categoryNames = conditions.categories.map((id: string) => {
      const category = categoryStore.allCategoriesForMapping.find(c => c.id === id)
      return category?.name || id
    })
    parts.push(categoryNames.join('、'))
  } else {
    parts.push('不限')
  }

  // 标签筛选
  if (conditions?.tags && conditions.tags.length > 0) {
    const tagNames = conditions.tags.map((id: string) => {
      const tag = tagStore.tags.find(t => t.id === id)
      return tag?.name || id
    })
    parts.push(tagNames.join('、'))
  } else {
    parts.push('不限')
  }

  // 支出类型
  if (conditions?.isExtra !== undefined) {
    parts.push(conditions.isExtra ? '额外支出' : '普通支出')
  } else {
    parts.push('不限')
  }

  // 描述关键词
  if (conditions?.description && conditions.description.trim() !== '') {
    parts.push(`包含"${conditions.description}"`)
  } else {
    parts.push('不限')
  }

  return `时间：${parts[0]}，金额：${parts[1]}，分类：${parts[2]}，标签：${parts[3]}，类型：${parts[4]}，描述：${parts[5]}`
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 组件挂载时获取筛选器列表
onMounted(() => {
  filterStore.fetchFilters()
})
</script>

<style scoped>
:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}

:deep(.van-button--default) {
  background: white;
}

:deep(.van-button--default:active) {
  background: var(--color-warm-50);
}

:deep(.van-loading__spinner) {
  color: var(--color-warm-500);
}
</style>
