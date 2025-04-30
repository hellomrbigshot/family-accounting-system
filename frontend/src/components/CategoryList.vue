<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="category in categories" :key="category.id" class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div
                v-if="category.icon"
                class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full"
                :style="{ backgroundColor: category.color || '#000000' }"
              >
                <span class="text-white">{{ category.icon }}</span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ category.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ category.type === 'expense' ? '支出' : '收入' }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 ml-4">
            <button
              @click="$emit('edit', category)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              编辑
            </button>
            <button
              @click="handleDelete(category)"
              class="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              删除
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCategoryStore } from '@/stores/category';
import type { CategoryData } from '@/api/category';

const props = defineProps<{
  type?: 'expense' | 'income';
}>();

const emit = defineEmits<{
  (e: 'edit', category: CategoryData): void;
}>();

const categoryStore = useCategoryStore();
const categories = computed(() => {
  if (props.type) {
    return props.type === 'expense'
      ? categoryStore.expenseCategories
      : categoryStore.incomeCategories;
  }
  return categoryStore.categories;
});

const handleDelete = async (category: CategoryData) => {
  if (confirm(`确定要删除分类"${category.name}"吗？`)) {
    try {
      await categoryStore.deleteCategory(category.id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }
};
</script> 