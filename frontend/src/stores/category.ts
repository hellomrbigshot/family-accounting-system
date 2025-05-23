import { defineStore } from 'pinia';
import { categoryApi } from '@/api/category';
import type { CategoryData, CategoryQuery } from '@/api/category';

interface CategoryState {
  categories: CategoryData[];
  loading: boolean;
  error: string | null;
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
    error: null,
  }),

  getters: {
    // 移除 expenseCategories 和 incomeCategories getters，因为所有分类都是支出类型
  },

  actions: {
    async fetchCategories(query?: CategoryQuery) {
      this.loading = true;
      this.error = null;
      try {
        const categories = await categoryApi.getList(query);
        this.categories = categories;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取分类列表失败';
      } finally {
        this.loading = false;
      }
    },

    async createCategory(category: Omit<CategoryData, 'id' | 'createdAt'>) {
      this.loading = true;
      this.error = null;
      try {
        const newCategory = await categoryApi.create(category);
        this.categories.push(newCategory);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建分类失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(id: string, category: Partial<Omit<CategoryData, 'id' | 'createdAt'>>) {
      this.loading = true;
      this.error = null;
      try {
        const updatedCategory = await categoryApi.update(id, category);
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新分类失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await categoryApi.delete(id);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除分类失败';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
}); 