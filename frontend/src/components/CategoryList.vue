<template>
  <div class="bg-white rounded-b-xl shadow-sm">
    <div class="p-5 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <h2 class="text-lg font-medium text-gray-900">支出分类</h2>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
            {{ categoryCount }} 个分类
          </span>
        </div>
        <van-button type="primary" size="small" icon="plus" @click="showCategoryForm = true" />
      </div>
    </div>
    
    <!-- 系统固定分类 -->
    <div v-if="systemCategories.length > 0" class="p-4 border-b border-gray-100">
      <div class="flex items-center space-x-2 mb-3">
        <h3 class="text-sm font-medium text-gray-700">系统固定分类</h3>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {{ systemCategories.length }} 个
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="category in systemCategories"
          :key="category.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span class="text-base text-gray-600">{{ category.icon }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ category.name }}</p>
              <p class="text-xs text-gray-500">系统固定</p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              固定
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 家庭自定义分类 -->
    <div v-if="customCategories.length > 0" class="p-4">
      <div class="flex items-center space-x-2 mb-3">
        <h3 class="text-sm font-medium text-gray-700">家庭自定义分类</h3>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
          {{ customCategories.length }} 个
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="category in customCategories"
          :key="category.id"
          class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-base text-blue-600">{{ category.icon }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ category.name }}</p>
              <p class="text-xs text-gray-500">创建于 {{ formatDate(category.createdAt) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <van-button
              type="primary"
              size="mini"
              icon="edit"
              @click="handleEdit(category)"
            />
            <van-button
              type="danger"
              size="mini"
              icon="delete"
              @click="handleDelete(category)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="categories.length === 0" class="p-8 text-center">
      <p class="text-gray-500">暂无分类</p>
    </div>

    <!-- 分类表单弹窗 -->
    <category-form
      v-model:show="showCategoryForm"
      :category="editingCategory || undefined"
      @success="handleSuccess"
      @cancel="handleCancel"
    />

    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteConfirm"
      title="确认删除"
      show-cancel-button
      @confirm="confirmDelete"
      class="[&_.van-dialog__header]:text-lg [&_.van-dialog__header]:font-medium"
    >
      <div class="p-4">
        <p class="text-gray-700">确定要删除分类 "{{ editingCategory?.name }}" 吗？</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { categoryApi } from '@/api/category';
import type { CategoryData } from '@/api/category';
import dayjs from '@/utils/dayjs';
import CategoryForm from '@/components/CategoryForm.vue';

const showCategoryForm = ref(false);
const editingCategory = ref<CategoryData | null>(null);
const showDeleteConfirm = ref(false);

const categories = ref<CategoryData[]>([]);

// 分离系统分类和家庭分类
const systemCategories = computed(() => 
  categories.value.filter(cat => cat.isSystem)
);

const customCategories = computed(() => 
  categories.value.filter(cat => !cat.isSystem)
);

const categoryCount = computed(() => categories.value.length);

const formatDate = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  
  if (now.isSame(target, 'day')) {
    return '今天';
  } else if (now.isSame(target, 'year')) {
    return target.format('MM月DD日');
  } else {
    return target.format('YYYY年MM月');
  }
};

const fetchCategories = async () => {
  try {
    const data = await categoryApi.getList({ type: 'expense' });
    categories.value = data;
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

const handleEdit = (category: CategoryData) => {
  editingCategory.value = category;
  showCategoryForm.value = true;
};

const handleDelete = (category: CategoryData) => {
  editingCategory.value = category;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!editingCategory.value) return;
  
  try {
    await categoryApi.delete(editingCategory.value.id);
    await fetchCategories();
    showDeleteConfirm.value = false;
    editingCategory.value = null;
  } catch (error) {
    console.error('删除分类失败:', error);
  }
};

const handleSuccess = () => {
  showCategoryForm.value = false;
  editingCategory.value = null;
  fetchCategories();
};

const handleCancel = () => {
  showCategoryForm.value = false;
  editingCategory.value = null;
};

onMounted(() => {
  fetchCategories();
});
</script>
