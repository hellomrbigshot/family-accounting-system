<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '90%' }"
    :z-index="3000"
    teleport="body"
  >
    <div class="h-full flex flex-col">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">{{ isEditMode ? '编辑筛选器' : '新建筛选器' }}</h2>
        <van-icon name="cross" size="20" @click="handleClose" />
      </div>

      <!-- 表单内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <van-form class="space-y-4" @submit="handleSubmit">
          <!-- 筛选器名称 -->
          <van-field
            v-model="form.name"
            name="name"
            label="筛选器名称"
            placeholder="请输入筛选器名称"
            :rules="[{ required: true, message: '请输入筛选器名称' }]"
          />

          <!-- 时间范围 -->
          <van-field
            name="timeRange"
            label="时间范围"
            readonly
            is-link
            @click="showTimeRangePicker = true"
          >
            <template #input>
              <span class="text-gray-900">{{ timeRangeText }}</span>
            </template>
          </van-field>

          <!-- 金额范围 -->
          <van-field
            name="amountRanges"
            label="金额范围"
            readonly
            is-link
            @click="showAmountRangePicker = true"
          >
            <template #input>
              <span class="text-gray-900">{{ amountRangeText }}</span>
            </template>
          </van-field>

          <!-- 分类选择 -->
          <van-field
            name="categories"
            label="分类筛选"
            readonly
            is-link
            @click="showCategoryPicker = true"
          >
            <template #input>
              <span class="text-gray-900">{{ categoriesText }}</span>
            </template>
          </van-field>

          <!-- 标签选择 -->
          <van-field
            name="tags"
            label="标签筛选"
            readonly
            is-link
            @click="showTagPicker = true"
          >
            <template #input>
              <div class="flex flex-wrap gap-2 min-h-[24px]">
                <div
                  v-for="tag in selectedTags"
                  :key="tag.id"
                  class="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  <div 
                    class="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                    :style="{ backgroundColor: tag.color }"
                  ></div>
                  <span class="text-gray-700">{{ tag.name }}</span>
                </div>
                <span v-if="selectedTags.length === 0" class="text-gray-400 text-sm">
                  请选择标签（可选）
                </span>
              </div>
            </template>
          </van-field>

          <!-- 额外支出状态 -->
          <van-field
            name="isExtra"
            label="支出类型"
            readonly
            is-link
            @click="showExtraPicker = true"
          >
            <template #input>
              <span class="text-gray-900">{{ extraText }}</span>
            </template>
          </van-field>

          <!-- 描述关键词 -->
          <van-field
            v-model="form.description"
            name="description"
            label="描述关键词"
            placeholder="请输入描述关键词（可选）"
            type="textarea"
            rows="2"
            autosize
            maxlength="200"
            show-word-limit
          />

          <!-- 提交按钮 -->
          <div class="pt-4">
            <van-button
              type="primary"
              block
              :loading="loading"
              native-type="submit"
            >
              {{ isEditMode ? '更新' : '创建' }}
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 时间范围选择器 -->
    <van-popup v-model:show="showTimeRangePicker" position="bottom" round>
      <van-picker
        :columns="timeRangeColumns"
        @confirm="onTimeRangeConfirm"
        @cancel="showTimeRangePicker = false"
      />
    </van-popup>

    <!-- 金额范围选择器 -->
    <van-popup v-model:show="showAmountRangePicker" position="bottom" round>
      <div class="p-4">
        <div class="space-y-4">
          <van-field
            label="比较方式"
            readonly
            is-link
            @click="showOperatorPicker = true"
          >
            <template #input>
              <span class="text-gray-900">{{ operatorText }}</span>
            </template>
          </van-field>
          <van-field
            v-model="amountRange.value"
            label="金额"
            type="number"
            placeholder="请输入金额"
          />
          <div class="flex space-x-2">
            <van-button
              type="primary"
              size="small"
              @click="confirmAmountRange"
            >
              确定
            </van-button>
            <van-button
              type="default"
              size="small"
              @click="clearAmountRange"
            >
              清除
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 比较方式选择器 -->
    <van-popup v-model:show="showOperatorPicker" position="bottom" round>
      <van-picker
        :columns="operatorColumns"
        @confirm="onOperatorConfirm"
        @cancel="showOperatorPicker = false"
      />
    </van-popup>

    <!-- 标签选择器 -->
    <van-popup v-model:show="showTagPicker" position="bottom" round>
      <div class="p-4">
        <h3 class="text-lg font-medium mb-4">选择标签</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <van-checkbox-group v-model="form.tags">
            <div
              v-for="tag in tagStore.tags"
              :key="tag.id"
              class="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <van-checkbox :name="tag.id" />
              <div class="ml-3 flex items-center">
                <div 
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: tag.color }"
                ></div>
                <span class="text-gray-900">{{ tag.name }}</span>
              </div>
            </div>
          </van-checkbox-group>
        </div>
        <div class="mt-4 flex space-x-2">
          <van-button
            type="primary"
            size="small"
            @click="confirmTags"
          >
            确定
          </van-button>
          <van-button
            type="default"
            size="small"
            @click="clearTags"
          >
            清除
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 分类选择器 -->
    <van-popup v-model:show="showCategoryPicker" position="bottom" round>
      <div class="p-4">
        <h3 class="text-lg font-medium mb-4">选择分类</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <van-checkbox-group v-model="selectedCategories">
            <div
              v-for="category in categoryStore.allCategoriesForMapping"
              :key="category.id"
              class="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <van-checkbox :name="category.id" />
              <div class="ml-3 flex items-center">
                <div 
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-gray-900">{{ category.name }}</span>
              </div>
            </div>
          </van-checkbox-group>
        </div>
        <div class="mt-4 flex space-x-2">
          <van-button
            type="primary"
            size="small"
            @click="confirmCategories"
          >
            确定
          </van-button>
          <van-button
            type="default"
            size="small"
            @click="clearCategories"
          >
            清除
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 额外支出选择器 -->
    <van-popup v-model:show="showExtraPicker" position="bottom" round>
      <van-picker
        :columns="extraColumns"
        @confirm="onExtraConfirm"
        @cancel="showExtraPicker = false"
      />
    </van-popup>
  </van-popup>
</template>

<script setup lang="ts">
import { useFilterStore } from '@/stores/filter'
import { useTagStore } from '@/stores/tag'
import { useCategoryStore } from '@/stores/category'
import type { FilterData, FilterConditions } from '@/api/filter'
import type { TagData } from '@/api/tag'

const props = defineProps<{
  show: boolean
  editData?: FilterData | null
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

const filterStore = useFilterStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()
const loading = ref(false)
const isEditMode = computed(() => !!props.editData)

// 表单数据
const form = reactive({
  name: '',
  description: '',
  tags: [] as string[]
})

// 筛选条件
const conditions = reactive<FilterConditions>({
  timeRange: {
    type: 'preset',
    preset: 'week'
  }
})

// 金额范围临时数据
const amountRange = reactive({
  operator: 'gt' as 'gt' | 'lt' | 'eq' | 'gte' | 'lte',
  value: ''
})

// 分类选择
const selectedCategories = ref<string[]>([])

// 选择器状态
const showTimeRangePicker = ref(false)
const showAmountRangePicker = ref(false)
const showOperatorPicker = ref(false)
const showTagPicker = ref(false)
const showCategoryPicker = ref(false)
const showExtraPicker = ref(false)

// 时间范围选项
const timeRangeColumns = [
  { text: '本周', value: 'week' },
  { text: '本月', value: 'month' },
  { text: '本季度', value: 'quarter' },
  { text: '本年度', value: 'year' },
  { text: '上周', value: 'lastWeek' },
  { text: '上月', value: 'lastMonth' },
  { text: '去年', value: 'lastYear' },
  { text: '自定义', value: 'custom' }
]

// 比较方式选项
const operatorColumns = [
  { text: '大于', value: 'gt' },
  { text: '小于', value: 'lt' },
  { text: '等于', value: 'eq' },
  { text: '大于等于', value: 'gte' },
  { text: '小于等于', value: 'lte' }
]

// 额外支出选项
const extraColumns = [
  { text: '不限', value: 'unlimited' },
  { text: '额外支出', value: 'extra' },
  { text: '普通支出', value: 'normal' }
]

// 显示文本
const timeRangeText = computed(() => {
  if (!conditions.timeRange) return '请选择时间范围'
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
    return presetMap[conditions.timeRange.preset]
  }
  return '自定义时间'
})

const amountRangeText = computed(() => {
  if (!conditions.amountRange) return '请选择金额范围'
  const operatorMap: Record<string, string> = {
    gt: '大于',
    lt: '小于',
    eq: '等于',
    gte: '大于等于',
    lte: '小于等于'
  }
  return `${operatorMap[conditions.amountRange.operator]} ¥${conditions.amountRange.value}`
})

const categoriesText = computed(() => {
  if (!selectedCategories.value.length) return '请选择分类'
  return `已选择 ${selectedCategories.value.length} 个分类`
})

const operatorText = computed(() => {
  const operatorMap: Record<string, string> = {
    gt: '大于',
    lt: '小于',
    eq: '等于',
    gte: '大于等于',
    lte: '小于等于'
  }
  return operatorMap[amountRange.operator] || '请选择比较方式'
})

const extraText = computed(() => {
  if (conditions.isExtra === undefined) return '不限'
  return conditions.isExtra ? '额外支出' : '普通支出'
})

const selectedTags = computed(() => {
  return tagStore.tags.filter(tag => form.tags.includes(tag.id))
})

// 初始化表单数据
const initForm = () => {
  if (props.editData) {
    form.name = props.editData.name
    form.description = props.editData.conditions.description || ''
    form.tags = props.editData.conditions.tags || []
    selectedCategories.value = props.editData.conditions.categories || []
    Object.assign(conditions, props.editData.conditions)
    
    // 初始化金额范围临时数据
    if (props.editData.conditions.amountRange) {
      amountRange.operator = props.editData.conditions.amountRange.operator
      amountRange.value = props.editData.conditions.amountRange.value.toString()
    }
  } else {
    form.name = ''
    form.description = ''
    form.tags = []
    selectedCategories.value = []
    Object.assign(conditions, {
      timeRange: {
        type: 'preset',
        preset: 'week'
      }
    })
    
    // 重置金额范围临时数据
    amountRange.operator = 'gt'
    amountRange.value = ''
  }
}

// 时间范围确认
const onTimeRangeConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const value = selectedValues[0]
  if (value === 'custom') {
    // TODO: 实现自定义时间选择
    conditions.timeRange = {
      type: 'custom',
      custom: {
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString()
      }
    }
  } else {
    conditions.timeRange = {
      type: 'preset',
      preset: value as any
    }
  }
  showTimeRangePicker.value = false
}

// 比较方式确认
const onOperatorConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  amountRange.operator = selectedValues[0] as any
  showOperatorPicker.value = false
}

// 确认金额范围
const confirmAmountRange = () => {
  if (amountRange.value) {
    conditions.amountRange = {
      operator: amountRange.operator,
      value: parseFloat(amountRange.value)
    }
  } else {
    delete conditions.amountRange
  }
  showAmountRangePicker.value = false
}

// 同步金额范围数据到临时变量
const syncAmountRangeToTemp = () => {
  if (conditions.amountRange) {
    amountRange.operator = conditions.amountRange.operator
    amountRange.value = conditions.amountRange.value.toString()
  } else {
    amountRange.operator = 'gt'
    amountRange.value = ''
  }
}

// 清除金额范围
const clearAmountRange = () => {
  delete conditions.amountRange
  amountRange.value = ''
  showAmountRangePicker.value = false
}

// 监听金额范围选择器弹窗显示状态
watch(showAmountRangePicker, (newVal) => {
  if (newVal) {
    syncAmountRangeToTemp()
  }
})

// 确认标签
const confirmTags = () => {
  showTagPicker.value = false
}

// 清除标签
const clearTags = () => {
  form.tags = []
  showTagPicker.value = false
}

// 确认分类
const confirmCategories = () => {
  conditions.categories = selectedCategories.value
  showCategoryPicker.value = false
}

// 清除分类
const clearCategories = () => {
  selectedCategories.value = []
  delete conditions.categories
  showCategoryPicker.value = false
}

// 额外支出确认
const onExtraConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const value = selectedValues[0]
  if (value === 'extra') {
    conditions.isExtra = true
  } else if (value === 'normal') {
    conditions.isExtra = false
  } else {
    conditions.isExtra = undefined
  }
  showExtraPicker.value = false
}

// 提交表单
const handleSubmit = async () => {
  try {
    loading.value = true
    
    const filterData = {
      name: form.name.trim(),
      conditions: { ...conditions }
    }
    
    if (isEditMode.value && props.editData) {
      await filterStore.updateFilter(props.editData.id, filterData)
    } else {
      await filterStore.createFilter(filterData)
    }
    
    emit('success')
    handleClose()
  } catch (error) {
    console.error('保存筛选器失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理显示状态更新
const handleShowUpdate = (value: boolean) => {
  emit('update:show', value)
}

// 关闭弹窗
const handleClose = () => {
  emit('update:show', false)
}

// 监听显示状态
watch(() => props.show, (newValue) => {
  if (newValue) {
    initForm()
  }
})

// 组件挂载时获取标签数据
onMounted(() => {
  tagStore.fetchTags()
})
</script> 