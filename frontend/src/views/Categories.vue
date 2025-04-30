<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">分类管理</h1>
      <button
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        新增分类
      </button>
    </div>

    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-medium text-gray-900">支出分类</h2>
        <div class="mt-4">
          <CategoryList type="expense" @edit="handleEdit" />
        </div>
      </div>

      <div>
        <h2 class="text-lg font-medium text-gray-900">收入分类</h2>
        <div class="mt-4">
          <CategoryList type="income" @edit="handleEdit" />
        </div>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            {{ editingCategory ? '编辑分类' : '新增分类' }}
          </h2>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">关闭</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <CategoryForm
          :category="editingCategory"
          @success="handleSuccess"
          @cancel="handleClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCategoryStore } from '@/stores/category';
import CategoryList from '@/components/CategoryList.vue';
import CategoryForm from '@/components/CategoryForm.vue';
import type { CategoryData } from '@/api/category';

const categoryStore = useCategoryStore();
const showForm = ref(false);
const editingCategory = ref<CategoryData | undefined>();

const handleEdit = (category: CategoryData) => {
  editingCategory.value = category;
  showForm.value = true;
};

const handleClose = () => {
  showForm.value = false;
  editingCategory.value = undefined;
};

const handleSuccess = () => {
  handleClose();
  categoryStore.fetchCategories();
};
</script> 