<template>
  <div>
    <div class="mx-auto px-4 pb-6 pt-2">
      <div class="mb-4">
        <PageHeader title="支出日历" />
      </div>

      <CalendarMonthRangeSearch
        :start-month="queryStartMonth"
        :end-month="queryEndMonth"
        @search="handleSearch"
      />

      <div v-if="loading" class="py-10 flex justify-center">
        <van-loading type="spinner" />
      </div>

      <div v-else class="space-y-8">
        <CalendarMonthPanel
          v-for="month in months"
          :key="month.format('YYYY-MM')"
          :month-start="month"
          :by-date="byDate"
          @select-expense-date="handleSelectExpenseDate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { expenseApi, type ExpenseStatsResponse } from '@/api/expense'
import dayjs from '@/utils/dayjs'
import PageHeader from '@/components/PageHeader.vue'
import CalendarMonthRangeSearch from '@/components/CalendarMonthRangeSearch.vue'
import CalendarMonthPanel from '@/components/CalendarMonthPanel.vue'

const loading = ref(true)
const byDate = ref<Record<string, number>>({})
const router = useRouter()

const queryStartMonth = ref(dayjs().subtract(2, 'month').format('YYYY-MM'))
const queryEndMonth = ref(dayjs().format('YYYY-MM'))

const months = computed(() => {
  let start = dayjs(`${queryStartMonth.value}-01`).startOf('month')
  let end = dayjs(`${queryEndMonth.value}-01`).startOf('month')

  if (!start.isValid() || !end.isValid()) {
    return []
  }

  if (end.isBefore(start, 'month')) {
    const tmp = start
    start = end
    end = tmp
  }

  const list: dayjs.Dayjs[] = []
  let cursor = end

  while (!cursor.isBefore(start, 'month')) {
    list.push(cursor)
    cursor = cursor.subtract(1, 'month')
  }

  return list
})

const handleSearch = async (payload: { startMonth: string; endMonth: string }) => {
  queryStartMonth.value = payload.startMonth
  queryEndMonth.value = payload.endMonth
  await load()
}

const handleSelectExpenseDate = (payload: { date: string }) => {
  router.push({
    path: '/expenses',
    query: { startDate: payload.date, endDate: payload.date }
  })
}

const load = async () => {
  loading.value = true
  try {
    const start = dayjs(`${queryStartMonth.value}-01`).startOf('month')
    const end = dayjs(`${queryEndMonth.value}-01`).endOf('month')

    const data: ExpenseStatsResponse = await expenseApi.getStats({
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    })

    const map: Record<string, number> = {}
    const dateStats = Array.isArray(data?.dateStats) ? data.dateStats : []

    for (const row of dateStats) {
      const date = row?._id
      const total = row?.total
      if (typeof date === 'string' && typeof total === 'number') {
        map[date] = total
      }
    }

    byDate.value = map
  } catch (error) {
    console.error('Failed to load calendar stats:', error)
    showToast('加载日历数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})
</script>

<style scoped>
:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}
</style>
