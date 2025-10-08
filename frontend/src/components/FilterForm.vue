<template>
  <van-popup
    :show="show"
    position="bottom"
    round
    :style="{ height: '90%' }"
    teleport="body"
    @update:show="handleShowUpdate"
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
          <MultiSelect
            v-model="selectedCategories"
            :options="categoryStore.allCategoriesForMapping"
            label="分类筛选"
            title="选择分类"
            placeholder="不限"
            @confirm="handleCategoriesConfirm"
            @clear="handleCategoriesClear"
          />

          <!-- 标签选择 -->
          <MultiSelect
            v-model="form.tags"
            :options="tagStore.tags"
            label="标签筛选"
            title="选择标签"
            placeholder="不限"
            @confirm="handleTagsConfirm"
            @clear="handleTagsClear"
          />

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
    <van-popup
      v-model:show="showAmountRangePicker"
      position="bottom"
      round
      teleport="body"
      :style="{ paddingBottom: '250px' }"
    >
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
            readonly
            clickable
            placeholder="请输入金额"
            @click="showNumberKeyboard = true"
          >
            <template #button>
              <span class="text-gray-500">¥</span>
            </template>
          </van-field>
          <div class="flex space-x-2">
            <van-button
              type="primary"
              size="small"
              :disabled="!isAmountRangeValid"
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
    <van-popup
      v-model:show="showOperatorPicker"
      position="bottom"
      round
      teleport="body"
    >
      <van-picker
        :columns="operatorColumns"
        @confirm="onOperatorConfirm"
        @cancel="showOperatorPicker = false"
      />
    </van-popup>



    <!-- 额外支出选择器 -->
    <van-popup v-model:show="showExtraPicker" position="bottom" round>
      <van-picker
        :columns="extraColumns"
        @confirm="onExtraConfirm"
        @cancel="showExtraPicker = false"
      />
    </van-popup>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model:show="showNumberKeyboard"
      v-model="amountRange.value"
      :maxlength="10"
      theme="custom"
      close-button-text="完成"
      :extra-key="['00', '.']"
      teleport="body"
      :z-index="3000"
      @input="onAmountInput"
      @delete="onAmountDelete"
      @blur="handleAmountFieldBlur"
      @close="showNumberKeyboard = false"
    />

    <!-- 自定义开始日期选择器 -->
    <van-popup v-model:show="showCustomStartDatePicker" position="bottom" round teleport="body">
      <van-date-picker
        v-model="customStartDate"
        title="选择开始日期"
        :min-date="new Date(2020, 0, 1)"
        :max-date="new Date()"
        @confirm="onCustomStartDateConfirm"
        @cancel="showCustomStartDatePicker = false"
      />
    </van-popup>

    <!-- 自定义结束日期选择器 -->
    <van-popup v-model:show="showCustomEndDatePicker" position="bottom" round teleport="body">
      <van-date-picker
        v-model="customEndDate"
        title="选择结束日期"
        :min-date="new Date(2020, 0, 1)"
        :max-date="new Date()"
        @confirm="onCustomEndDateConfirm"
        @cancel="showCustomEndDatePicker = false"
      />
    </van-popup>
  </van-popup>
</template>

<script setup lang="ts">
import { useFilterStore } from '@/stores/filter'
import { useTagStore } from '@/stores/tag'
import { useCategoryStore } from '@/stores/category'
import MultiSelect from './MultiSelect.vue'
import type { FilterData, FilterConditions } from '@/api/filter'

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
const showExtraPicker = ref(false)
const showNumberKeyboard = ref(false)
const showCustomStartDatePicker = ref(false)
const showCustomEndDatePicker = ref(false)

// 自定义日期选择器的当前值
const customStartDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
])
const customEndDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
])

// 时间范围选项
const timeRangeColumns = [
  { text: '不限', value: 'unlimited' },
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
  if (!conditions.timeRange) return '不限'
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
  // 显示自定义日期范围
  if (conditions.timeRange.type === 'custom' && conditions.timeRange.custom) {
    const start = dayjs(conditions.timeRange.custom.startDate).format('YYYY/MM/DD')
    const end = dayjs(conditions.timeRange.custom.endDate).format('YYYY/MM/DD')
    return `${start} - ${end}`
  }
  return '自定义时间'
})

const amountRangeText = computed(() => {
  // 检查 amountRange 是否存在且有效
  if (!conditions.amountRange ||
      !conditions.amountRange.operator ||
      conditions.amountRange.value === undefined ||
      conditions.amountRange.value === null) {
    return '不限'
  }
  const operatorMap: Record<string, string> = {
    gt: '大于',
    lt: '小于',
    eq: '等于',
    gte: '大于等于',
    lte: '小于等于'
  }
  return `${operatorMap[conditions.amountRange.operator]} ¥${conditions.amountRange.value}`
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

// 判断金额范围是否有效
const isAmountRangeValid = computed(() => {
  return amountRange.operator &&
         amountRange.value &&
         amountRange.value.trim() !== '' &&
         !isNaN(parseFloat(amountRange.value))
})

const extraText = computed(() => {
  if (conditions.isExtra === undefined) return '不限'
  return conditions.isExtra ? '额外支出' : '普通支出'
})

// 初始化表单数据
const initForm = () => {
  if (props.editData) {
    form.name = props.editData.name || ''
    form.description = props.editData.conditions?.description || ''
    form.tags = props.editData.conditions?.tags || []
    selectedCategories.value = props.editData.conditions?.categories || []
    // 使用响应式方式设置条件对象
    Object.assign(conditions, props.editData.conditions || {})

    // 确保表单数据和条件数据同步
    conditions.tags = [...form.tags]
    conditions.categories = [...selectedCategories.value]
    conditions.description = form.description

    // 初始化金额范围临时数据
    if (props.editData.conditions?.amountRange) {
      amountRange.operator = props.editData.conditions.amountRange.operator || 'gt'
      const value = props.editData.conditions.amountRange.value
      amountRange.value = value !== undefined && value !== null ? value.toString() : ''
    }

    // 初始化自定义日期选择器的值
    if (props.editData.conditions?.timeRange?.type === 'custom' &&
        props.editData.conditions.timeRange.custom) {
      const startDate = dayjs(props.editData.conditions.timeRange.custom.startDate)
      const endDate = dayjs(props.editData.conditions.timeRange.custom.endDate)

      customStartDate.value = [
        startDate.year().toString(),
        (startDate.month() + 1).toString().padStart(2, '0'),
        startDate.date().toString().padStart(2, '0')
      ]

      customEndDate.value = [
        endDate.year().toString(),
        (endDate.month() + 1).toString().padStart(2, '0'),
        endDate.date().toString().padStart(2, '0')
      ]
    } else {
      // 如果不是自定义时间，重置日期选择器的值
      const now = dayjs()
      customStartDate.value = [
        now.year().toString(),
        (now.month() + 1).toString().padStart(2, '0'),
        now.date().toString().padStart(2, '0')
      ]
      customEndDate.value = [
        now.year().toString(),
        (now.month() + 1).toString().padStart(2, '0'),
        now.date().toString().padStart(2, '0')
      ]
    }
  } else {
    // 新建模式：重置所有数据
    form.name = ''
    form.description = ''
    form.tags = []
    selectedCategories.value = []

    // 重置条件对象 - 不设置默认时间范围
    delete conditions.timeRange

    // 清除其他条件
    delete conditions.amountRange
    delete conditions.tags
    delete conditions.categories
    delete conditions.isExtra
    delete conditions.description

    // 重置金额范围临时数据
    amountRange.operator = 'gt'
    amountRange.value = ''

    // 重置自定义日期选择器的值
    const now = dayjs()
    customStartDate.value = [
      now.year().toString(),
      (now.month() + 1).toString().padStart(2, '0'),
      now.date().toString().padStart(2, '0')
    ]
    customEndDate.value = [
      now.year().toString(),
      (now.month() + 1).toString().padStart(2, '0'),
      now.date().toString().padStart(2, '0')
    ]
  }
}

// 时间范围确认
const onTimeRangeConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const value = selectedValues[0]
  if (value === 'unlimited') {
    // 不限：设置特殊标记，而不是删除
    conditions.timeRange = {
      type: 'unlimited'
    }
    showTimeRangePicker.value = false
  } else if (value === 'custom') {
    // 自定义：显示日期选择器
    showTimeRangePicker.value = false
    // 延迟显示，避免弹窗冲突
    setTimeout(() => {
      showCustomStartDatePicker.value = true
    }, 300)
  } else {
    conditions.timeRange = {
      type: 'preset',
      preset: value as any
    }
    showTimeRangePicker.value = false
  }
}

// 确认自定义开始日期
const onCustomStartDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  customStartDate.value = selectedValues
  showCustomStartDatePicker.value = false
  // 显示结束日期选择器
  showCustomEndDatePicker.value = true
}

// 确认自定义结束日期
const onCustomEndDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  customEndDate.value = selectedValues

  // 设置自定义时间范围
  const startDate = dayjs(`${customStartDate.value.join('-')}`)
    .startOf('day')  // 00:00:00
    .toISOString()

  const endDate = dayjs(`${selectedValues.join('-')}`)
    .endOf('day')    // 23:59:59.999
    .toISOString()

  conditions.timeRange = {
    type: 'custom',
    custom: {
      startDate,
      endDate
    }
  }

  showCustomEndDatePicker.value = false
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
    amountRange.operator = conditions.amountRange.operator || 'gt'
    const value = conditions.amountRange.value
    amountRange.value = value !== undefined && value !== null ? value.toString() : ''
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

// 金额输入
const onAmountInput = (value: string) => {
  amountRange.value = value
}

// 金额删除
const onAmountDelete = () => {
  amountRange.value = amountRange.value.slice(0, -1)
}

// 金额字段失焦处理
const handleAmountFieldBlur = () => {
  showNumberKeyboard.value = false
}

// 监听金额范围选择器弹窗显示状态
watch(showAmountRangePicker, (newVal) => {
  if (newVal) {
    syncAmountRangeToTemp()
  }
})

// 标签确认处理
const handleTagsConfirm = (values: string[]) => {
  form.tags = values
  conditions.tags = [...values]
}

// 标签清除处理
const handleTagsClear = () => {
  form.tags = []
  conditions.tags = []
}

// 分类确认处理
const handleCategoriesConfirm = (values: string[]) => {
  selectedCategories.value = values
  conditions.categories = [...values]
}

// 分类清除处理
const handleCategoriesClear = () => {
  selectedCategories.value = []
  conditions.categories = []
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

    // 同步表单数据到条件对象
    conditions.tags = [...form.tags]
    conditions.categories = [...selectedCategories.value]
    conditions.description = form.description.trim() || undefined

    const filterData = {
      name: form.name.trim(),
      conditions: { ...conditions }
    }
    let success = false
    if (isEditMode.value && props.editData) {
      success = await filterStore.updateFilter(props.editData.id, filterData)
    } else {
      success = await filterStore.createFilter(filterData)
    }
    if (success) {
      emit('success')
      handleClose()
    }
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
</script>
