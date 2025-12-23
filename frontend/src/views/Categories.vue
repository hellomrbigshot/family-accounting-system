<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 pb-6 pt-2">
      <div class="mb-6">
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">分类管理</h1>
        <p class="text-sm text-gray-600 font-medium">管理您的支出分类和标签，方便记录日常开销</p>
      </div>

      <!-- Tab 切换 -->
      <div class="border-b border-warm-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 relative',
              activeTab === tab.id
                ? 'border-warm-500 text-warm-600'
                : 'border-transparent text-gray-500 hover:text-warm-500 hover:border-warm-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
            <span
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-warm-500 to-warm-600 rounded-full"
            ></span>
          </button>
        </nav>
      </div>

      <!-- 分类管理 -->
      <transition name="tab" mode="out-in">
        <CategoryList v-show="activeTab === 'categories'" key="categories" />
      </transition>

      <!-- 标签管理 -->
      <transition name="tab" mode="out-in">
        <TagList v-show="activeTab === 'tags'" key="tags" />
      </transition>
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

<style scoped>
/* Tab 切换动画 */
.tab-enter-active,
.tab-leave-active {
  transition: all 0.3s ease-out;
}

.tab-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tab-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}

:deep(.van-button--danger) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
}

:deep(.van-button--danger:active) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}
</style> 