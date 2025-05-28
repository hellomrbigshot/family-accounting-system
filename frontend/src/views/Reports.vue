<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">报表分析</h1>
        
        <!-- 搜索区域 -->
        <div class="mb-6">
          <van-form @submit="handleSearch" class="space-y-4">
            <van-cell-group inset>
              <van-field
                v-model="query.startDate"
                name="startDate"
                label="开始日期"
                readonly
                is-link
                @click="showStartDatePicker = true"
                class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
              />
              <van-field
                v-model="query.endDate"
                name="endDate"
                label="结束日期"
                readonly
                is-link
                @click="showEndDatePicker = true"
                class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
              />
            </van-cell-group>
            <div class="flex justify-end">
              <van-button type="primary" native-type="submit" class="w-24">
                查询
              </van-button>
            </div>
          </van-form>
        </div>

        <!-- 报表内容 -->
        <div class="space-y-6">
          <trend-analysis
            :data="reportData.trend"
            :loading="loading"
            class="bg-white rounded-xl shadow-sm p-6 border"
          />
          
          <category-analysis
            :data="reportData.category"
            :loading="loading"
            class="bg-white rounded-xl shadow-sm p-6 border"
          />
        </div>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showStartDatePicker" position="bottom">
      <van-date-picker
        v-model="currentStartDate"
        title="选择开始日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onStartDateConfirm"
        @cancel="showStartDatePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showEndDatePicker" position="bottom">
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import dayjs from '@/utils/dayjs';
import TrendAnalysis from '@/components/TrendAnalysis.vue';
import CategoryAnalysis from '@/components/CategoryAnalysis.vue';
import { useReportStore } from '@/stores/report';
import type { ReportData } from '@/api/report';

const reportStore = useReportStore();
const loading = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const minDate = new Date(2020, 0, 1);
const maxDate = new Date();

const query = reactive({
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD')
});

const reportData = reactive({
  trend: {
    daily: {} as Record<string, number>,
    weekly: {} as Record<string, number>,
    monthly: {} as Record<string, number>
  },
  category: {} as Record<string, number>
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
      reportData.category = reportStore.data.expenses.byCategory;
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

// 初始加载
handleSearch();
</script>

<style>
.van-button--primary {
  @apply bg-indigo-600 border-indigo-600;
}

.van-button--primary:active {
  @apply bg-indigo-700 border-indigo-700;
}
</style> 