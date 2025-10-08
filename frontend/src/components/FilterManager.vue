<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '80%' }"
    teleport="body"
  >
    <div class="h-full flex flex-col">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">筛选器管理</h2>
        <van-icon name="cross" size="20" @click="handleClose" />
      </div>

      <!-- 当前筛选器 -->
      <div v-if="currentFilter" class="p-4 bg-blue-50 border-b border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-700 font-medium">当前筛选器</p>
            <p class="text-lg font-semibold text-blue-900">{{ currentFilter.name }}</p>
          </div>
          <van-button
            size="small"
            type="default"
            @click="clearCurrentFilter"
          >
            清除
          </van-button>
        </div>
      </div>

      <!-- 筛选器列表 -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="filterStore.loading" class="flex justify-center py-8">
          <van-loading size="24px">加载中...</van-loading>
        </div>

        <div v-else-if="filterStore.filters.length === 0" class="text-center py-8">
          <van-empty description="暂无筛选器" />
          <van-button
            type="primary"
            size="small"
            class="mt-4"
            @click="showCreateForm = true"
          >
            创建第一个筛选器
          </van-button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="filter in filterStore.filters"
            :key="filter.id"
            class="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 truncate flex-1 mr-2">{{ filter.name }}</h3>
                <div class="flex items-center space-x-2 flex-shrink-0">
                  <van-icon
                    name="play-circle-o"
                    size="18"
                    class="text-blue-500 cursor-pointer"
                    @click="applyFilter(filter)"
                    title="应用筛选器"
                  />
                  <van-icon
                    name="edit"
                    size="18"
                    class="text-gray-500 cursor-pointer"
                    @click="editFilter(filter)"
                    title="编辑筛选器"
                  />
                  <van-icon
                    name="delete-o"
                    size="18"
                    class="text-red-500 cursor-pointer"
                    @click="deleteFilter(filter)"
                    title="删除筛选器"
                  />
                </div>
              </div>
              <p class="text-sm text-gray-500 break-words leading-relaxed">
                {{ formatFilterConditions(filter.conditions) }}
              </p>
              <p class="text-xs text-gray-400">
                {{ formatDate(filter.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 新建筛选器按钮 -->
        <div class="mt-6">
          <van-button
            type="primary"
            block
            @click="createNewFilter"
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
    parts.push(`${operatorMap[operator]} ¥${conditions.amountRange.value}`)
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