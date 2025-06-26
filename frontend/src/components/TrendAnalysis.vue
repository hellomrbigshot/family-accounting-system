<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">趋势分析</h3>
        <div class="flex space-x-2">
          <button
            @click="currentTrend = 'daily'"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentTrend === 'daily'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            日
          </button>
          <button
            @click="currentTrend = 'weekly'"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentTrend === 'weekly'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            周
          </button>
          <button
            @click="currentTrend = 'monthly'"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentTrend === 'monthly'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            月
          </button>
        </div>
      </div>

      <div class="mt-4">
        <div v-if="loading" class="h-64 flex items-center justify-center">
          <van-loading type="spinner" size="24px">加载中...</van-loading>
        </div>
        <div v-else-if="currentTrendData.length === 0" class="h-64 flex items-center justify-center text-gray-500">
          暂无趋势数据
        </div>
        <div v-else>
          <div ref="chartRef" class="h-64"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useReportStore } from '@/stores/report';
import dayjs from '@/utils/dayjs';
import * as echarts from 'echarts';

interface Props {
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

interface TrendItem {
  date: string;
  amount: number;
}

const reportStore = useReportStore();
const currentTrend = ref<'daily' | 'weekly' | 'monthly'>('daily');
const chartRef = ref<HTMLElement>();
let chart: echarts.ECharts | null = null;

const currentTrendData = computed((): TrendItem[] => {
  switch (currentTrend.value) {
    case 'daily':
      return reportStore.dailyTrends;
    case 'weekly':
      return reportStore.weeklyTrends;
    case 'monthly':
      return reportStore.monthlyTrends;
  }
});

const maxAmount = computed(() => {
  if (currentTrendData.value.length === 0) return 1;
  return Math.max(...currentTrendData.value.map((item: TrendItem) => item.amount));
});

const formatDate = (date: string) => {
  const d = dayjs(date);
  switch (currentTrend.value) {
    case 'daily':
      return d.format('MM/DD');
    case 'weekly':
      return `第${Math.ceil(d.date() / 7)}周`;
    case 'monthly':
      return d.format('YYYY/MM');
  }
};

// 初始化图表
const initChart = (chartRef: HTMLElement) => {
  // 检查 DOM 元素上是否已有图表实例
  const existingChart = echarts.getInstanceByDom(chartRef);
  if (existingChart) {
    console.log('DOM 元素上已有图表实例，先销毁');
    existingChart.dispose();
  }
  
  const chart = echarts.init(chartRef);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>支出: ¥${data.value.toFixed(2)}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: currentTrendData.value.map(item => formatDate(item.date)),
      axisLabel: {
        rotate: 45,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        name: '支出',
        type: 'bar',
        data: currentTrendData.value.map(item => item.amount),
        itemStyle: {
          color: function(params: any) {
            const value = params.value;
            const max = maxAmount.value;
            // 最高值使用深色，其他使用浅色
            return value === max ? '#EF4444' : '#F87171';
          },
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
  return chart;
};

// 更新图表
const updateChart = () => {
  if (!chart || !chartRef.value) return;
  
  const option = {
    xAxis: {
      data: currentTrendData.value.map(item => formatDate(item.date))
    },
    series: [
      {
        data: currentTrendData.value.map(item => item.amount),
        itemStyle: {
          color: function(params: any) {
            const value = params.value;
            const max = maxAmount.value;
            return value === max ? '#EF4444' : '#F87171';
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
};

// 监听数据变化
watch([currentTrendData, currentTrend], () => {
  console.log('趋势数据变化:', {
    trend: currentTrend.value,
    data: currentTrendData.value
  });
  nextTick(() => {
    if (chartRef.value && currentTrendData.value.length > 0) {
      if (!chart) {
        console.log('初始化趋势图表');
        chart = initChart(chartRef.value);
      } else {
        console.log('更新趋势图表');
        updateChart();
      }
    } else if (chart && currentTrendData.value.length === 0) {
      console.log('趋势数据为空，销毁图表');
      chart.dispose();
      chart = null;
    }
  });
}, { deep: true });

// 监听加载状态
watch(() => props.loading, (loading) => {
  console.log('加载状态变化:', loading);
  if (!loading) {
    nextTick(() => {
      if (chartRef.value && currentTrendData.value.length > 0) {
        if (!chart) {
          console.log('初始化趋势图表');
          chart = initChart(chartRef.value);
        } else {
          console.log('更新趋势图表');
          updateChart();
        }
      }
    });
  }
});

onMounted(() => {
  console.log('TrendAnalysis 组件挂载');
  // 初始化图表
  nextTick(() => {
    console.log('初始化趋势图表，数据:', currentTrendData.value);
    if (chartRef.value && currentTrendData.value.length > 0) {
      console.log('创建趋势图表');
      chart = initChart(chartRef.value);
    }
  });
});

// 组件卸载时清理图表实例
onUnmounted(() => {
  console.log('TrendAnalysis 组件卸载，清理图表');
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script> 