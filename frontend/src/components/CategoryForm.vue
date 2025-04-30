<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">名称</label>
      <div class="mt-1">
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div>
      <label for="type" class="block text-sm font-medium text-gray-700">类型</label>
      <div class="mt-1">
        <select
          id="type"
          v-model="form.type"
          required
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>
    </div>

    <div>
      <label for="icon" class="block text-sm font-medium text-gray-700">图标</label>
      <div class="mt-1">
        <input
          type="text"
          id="icon"
          v-model="form.icon"
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div>
      <label for="color" class="block text-sm font-medium text-gray-700">颜色</label>
      <div class="mt-1">
        <input
          type="color"
          id="color"
          v-model="form.color"
          class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        取消
      </button>
      <button
        type="submit"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        保存
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useCategoryStore } from '@/stores/category';
import type { CategoryData } from '@/api/category';

const props = defineProps<{
  category?: CategoryData;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const categoryStore = useCategoryStore();

const form = reactive({
  name: props.category?.name || '',
  type: props.category?.type || 'expense',
  icon: props.category?.icon || '',
  color: props.category?.color || '#000000',
});

const handleSubmit = async () => {
  try {
    if (props.category) {
      await categoryStore.updateCategory(props.category.id, form);
    } else {
      await categoryStore.createCategory(form);
    }
    emit('success');
  } catch (error) {
    console.error('Failed to save category:', error);
  }
};
</script> 