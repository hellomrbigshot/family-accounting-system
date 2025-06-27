import { defineStore } from 'pinia';
import { ref } from 'vue';
import { categoryApi } from '@/api/category';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Array<{
    id: string;
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    createdAt: string;
  }>>([]);

  const fetchCategories = async (type?: 'expense' | 'income') => {
    const response = await categoryApi.getList({ type });
    categories.value = response;
    return true;
  };

  const createCategory = async (category: {
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
  }) => {
    const response = await categoryApi.create(category);
    categories.value.push(response);
    showToast('添加分类成功');
    return true;
  };

  const updateCategory = async (
    id: string,
    category: {
      name?: string;
      type?: 'expense' | 'income';
      icon?: string;
      color?: string;
    }
  ) => {
    const response = await categoryApi.update(id, category);
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories.value[index] = response;
    }
    showToast('更新分类成功');
    return true;
  };

  const deleteCategory = async (id: string) => {
    await categoryApi.delete(id);
    categories.value = categories.value.filter((c) => c.id !== id);
    showToast('删除分类成功');
    return true;
  };

  return {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}); 