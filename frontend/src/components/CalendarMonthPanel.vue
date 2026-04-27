<template>
  <section class="space-y-3">
    <div class="px-1 flex items-center justify-between">
      <div class="text-lg font-display font-bold text-gray-900">
        {{ monthStart.format('YYYY年MM月') }}
      </div>
      <div class="text-sm text-gray-600 font-medium">
        月合计 {{ formatAmount(monthTotal) }}
      </div>
    </div>

    <div class="bg-white/90 rounded-2xl overflow-hidden calendar-panel pt-2">
      <van-calendar
        type="single"
        :poppable="false"
        :show-title="false"
        :show-confirm="false"
        :lazy-render="false"
        :readonly="false"
        :show-mark="false"
        :show-subtitle="false"
        :row-height="64"
        :min-date="minDate"
        :max-date="maxDate"
        :default-date="defaultDate"
        :formatter="formatDay"
        :safe-area-inset-bottom="false"
        @select="handleSelect"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CalendarDayItem } from 'vant/es/calendar/types'
import dayjs from '@/utils/dayjs'
import { formatAmount } from '@/utils/format'

const props = defineProps<{
  monthStart: dayjs.Dayjs
  byDate: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'select-expense-date', payload: { date: string }): void
}>()

const minDate = computed(() => props.monthStart.startOf('month').toDate())
const maxDate = computed(() => props.monthStart.endOf('month').toDate())

const defaultDate = computed(() => {
  const today = dayjs()
  return props.monthStart.isSame(today, 'month')
    ? today.toDate()
    : props.monthStart.startOf('month').toDate()
})

const monthTotal = computed(() => {
  const start = props.monthStart.startOf('month')
  const end = props.monthStart.endOf('month')

  let sum = 0
  let cursor = start
  while (cursor.isSame(end, 'day') || cursor.isBefore(end, 'day')) {
    const key = cursor.format('YYYY-MM-DD')
    sum += props.byDate[key] || 0
    cursor = cursor.add(1, 'day')
  }

  return sum
})

const formatDay = (day: CalendarDayItem) => {
  if (!day.date) {
    return day
  }

  const d = dayjs(day.date)
  if (d.isBefore(props.monthStart, 'month') || d.isAfter(props.monthStart, 'month')) {
    day.type = 'disabled'
    day.topInfo = ''
    day.bottomInfo = ''
    return day
  }

  const key = d.format('YYYY-MM-DD')
  const amount = props.byDate[key] || 0

  day.topInfo = ''
  day.bottomInfo = amount > 0 ? formatAmount(amount) : ''

  const isToday = d.isSame(dayjs(), 'day')
  if (isToday) {
    day.text = '今'
  }
  if (!isToday && day.type === 'selected') {
    day.type = ''
  }

  return day
}

const handleSelect = (value: Date | Date[]) => {
  if (Array.isArray(value)) {
    return
  }

  const d = dayjs(value)
  if (!d.isValid()) {
    return
  }

  if (!d.isSame(props.monthStart, 'month')) {
    return
  }

  const key = d.format('YYYY-MM-DD')
  const amount = props.byDate[key] || 0
  if (amount <= 0) {
    return
  }

  emit('select-expense-date', { date: key })
}
</script>

<style scoped>
.calendar-panel :deep(.van-calendar__month-title) {
  display: none;
}
</style>
