<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm p-4 pt-2 mb-6">
    <div class="grid grid-cols-2 gap-4">
      <van-field
        :model-value="formattedStartMonth"
        readonly
        is-link
        placeholder="开始月份"
        class="[&_.van-field]:bg-[color:var(--color-warm-50)] [&_.van-field]:rounded-xl [&_.van-field]:border [&_.van-field]:border-[color:var(--color-warm-200)] [&_.van-field:focus-within]:bg-white [&_.van-field:focus-within]:border-[color:var(--color-warm-400)] [&_.van-field:focus-within]:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] [&_.van-field\_\_control]:text-sm [&_.van-field\_\_control]:text-slate-900 [&_.van-field\_\_control]:font-[family-name:var(--font-body)] [&_.van-field\_\_placeholder]:text-slate-400"
        @click="openStartPicker"
      />
      <van-field
        :model-value="formattedEndMonth"
        readonly
        is-link
        placeholder="结束月份"
        class="[&_.van-field]:bg-[color:var(--color-warm-50)] [&_.van-field]:rounded-xl [&_.van-field]:border [&_.van-field]:border-[color:var(--color-warm-200)] [&_.van-field:focus-within]:bg-white [&_.van-field:focus-within]:border-[color:var(--color-warm-400)] [&_.van-field:focus-within]:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] [&_.van-field\_\_control]:text-sm [&_.van-field\_\_control]:text-slate-900 [&_.van-field\_\_control]:font-[family-name:var(--font-body)] [&_.van-field\_\_placeholder]:text-slate-400"
        @click="openEndPicker"
      />
    </div>

    <div class="mt-4">
      <van-button size="small" type="primary" class="w-full rounded-lg" @click="emitSearch">
        查询
      </van-button>
    </div>
  </div>

  <van-popup v-model:show="showStartPicker" position="bottom" round>
    <van-date-picker
      v-model="selectedStartMonth"
      type="year-month"
      title="选择开始月份"
      :min-date="pickerMinDate"
      :max-date="pickerMaxDate"
      :columns-type="['year', 'month']"
      @confirm="onStartMonthConfirm"
      @cancel="showStartPicker = false"
    />
  </van-popup>

  <van-popup v-model:show="showEndPicker" position="bottom" round>
    <van-date-picker
      v-model="selectedEndMonth"
      type="year-month"
      title="选择结束月份"
      :min-date="pickerMinDate"
      :max-date="pickerMaxDate"
      :columns-type="['year', 'month']"
      @confirm="onEndMonthConfirm"
      @cancel="showEndPicker = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import dayjs from '@/utils/dayjs'

const props = defineProps<{
  startMonth: string
  endMonth: string
}>()

const emit = defineEmits<{
  (e: 'search', payload: { startMonth: string; endMonth: string }): void
}>()

const showStartPicker = ref(false)
const showEndPicker = ref(false)

const selectedStartMonth = ref<string[]>([])
const selectedEndMonth = ref<string[]>([])

const snapshotSelectedMonths = () => {
  return {
    start: [...selectedStartMonth.value],
    end: [...selectedEndMonth.value]
  }
}

const restoreSelectedMonths = (snapshot: { start: string[]; end: string[] }) => {
  selectedStartMonth.value = [...snapshot.start]
  selectedEndMonth.value = [...snapshot.end]
}

const pickerMinDate = new Date(2020, 0, 1)
const pickerMaxDate = new Date(dayjs().add(5, 'year').year(), 11, 31)

const formattedStartMonth = computed(() => {
  if (selectedStartMonth.value.length !== 2) return ''
  const [year, month] = selectedStartMonth.value
  return `${year}年${month}月`
})

const formattedEndMonth = computed(() => {
  if (selectedEndMonth.value.length !== 2) return ''
  const [year, month] = selectedEndMonth.value
  return `${year}年${month}月`
})

const syncFromProps = () => {
  const start = dayjs(`${props.startMonth}-01`)
  const end = dayjs(`${props.endMonth}-01`)

  if (!start.isValid() || !end.isValid()) {
    return
  }

  selectedStartMonth.value = [
    start.year().toString(),
    (start.month() + 1).toString().padStart(2, '0')
  ]

  selectedEndMonth.value = [
    end.year().toString(),
    (end.month() + 1).toString().padStart(2, '0')
  ]
}

watch(
  () => [props.startMonth, props.endMonth],
  () => {
    // 只在父组件“查询成功并更新 props”后同步，避免用户在选择过程中被旧值反复覆盖
    syncFromProps()
  }
)

const monthSpanInclusive = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
  return end.startOf('month').diff(start.startOf('month'), 'month') + 1
}

const normalizeMonths = () => {
  if (selectedStartMonth.value.length !== 2 || selectedEndMonth.value.length !== 2) {
    showToast('请选择完整的月份范围')
    return null
  }

  let start = dayjs(`${selectedStartMonth.value[0]}-${selectedStartMonth.value[1]}-01`).startOf('month')
  let end = dayjs(`${selectedEndMonth.value[0]}-${selectedEndMonth.value[1]}-01`).startOf('month')

  if (!start.isValid() || !end.isValid()) {
    showToast('请选择有效的月份范围')
    return null
  }

  if (end.isBefore(start, 'month')) {
    const tmp = start
    start = end
    end = tmp
  }

  if (monthSpanInclusive(start, end) > 3) {
    showToast('一次最多查询三个月')
    return null
  }

  return {
    startMonth: start.format('YYYY-MM'),
    endMonth: end.format('YYYY-MM')
  }
}

const openStartPicker = () => {
  showStartPicker.value = true
}

const openEndPicker = () => {
  showEndPicker.value = true
}

const onStartMonthConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  selectedStartMonth.value = selectedValues
  showStartPicker.value = false
}

const onEndMonthConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  selectedEndMonth.value = selectedValues
  showEndPicker.value = false
}

const emitSearch = () => {
  const snapshot = snapshotSelectedMonths()
  const normalized = normalizeMonths()
  if (!normalized) {
    restoreSelectedMonths(snapshot)
    return
  }

  emit('search', normalized)
}

onMounted(() => {
  syncFromProps()
})
</script>
