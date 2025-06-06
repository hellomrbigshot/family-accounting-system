<template>
  <van-dialog
    :show="show"
    @update:show="emit('update:show', $event)"
    title="添加支出"
    :show-cancel-button="true"
    class="expense-dialog"
    :before-close="handleBeforeClose"
    destroy-on-close
    close-on-click-overlay
  >
    <div class="p-4">
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">金额</div>
        <van-field
          v-model="expenseAmount"
          readonly
          clickable
          label=""
          placeholder="请输入金额"
          @click="showNumberKeyboard = true"
          class="amount-field"
          :label-width="0"
          left-icon="￥"
        />
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">分类</div>
        <van-field
          v-model="selectedCategory"
          readonly
          clickable
          label=""
          placeholder="选择分类"
          @click="showCategoryPicker = true"
        />
        <van-popup v-model:show="showCategoryPicker" position="bottom" round>
          <van-picker
            :columns="categoryColumns"
            @confirm="onCategoryConfirm"
            @cancel="showCategoryPicker = false"
            show-toolbar
            title="选择分类"
            confirm-button-text="确认"
            cancel-button-text="取消"
          />
        </van-popup>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">日期</div>
        <van-field
          v-model="formattedDate"
          readonly
          clickable
          label=""
          placeholder="选择日期"
          @click="showDatePicker = true"
        />
        <van-popup v-model:show="showDatePicker" position="bottom" round>
          <van-date-picker
            v-model="expenseDate"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onDateConfirm"
            @cancel="showDatePicker = false"
            :columns-type="['year', 'month', 'day']"
            :formatter="dateFormatter"
            confirm-button-text="确认"
            cancel-button-text="取消"
          />
        </van-popup>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">备注</div>
        <van-field
          v-model="expenseDescription"
          type="textarea"
          placeholder="请输入备注"
          rows="2"
          autosize
        />
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">标签</div>
        <van-field
          label="标签"
          readonly
          placeholder="请选择标签"
          @click="showTagPicker = true"
        >
          <template #input>
            <div class="flex flex-wrap gap-2">
              <van-tag
                v-for="tag in selectedTags"
                :key="tag.id"
                :color="tag.color"
                plain
                class="px-2 py-1"
              >
                {{ tag.name }}
              </van-tag>
            </div>
          </template>
        </van-field>
      </div>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model:show="showNumberKeyboard"
      v-model="expenseAmount"
      @input="onAmountInput"
      @delete="onAmountDelete"
      @blur="showNumberKeyboard = false"
      :maxlength="10"
      theme="custom"
      close-button-text="完成"
      :extra-key="['00', '.']"
      :z-index="3000"
      teleport="body"
    />

    <!-- 分类选择器 -->
    <van-popup v-model:show="showCategoryPicker" position="bottom">
      <van-picker
        :columns="categoryColumns"
        @confirm="onCategoryConfirm"
        @cancel="showCategoryPicker = false"
      />
    </van-popup>

    <!-- 标签选择器 -->
    <van-popup v-model:show="showTagPicker" position="bottom">
      <van-checkbox-group v-model="form.tags">
        <div class="p-4">
          <div class="grid grid-cols-2 gap-2">
            <van-checkbox
              v-for="tag in tags"
              :key="tag.id"
              :name="tag.id"
              shape="square"
              icon-size="16px"
              checked-color="#1989fa"
            >
              <span class="tag-text" :style="{ color: tag.color }">{{ tag.name }}</span>
            </van-checkbox>
          </div>
        </div>
      </van-checkbox-group>
      <div class="p-4 border-t border-gray-200">
        <van-button
          type="primary"
          block
          @click="showTagPicker = false"
        >
          确定
        </van-button>
      </div>
    </van-popup>
  </van-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useExpenseStore } from '@/stores/expense'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '../stores/tag'

import dayjs from 'dayjs'
import type { TagData } from '@/api/tag'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

const expenseStore = useExpenseStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

interface FormData {
  amount: number
  date: string
  category: string
  description: string
  tags: string[]
}

const form = reactive<FormData>({
  amount: 0,
  date: dayjs().format('YYYY-MM-DD'),
  category: '',
  description: '',
  tags: []
})

// 添加支出对话框
const showNumberKeyboard = ref(false)
const expenseAmount = ref('')
const selectedCategory = ref('')
const showCategoryPicker = ref(false)
const expenseDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
])
const showDatePicker = ref(false)
const expenseDescription = ref('')
const showTagPicker = ref(false)

// 日期显示
const formattedDate = computed(() => {
  if (expenseDate.value.length !== 3) return ''
  const [year, month, day] = expenseDate.value
  return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD')
})

// 日期范围
const minDate = new Date(2020, 0, 1)
const maxDate = new Date()

// 分类选择器
const categoryColumns = computed(() => {
  return categoryStore.categories
    .filter(category => category.type === 'expense')
    .map(category => ({
      text: `${category.icon} ${category.name}`,
      value: category.id
    }))
})

// 标签列表
const tags = computed(() => tagStore.tags)

// 已选标签
const selectedTags = computed(() => {
  return tags.value.filter((tag: TagData) => form.tags.includes(tag.id))
})

// 监听对话框显示状态
watch(() => props.show, (newValue) => {
  if (newValue) {
    // 重置表单
    form.amount = 0
    form.date = dayjs().format('YYYY-MM-DD')
    form.category = ''
    form.description = ''
    form.tags = []
    expenseAmount.value = ''
    expenseDate.value = [
      dayjs().year().toString(),
      (dayjs().month() + 1).toString().padStart(2, '0'),
      dayjs().date().toString().padStart(2, '0')
    ]
    expenseDescription.value = ''
  }
})

// 处理分类选择
const onCategoryConfirm = ({ selectedOptions }: { selectedOptions: { text: string; value: string }[] }) => {
  const selected = selectedOptions[0]
  selectedCategory.value = selected.text
  form.category = selected.value  // 保存分类 ID
  showCategoryPicker.value = false
}

// 处理数字输入
const onAmountInput = (value: string) => {
  // 如果输入的是小数点，且已经存在小数点，则不添加
  if (value === '.' && expenseAmount.value.includes('.')) {
    return
  }

  // 如果输入的是小数点，且是第一个字符，则添加前导零
  if (value === '.' && !expenseAmount.value) {
    expenseAmount.value = '0.'
    return
  }

  // 如果已经有两个小数位，则不再添加
  if (expenseAmount.value.includes('.')) {
    const [, decimal] = expenseAmount.value.split('.')
    if (decimal.length >= 2) {
      return
    }
  }

  // 如果输入的是 00，且当前值为空或为 0，则不添加
  if (value === '00' && (!expenseAmount.value || expenseAmount.value === '0')) {
    return
  }

  // 如果当前值为 0，且输入的不是小数点，则替换当前值
  if (expenseAmount.value === '0' && value !== '.') {
    expenseAmount.value = value
    return
  }

  expenseAmount.value += value
  form.amount = parseFloat(expenseAmount.value) || 0
}

// 处理删除
const onAmountDelete = () => {
  expenseAmount.value = expenseAmount.value.slice(0, -1)
  form.amount = parseFloat(expenseAmount.value) || 0
}

// 处理日期选择
const onDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  expenseDate.value = selectedValues
  const [year, month, day] = selectedValues
  form.date = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD')
  showDatePicker.value = false
}

// 处理关闭前验证
const handleBeforeClose = async (action: string) => {
  if (action === 'confirm') {
    if (!expenseAmount.value) {
      showToast({
        message: '请输入金额',
        position: 'middle',
        duration: 2000
      })
      return false
    }

    const amount = parseFloat(expenseAmount.value)
    if (isNaN(amount) || amount <= 0) {
      showToast({
        message: '请输入有效的金额',
        position: 'middle',
        duration: 2000
      })
      return false
    }

    if (!form.category) {
      showToast({
        message: '请选择分类',
        position: 'middle',
        duration: 2000
      })
      return false
    }

    try {
      await expenseStore.createExpense({
        date: form.date,
        category: form.category,
        amount: amount,
        description: expenseDescription.value,
        tags: form.tags
      })

      showToast({
        message: '添加成功',
        position: 'middle',
        duration: 2000
      })
      emit('success')
      emit('update:show', false)
      expenseAmount.value = ''
      selectedCategory.value = ''
      form.category = ''
      expenseDescription.value = ''
      return true
    } catch (error: any) {
      showToast({
        message: error.response?.data?.message || '添加失败',
        position: 'middle',
        duration: 2000
      })
      return false
    }
  }
  return true
}

// 日期格式化
const dateFormatter = (type: string, option: any) => {
  if (type === 'year') {
    option.text += '年'
  }
  if (type === 'month') {
    option.text += '月'
  }
  if (type === 'day') {
    option.text += '日'
  }
  return option
}

// 提交表单
const handleSubmit = async () => {
  try {
    await expenseStore.createExpense({
      ...form,
      amount: parseFloat(form.amount.toString())
    })
    showToast('保存成功')
    emit('success')
    emit('update:show', false)
  } catch (error) {
    console.error('Failed to create expense:', error)
    showToast('保存失败')
  }
}
</script>

<style>
:deep(.expense-dialog .van-dialog__content) {
  max-height: 60vh;
  overflow-y: auto;
}

.amount-field :deep(.van-field__control) {
  font-size: 16px !important;
  font-weight: 500 !important;
  padding-left: 0 !important;
}

.amount-field :deep(.van-field__left-icon) {
  margin-right: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style> 