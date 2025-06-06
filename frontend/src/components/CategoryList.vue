<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">分类列表</h2>
      <van-button type="primary" size="small" icon="plus" @click="showCategoryForm = true" />
    </div>

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
                <p class="text-sm text-gray-500">创建于 {{ formatDate(category.createdAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <van-button
                type="primary"
                size="small"
                icon="edit"
                @click="handleEdit(category)"
              />
              <van-button
                type="danger"
                size="small"
                icon="delete"
                @click="handleDelete(category)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类表单弹窗 -->
    <van-popup v-model:show="showCategoryForm" position="bottom" round>
      <div class="p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingCategory ? '编辑分类' : '新增分类' }}
        </h2>
        <van-form @submit="handleSubmit">
          <van-cell-group inset>
            <van-field
              v-model="categoryForm.name"
              name="name"
              label="名称"
              placeholder="请输入分类名称"
              :rules="[{ required: true, message: '请输入分类名称' }]"
              class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
            />
            <van-field
              v-model="categoryForm.color"
              name="color"
              label="颜色"
              placeholder="请输入颜色代码"
              :rules="[{ required: true, message: '请输入颜色代码' }]"
              class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
            />
          </van-cell-group>
          <div class="mt-4 flex justify-end space-x-2">
            <van-button plain type="default" size="small" @click="showCategoryForm = false">
              取消
            </van-button>
            <van-button type="primary" size="small" native-type="submit">
              确定
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

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

const showCategoryForm = ref(false);
const editingCategory = ref<CategoryData | undefined>();
const showDeleteConfirm = ref(false);
const deletingCategory = ref<CategoryData | undefined>();

const categories = computed(() => categoryStore.categories);
const categoryCount = computed(() => categories.value.length);

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

const initData = async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    showToast('加载分类数据失败');
  }
};

const handleEdit = (category: CategoryData) => {
  editingCategory.value = category;
  showCategoryForm.value = true;
};

const handleDelete = (category: CategoryData) => {
  deletingCategory.value = category;
  showDeleteConfirm.value = true;
};

const handleSuccess = () => {
  showCategoryForm.value = false;
  editingCategory.value = undefined;
};

const handleCancel = () => {
  showCategoryForm.value = false;
  editingCategory.value = undefined;
};

const confirmDelete = async () => {
  if (!deletingCategory.value) return;

  try {
    await categoryStore.deleteCategory(deletingCategory.value.id);
    showDeleteConfirm.value = false;
    deletingCategory.value = undefined;
    showToast('删除成功');
  } catch (error) {
    console.error('Failed to delete category:', error);
    showToast('删除失败');
  }
};

onMounted(() => {
  initData();
});
</script>
