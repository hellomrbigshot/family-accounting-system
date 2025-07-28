<template>
  <div>
    <!-- 触发按钮 -->
    <van-field
      :label="label"
      readonly
      is-link
      @click="showPicker = true"
    >
      <template #input>
        <span class="text-gray-900">{{ displayText }}</span>
      </template>
    </van-field>

    <!-- 多选弹窗 -->
    <van-popup v-model:show="showPicker" position="bottom" round>
      <div class="p-4">
        <h3 class="text-lg font-medium mb-4">{{ title }}</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <van-checkbox-group v-model="selectedValues">
            <div
              v-for="option in options"
              :key="getValue(option)"
              class="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <van-checkbox :name="getValue(option)" />
              <div class="ml-3 flex items-center">
                <div 
                  v-if="getColor(option)"
                  class="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  :style="{ backgroundColor: getColor(option) }"
                ></div>
                <span class="text-gray-900">{{ getLabel(option) }}</span>
              </div>
            </div>
          </van-checkbox-group>
        </div>
        <div class="mt-4 flex space-x-2">
          <van-button
            type="primary"
            size="small"
            @click="handleConfirm"
          >
            确定
          </van-button>
          <van-button
            type="default"
            size="small"
            @click="handleClear"
          >
            清除
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
interface Option {
  [key: string]: any
}

interface Props {
  modelValue: string[]
  options: Option[]
  label?: string
  title?: string
  placeholder?: string
  labelKey?: string
  valueKey?: string
  colorKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '选择',
  title: '请选择',
  placeholder: '请选择',
  labelKey: 'name',
  valueKey: 'id',
  colorKey: 'color'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'confirm', value: string[]): void
  (e: 'clear'): void
}>()

const showPicker = ref(false)
const selectedValues = ref<string[]>([])

// 获取选项的标签
const getLabel = (option: Option) => {
  return option[props.labelKey] || ''
}

// 获取选项的值
const getValue = (option: Option) => {
  return option[props.valueKey] || ''
}

// 获取选项的颜色
const getColor = (option: Option) => {
  return option[props.colorKey] || ''
}

// 显示文本
const displayText = computed(() => {
  if (!props.modelValue.length) return props.placeholder
  return `已选择 ${props.modelValue.length} 项`
})

// 确认选择
const handleConfirm = () => {
  emit('update:modelValue', selectedValues.value)
  emit('confirm', selectedValues.value)
  showPicker.value = false
}

// 清除选择
const handleClear = () => {
  selectedValues.value = []
  emit('update:modelValue', [])
  emit('clear')
  showPicker.value = false
}

// 监听弹窗显示状态，同步数据
watch(showPicker, (newVal) => {
  if (newVal) {
    selectedValues.value = [...props.modelValue]
  }
})

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  selectedValues.value = [...newVal]
}, { immediate: true })
</script> 