<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 pb-6 pt-2">
      <!-- 欢迎区域 -->
      <div class="mb-2">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">报表分析</h1>
        <p class="text-sm text-gray-500 font-medium">今天是 {{ currentDate }}</p>
      </div>

      <!-- 搜索区域 -->
       <div class="py-2.5">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-6">
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
            <van-button size="small" type="primary" class="w-full" @click="handleSearch">
              查询
            </van-button>
          </div>
        </div>
       </div>

      <!-- 报表内容区域 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-800">趋势分析</h2>
        </div>
        
        <trend-analysis
          :data="reportData.trend"
          :loading="loading"
        />
      </div>

      <!-- 分类分析区域 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-800">分类分析</h2>
        </div>
        
        <category-analysis
          :data="reportStore.data"
          :loading="loading"
        />
      </div>

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

// 初始加载
onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
.custom-field :deep(.van-field__control) {
  font-size: 14px !important;
  color: #1e293b !important;
}

.custom-field :deep(.van-field__placeholder) {
  color: #94a3b8 !important;
}
</style> 