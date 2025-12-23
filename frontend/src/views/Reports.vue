<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 pb-6 pt-2">
      <!-- 欢迎区域 -->
      <div class="mb-4">
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">报表分析</h1>
        <p class="text-sm text-gray-600 font-medium">今天是 {{ currentDate }}</p>
      </div>

      <!-- 搜索区域 -->
       <div class="py-2.5">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm p-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <van-field
              v-model="query.startDate"
              readonly
              is-link
              placeholder="开始日期"
              class="custom-field"
              @click="showStartDatePicker = true"
            />
            <van-field
              v-model="query.endDate"
              readonly
              is-link
              placeholder="结束日期"
              class="custom-field"
              @click="showEndDatePicker = true"
            />
          </div>

          <div class="mt-4">
            <van-button size="small" type="primary" class="w-full rounded-lg" @click="handleSearch">
              查询
            </van-button>
          </div>
        </div>
       </div>

      <!-- 总金额统计卡片 -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 mb-4 card-hover">
        <div class="text-center">
          <h3 class="text-white text-sm font-semibold mb-3 uppercase tracking-wide">时间段总支出</h3>
          <div class="text-white text-4xl font-display font-bold">
            ¥{{ totalAmount.toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- 额外支出统计卡片 -->
      <div class="bg-gradient-to-r from-warm-500 to-warm-600 rounded-2xl shadow-lg p-6 mb-4 card-hover">
        <div class="text-center">
          <h3 class="text-white text-sm font-semibold mb-3 uppercase tracking-wide">额外支出</h3>
          <div class="text-white text-4xl font-display font-bold">
            ¥{{ extraAmount.toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- 趋势分析 -->
      <trend-analysis
        :data="reportData.trend"
        :loading="loading"
        class="mb-6"
      />

      <!-- 分类分析 -->
      <category-analysis
        :data="reportStore.data"
        :loading="loading"
      />

      <!-- 日期选择器 -->
      <van-popup v-model:show="showStartDatePicker" position="bottom" round>
        <van-date-picker
          v-model="currentStartDate"
          title="选择开始日期"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onStartDateConfirm"
          @cancel="showStartDatePicker = false"
        />
      </van-popup>

      <van-popup v-model:show="showEndDatePicker" position="bottom" round>
        <van-date-picker
          v-model="currentEndDate"
          title="选择结束日期"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onEndDateConfirm"
          @cancel="showEndDatePicker = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrendAnalysis from '@/components/TrendAnalysis.vue';
import CategoryAnalysis from '@/components/CategoryAnalysis.vue';
import { useReportStore } from '@/stores/report';
import type { ReportData } from '@/api/report';
import dayjs from '@/utils/dayjs';

const reportStore = useReportStore();
const loading = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日');
});

const minDate = dayjs('2020-01-01').toDate();
const maxDate = dayjs().toDate();

const query = reactive({
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD')
});

const reportData = reactive({
  trend: {
    expenses: {} as Record<string, number>
  }
});

const currentStartDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);

const currentEndDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);

const handleSearch = async () => {
  loading.value = true;
  try {
    await reportStore.fetchReport(query);
    if (reportStore.data) {
      reportData.trend = reportStore.data.trends;
    }
  } catch (error) {
    console.error('Failed to fetch reports:', error);
  } finally {
    loading.value = false;
  }
};

const onStartDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  query.startDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  showStartDatePicker.value = false;
};

const onEndDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  query.endDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  showEndDatePicker.value = false;
};

// 计算总金额
const totalAmount = computed(() => {
  return reportStore.data.expenses.total;
});

// 计算额外支出金额
const extraAmount = computed(() => {
  return reportStore.data.expenses.extraTotal || 0;
});

// 初始加载
onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
.custom-field :deep(.van-field) {
  background: var(--color-warm-50);
  border-radius: 0.75rem;
  border: 1px solid var(--color-warm-200);
  transition: all 0.2s ease;
}

.custom-field :deep(.van-field:focus-within) {
  background: white;
  border-color: var(--color-warm-400);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.custom-field :deep(.van-field__control) {
  font-size: 14px !important;
  color: #1e293b !important;
  font-family: var(--font-body);
}

.custom-field :deep(.van-field__placeholder) {
  color: #94a3b8 !important;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}
</style> 