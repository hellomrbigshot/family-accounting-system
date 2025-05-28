<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- 标题和操作栏 -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">支出分类管理</h1>
            <p class="mt-1 text-sm text-gray-500">管理您的支出分类，方便记录日常开销</p>
          </div>
          <button
            @click="showForm = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新增分类
          </button>
        </div>

        <!-- 分类列表 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">支出分类</h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                {{ categoryCount }} 个分类
              </span>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="category in categories"
                :key="category.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span class="text-lg text-indigo-600">{{ category.icon }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ category.name }}</p>
                    <p class="text-sm text-gray-500">更新于 {{ formatDate(category.updatedAt) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <van-button
                    type="primary"
                    size="small"
                    @click="handleEdit(category)"
                    class="!bg-indigo-600 !border-indigo-600"
                  >
                    编辑
                  </van-button>
                  <van-button
                    type="danger"
                    size="small"
                    @click="handleDelete(category)"
                  >
                    删除
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类表单弹窗 -->
    <CategoryForm
      v-model:show="showForm"
      :category="editingCategory"
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
        <p class="text-gray-700">确定要删除分类 "{{ deletingCategory?.name }}" 吗？</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import CategoryForm from '@/components/CategoryForm.vue';
import type { CategoryData } from '@/api/category';
import dayjs from '@/utils/dayjs';

const categoryStore = useCategoryStore();
const showForm = ref(false);
const showDeleteConfirm = ref(false);
const editingCategory = ref<CategoryData | undefined>();
const deletingCategory = ref<CategoryData | undefined>();

const categories = computed(() => categoryStore.categories);
const categoryCount = computed(() => categories.value.length);

// 初始化分类列表
const initCategories = async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const formatDate = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  
  if (now.isSame(target, 'day')) {
    return '今天 ' + target.format('HH:mm');
  } else if (now.isSame(target, 'year')) {
    return target.format('MM月DD日 HH:mm');
  } else {
    return target.format('YYYY年MM月DD日');
  }
};

const handleEdit = (category: CategoryData) => {
  editingCategory.value = category;
  showForm.value = true;
};

const handleDelete = (category: CategoryData) => {
  deletingCategory.value = category;
  showDeleteConfirm.value = true;
};

const handleSuccess = () => {
  showForm.value = false;
  editingCategory.value = undefined;
};

const handleCancel = () => {
  showForm.value = false;
  editingCategory.value = undefined;
};

const confirmDelete = async () => {
  if (deletingCategory.value) {
    try {
      await categoryStore.deleteCategory(deletingCategory.value.id);
      showDeleteConfirm.value = false;
      deletingCategory.value = undefined;
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }
};

onMounted(() => {
  initCategories();
});
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