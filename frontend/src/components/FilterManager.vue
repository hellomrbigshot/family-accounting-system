<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '80%' }"
    :z-index="3000"
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
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ filter.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ formatFilterConditions(filter.conditions) }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatDate(filter.createdAt) }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <van-button
                  size="small"
                  type="primary"
                  @click="applyFilter(filter)"
                >
                  应用
                </van-button>
                <van-button
                  size="small"
                  type="default"
                  @click="editFilter(filter)"
                >
                  编辑
                </van-button>
                <van-button
                  size="small"
                  type="danger"
                  @click="deleteFilter(filter)"
                >
                  删除
                </van-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 新建筛选器按钮 -->
        <div class="mt-6">
          <van-button
            type="primary"
            block
            @click="showCreateForm = true"
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
  
  if (conditions.timeRange) {
    if (conditions.timeRange.type === 'preset' && conditions.timeRange.preset) {
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
    } else if (conditions.timeRange.custom) {
      parts.push('自定义时间')
    }
  }
  
  if (conditions.amountRange) {
    const operatorMap: Record<string, string> = {
      gt: '大于',
      lt: '小于',
      eq: '等于',
      gte: '大于等于',
      lte: '小于等于'
    }
    parts.push(`${operatorMap[conditions.amountRange.operator]} ¥${conditions.amountRange.value}`)
  }
  
  if (conditions.isExtra !== undefined) {
    parts.push(conditions.isExtra ? '额外支出' : '普通支出')
  }
  
  if (conditions.description) {
    parts.push(`描述包含"${conditions.description}"`)
  }
  
  return parts.length > 0 ? parts.join('，') : '无筛选条件'
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