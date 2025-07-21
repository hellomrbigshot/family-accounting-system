<template>
  <div class="space-y-6">
    <!-- 支出分类饼图 -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <h3 class="text-lg font-medium text-gray-900 mb-4">支出分类</h3>
        <div>
          <div ref="categoryChartRef" class="h-64"></div>
          <!-- 图例 -->
          <div class="mt-4 space-y-2">
            <div 
              v-for="item in categoryChartData" 
              :key="item.name"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center space-x-2">
                <div 
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span class="text-lg mr-2">{{ item.icon }}</span>
                <span class="text-gray-600">{{ item.name }}</span>
              </div>
              <span class="text-gray-900 font-medium">¥{{ item.value.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支出标签饼图 -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <h3 class="text-lg font-medium text-gray-900 mb-4">支出标签</h3>
        <div>
          <div ref="tagChartRef" class="h-64"></div>
          <!-- 图例 -->
          <div class="mt-4 space-y-2">
            <div 
              v-for="item in tagChartData" 
              :key="item.name"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center space-x-2">
                <div 
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span class="text-gray-600">{{ item.name }}</span>
              </div>
              <span class="text-gray-900 font-medium">¥{{ item.value.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useReportStore } from '@/stores/report';
import { useCategoryStore } from '@/stores/category';
import { useTagStore } from '@/stores/tag';
import * as echarts from 'echarts';
import type { ReportData } from '@/api/report';

interface Props {
  data: ReportData;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const reportStore = useReportStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

const categoryChartRef = ref<HTMLElement>();
const tagChartRef = ref<HTMLElement>();
let categoryChart: echarts.ECharts | null = null;
let tagChart: echarts.ECharts | null = null;

// 预定义的颜色数组 - 重新设计确保对比度
const colors = [
  '#EF4444', // 红色 - 高对比度
  '#10B981', // 绿色 - 与红色形成强对比
  '#3B82F6', // 蓝色 - 与红绿形成三原色对比
  '#F59E0B', // 橙色 - 与蓝色形成互补
  '#8B5CF6', // 紫色 - 与橙色形成对比
  '#06B6D4', // 青色 - 与紫色形成对比
  '#F97316', // 深橙色 - 与青色形成对比
  '#84CC16', // 浅绿色 - 与深橙色形成对比
  '#EC4899', // 粉色 - 与浅绿色形成对比
  '#059669', // 深绿色 - 与粉色形成对比
  '#D97706', // 棕色 - 与深绿色形成对比
  '#6366F1', // 靛蓝色 - 与棕色形成对比
  '#F43F5E', // 玫红色 - 与靛蓝色形成对比
  '#14B8A6', // 青绿色 - 与玫红色形成对比
  '#A855F7'  // 紫罗兰 - 与青绿色形成对比
];

// 转换分类数据格式，将分类 ID 映射为分类名称和图标
const transformCategoryData = (data: Record<string, number> | undefined) => {
  const result: Array<{ name: string; value: number; color: string; icon: string }> = [];
  
  if (!data || typeof data !== 'object') {
    return result;
  }
  
  Object.entries(data).forEach(([categoryId, amount], index) => {
    if (typeof amount !== 'number' || amount <= 0) {
      return;
    }
    
    const category = categoryStore.allCategoriesForMapping.find(c => c.id === categoryId && c.type === 'expense');
    if (category) {
      result.push({
        name: category.name,
        value: amount,
        color: colors[index % colors.length],
        icon: category.icon || '📦'
      });
    }
  });
  
  return result.sort((a, b) => b.value - a.value);
};

// 转换标签数据格式，将标签 ID 映射为标签名称
const transformTagData = (data: Record<string, number> | undefined) => {
  const result: Array<{ name: string; value: number; color: string }> = [];
  
  if (!data || typeof data !== 'object') {
    return result;
  }
  
  Object.entries(data).forEach(([tagId, amount], index) => {
    if (typeof amount !== 'number' || amount <= 0) {
      return;
    }
    
    const tag = tagStore.tags.find(t => t.id === tagId);
    if (tag) {
      result.push({
        name: tag.name,
        value: amount,
        color: tag.color || colors[index % colors.length]
      });
    }
  });
  
  return result.sort((a, b) => b.value - a.value);
};

// 计算属性：支出分类数据
const categoryChartData = computed(() => {
  return transformCategoryData(props.data.expenses.byCategory);
});

// 计算属性：支出标签数据
const tagChartData = computed(() => {
  return transformTagData(props.data.expenses.byTag);
});

// 初始化图表
const initChart = (chartRef: HTMLElement, data: Array<{ name: string; value: number; color: string }>) => {
  // 检查 DOM 元素上是否已有图表实例
  const existingChart = echarts.getInstanceByDom(chartRef);
  if (existingChart) {
    existingChart.dispose();
  }
  
  const chart = echarts.init(chartRef);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: data.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  };
  
  chart.setOption(option);
  return chart;
};

// 更新图表
const updateChart = (chart: echarts.ECharts | null, data: Array<{ name: string; value: number; color: string }>) => {
  if (chart) {
    const option = {
      series: [
        {
          data: data.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ]
    };
    chart.setOption(option);
  }
};

// 监听数据变化
watch([categoryChartData, tagChartData], () => {
  nextTick(() => {
    // 分类图表处理
    if (categoryChartData.value.length === 0 && categoryChart) {
      categoryChart.dispose();
      categoryChart = null;
    } else if (categoryChartData.value.length > 0) {
      if (!categoryChart && categoryChartRef.value) {
        categoryChart = initChart(categoryChartRef.value, categoryChartData.value);
      } else if (categoryChart) {
        updateChart(categoryChart, categoryChartData.value);
      }
    }
    // 标签图表处理
    if (tagChartData.value.length === 0 && tagChart) {
      tagChart.dispose();
      tagChart = null;
    } else if (tagChartData.value.length > 0) {
      if (!tagChart && tagChartRef.value) {
        tagChart = initChart(tagChartRef.value, tagChartData.value);
      } else if (tagChart) {
        updateChart(tagChart, tagChartData.value);
      }
    }
  });
}, { deep: true });

// 监听加载状态
watch(() => props.loading, (loading) => {
  if (!loading) {
    nextTick(() => {
      // 只在有数据时更新图表，不重新初始化
      if (categoryChart && categoryChartData.value.length > 0) {
        updateChart(categoryChart, categoryChartData.value);
      } else if (categoryChart && categoryChartData.value.length === 0) {
        categoryChart.dispose();
        categoryChart = null;
      }
      
      if (tagChart && tagChartData.value.length > 0) {
        updateChart(tagChart, tagChartData.value);
      } else if (tagChart && tagChartData.value.length === 0) {
        tagChart.dispose();
        tagChart = null;
      }
    });
  }
});

onMounted(async () => {
  // 确保分类和标签数据已加载
  if (categoryStore.allCategoriesForMapping.length === 0) {
    await Promise.all([
      categoryStore.fetchCategories(),
      categoryStore.fetchAllCategoriesForMapping()
    ]);
  }
  
  if (tagStore.tags.length === 0) {
    await tagStore.fetchTags();
  }
  
  // 初始化图表 - 只在有数据时初始化
  nextTick(() => {
    // 只在有数据且 DOM 元素存在时初始化图表
    if (categoryChartRef.value && categoryChartData.value.length > 0) {
      categoryChart = initChart(categoryChartRef.value, categoryChartData.value);
    }
    
    if (tagChartRef.value && tagChartData.value.length > 0) {
      tagChart = initChart(tagChartRef.value, tagChartData.value);
    }
  });
});

// 组件卸载时清理图表实例
onUnmounted(() => {
  if (categoryChart) {
    categoryChart.dispose();
    categoryChart = null;
  }
  if (tagChart) {
    tagChart.dispose();
    tagChart = null;
  }
});
</script> 