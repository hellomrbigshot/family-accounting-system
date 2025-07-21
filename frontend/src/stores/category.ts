import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { categoryApi } from '@/api/category';
import { userCategoryApi, type UserCategoryPermission } from '@/api/user-category';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Array<{
    id: string;
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    isSystem: boolean;
    createdAt: string;
  }>>([]);

  const allCategoriesForMapping = ref<Array<{
    id: string;
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    isSystem: boolean;
    createdAt: string;
  }>>([]);

  const userPermissions = ref<UserCategoryPermission[]>([]);

  const fetchCategories = async (type?: 'expense' | 'income') => {
    const response = await categoryApi.getList({ type });
    categories.value = response;
    return true;
  };

  const fetchAllCategoriesForMapping = async (type?: 'expense' | 'income') => {
    const response = await categoryApi.getAllList({ type });
    allCategoriesForMapping.value = response;
    return true;
  };

  const fetchUserPermissions = async () => {
    try {
      const response = await userCategoryApi.getPermissions();
      userPermissions.value = response;
      return true;
    } catch (error) {
      console.error('获取用户分类权限失败:', error);
      return false;
    }
  };

  // 获取用户可用的分类（过滤掉禁用的系统分类）
  const availableCategories = computed(() => {
    return categories.value.filter(category => {
      if (!category.isSystem) return true; // 自定义分类总是可用
      
      // 检查系统分类是否被用户禁用
      const permission = userPermissions.value.find((p: UserCategoryPermission) => p.categoryId === category.id);
      return !permission?.isDisabled;
    });
  });

  // 获取所有分类（包括禁用的，用于映射）
  const allCategories = computed(() => categories.value);

  const createCategory = async (category: {
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
  }) => {
    const response = await categoryApi.create({
      ...category,
      isSystem: false
    });
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
    allCategoriesForMapping,
    userPermissions,
    availableCategories,
    allCategories,
    fetchCategories,
    fetchAllCategoriesForMapping,
    fetchUserPermissions,
    createCategory,
    updateCategory,
    deleteCategory
  };
}); 