<template>
  <div class="bg-white/90 backdrop-blur-sm overflow-hidden shadow-warm rounded-2xl card-hover">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-display font-bold text-gray-900">趋势分析</h3>
        <div class="flex space-x-2">
          <button
            @click="currentTrend = 'daily'"
            :class="[
              'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
              currentTrend === 'daily'
                ? 'bg-warm-500 text-white shadow-warm'
                : 'text-gray-600 hover:text-warm-600 hover:bg-warm-50',
            ]"
          >
            日
          </button>
          <button
            @click="currentTrend = 'weekly'"
            :class="[
              'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
              currentTrend === 'weekly'
                ? 'bg-warm-500 text-white shadow-warm'
                : 'text-gray-600 hover:text-warm-600 hover:bg-warm-50',
            ]"
          >
            周
          </button>
          <button
            @click="currentTrend = 'monthly'"
            :class="[
              'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
              currentTrend === 'monthly'
                ? 'bg-warm-500 text-white shadow-warm'
                : 'text-gray-600 hover:text-warm-600 hover:bg-warm-50',
            ]"
          >
            月
          </button>
        </div>
      </div>

      <div class="mt-4">
        <div ref="chartRef" class="h-64"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  if (!chart || !chartRef.value) {
    return;
  }
  
  if (currentTrendData.value.length === 0) {
    chart.dispose();
    chart = null;
    return;
  }
  
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
  
  chart.setOption(option, true); // 添加 true 参数，强制更新
};

// 监听数据变化
watch([currentTrendData, currentTrend], () => {
  nextTick(() => {
    if (chartRef.value && currentTrendData.value.length > 0) {
      if (!chart) {
        chart = initChart(chartRef.value);
      } else {
        updateChart();
      }
    } else if (chart && currentTrendData.value.length === 0) {
      chart.dispose();
      chart = null;
    }
  });
}, { deep: true });

// 监听加载状态
watch(() => props.loading, (loading) => {
  if (!loading) {
    nextTick(() => {
      if (chartRef.value && currentTrendData.value.length > 0) {
        if (!chart) {
          chart = initChart(chartRef.value);
        } else {
          updateChart();
        }
      }
    });
  }
});

onMounted(() => {
  // 初始化图表
  nextTick(() => {
    if (chartRef.value && currentTrendData.value.length > 0) {
      chart = initChart(chartRef.value);
    }
  });
});

// 组件卸载时清理图表实例
onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script> 