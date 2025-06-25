<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 pb-6 pt-2">
      <div class="mb-2">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">分类管理</h1>
        <p class="text-sm text-gray-500 font-medium">管理您的支出分类和标签，方便记录日常开销</p>
      </div>

      <!-- Tab 切换 -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- 分类管理 -->
      <CategoryList v-show="activeTab === 'categories'" />

      <!-- 标签管理 -->
      <TagList v-show="activeTab === 'tags'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryList from '@/components/CategoryList.vue';
import TagList from '@/components/TagList.vue';

// Tab 相关
const tabs = [
  { id: 'categories', name: '分类管理' },
  { id: 'tags', name: '标签管理' }
];
const activeTab = ref('categories');
</script>

<style>
.van-button--primary {
  @apply bg-indigo-600 border-indigo-600;
}

.van-button--primary:active {
  @apply bg-indigo-700 border-indigo-700;
}

.van-button--danger {
  @apply bg-red-600 border-red-600;
}

.van-button--danger:active {
  @apply bg-red-700 border-red-700;
}
</style> 