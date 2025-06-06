import { defineStore } from 'pinia';
import { ref } from 'vue';
import { categoryApi } from '@/api/category';
;

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
    try {
      const response = await categoryApi.getList({ type });
      categories.value = response;
      return true;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      showToast('获取分类列表失败');
      return false;
    }
  };

  const createCategory = async (category: {
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
  }) => {
    try {
      const response = await categoryApi.create(category);
      categories.value.push(response);
      showToast('添加分类成功');
      return true;
    } catch (error) {
      console.error('添加分类失败:', error);
      showToast('添加分类失败');
      return false;
    }
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
    try {
      const response = await categoryApi.update(id, category);
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories.value[index] = response;
      }
      showToast('更新分类成功');
      return true;
    } catch (error) {
      console.error('更新分类失败:', error);
      showToast('更新分类失败');
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      categories.value = categories.value.filter((c) => c.id !== id);
      showToast('删除分类成功');
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      showToast('删除分类失败');
      return false;
    }
  };

  return {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}); 