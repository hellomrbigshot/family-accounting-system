<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm animate-fade-in-up">
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center shadow-warm">
            <span class="text-2xl">📁</span>
          </div>
          <div>
            <h2 class="text-2xl font-display font-bold text-gray-900 mb-1">支出分类</h2>
            <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-warm-100 text-warm-700 border border-warm-200">
              {{ categoryCount }} 个分类
            </div>
          </div>
        </div>
        <van-button 
          type="primary" 
          size="small" 
          icon="plus" 
          @click="showCategoryForm = true"
          class="rounded-xl shadow-warm hover:shadow-warm-lg transition-all duration-200 hover:scale-105"
        >
          新建分类
        </van-button>
      </div>
    
    <!-- 系统固定分类 -->
    <div v-if="systemCategories.length > 0" class="mb-8">
      <div class="flex items-center space-x-3 mb-5">
        <div class="w-1 h-6 bg-gradient-to-b from-warm-400 to-warm-600 rounded-full"></div>
        <h3 class="text-base font-display font-bold text-gray-800">系统固定分类</h3>
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-warm-200/80 text-warm-800 border border-warm-300">
          {{ systemCategories.length }} 个
        </span>
      </div>
      <div class="space-y-3">
        <van-swipe-cell
          v-for="(category, index) in systemCategories"
          :key="category.id"
          class="mb-2 category-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div
            class="flex items-center justify-between p-5 bg-gradient-to-r from-warm-50 via-warm-50/50 to-white rounded-2xl cursor-pointer hover:from-warm-100 hover:via-warm-100/50 hover:to-warm-50 transition-all duration-300 card-hover border border-warm-200/50 shadow-sm hover:shadow-md group"
            @click="handleCategoryClick(category)"
          >
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-warm-300 via-warm-400 to-warm-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span class="text-2xl">{{ category.icon }}</span>
                </div>
                <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warm-600 border-2 border-white flex items-center justify-center">
                  <span class="text-xs text-white">🔒</span>
                </div>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 font-display text-base mb-1">{{ category.name }}</p>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warm-200/60 text-warm-800 border border-warm-300/50">
                    系统固定
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <van-icon name="arrow" class="text-warm-400 group-hover:text-warm-600 transition-colors" />
            </div>
          </div>
          <template #right>
            <div class="flex h-full ml-[2px]">
              <div
                class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold shadow-lg hover:shadow-xl"
                @click.stop="handleDisableSystemCategory(category)"
              >
                禁用
              </div>
            </div>
          </template>
        </van-swipe-cell>
      </div>
    </div>

    <!-- 家庭自定义分类 -->
    <div v-if="customCategories.length > 0">
      <div class="flex items-center space-x-3 mb-5">
        <div class="w-1 h-6 bg-gradient-to-b from-accent-blue-light to-accent-blue rounded-full"></div>
        <h3 class="text-base font-display font-bold text-gray-800">家庭自定义分类</h3>
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-blue-light/20 text-accent-blue-dark border border-accent-blue-light/30">
          {{ customCategories.length }} 个
        </span>
      </div>
      <div class="space-y-3">
        <van-swipe-cell
          v-for="(category, index) in customCategories"
          :key="category.id"
          class="mb-2 category-item"
          :style="{ animationDelay: `${(systemCategories.length + index) * 0.05}s` }"
        >
          <div
            class="flex items-center justify-between p-5 bg-gradient-to-r from-warm-50/80 via-accent-blue-light/5 to-white rounded-2xl cursor-pointer hover:from-warm-100/80 hover:via-accent-blue-light/10 hover:to-warm-50 transition-all duration-300 card-hover border border-warm-200/50 shadow-sm hover:shadow-md group"
            @click="handleCategoryClick(category)"
          >
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue-light via-accent-blue to-accent-blue-dark flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span class="text-2xl">{{ category.icon }}</span>
                </div>
                <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warm-500 border-2 border-white flex items-center justify-center">
                  <span class="text-xs text-white">✨</span>
                </div>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 font-display text-base mb-1">{{ category.name }}</p>
                <p class="text-xs text-gray-500 flex items-center space-x-1">
                  <span>创建于</span>
                  <span class="font-medium text-warm-600">{{ formatDate(category.createdAt) }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <van-icon name="arrow" class="text-warm-400 group-hover:text-warm-600 transition-colors" />
            </div>
          </div>
          <template #right>
            <div class="flex h-full ml-[2px]">
              <div
                class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 font-semibold shadow-lg hover:shadow-xl"
                @click.stop="handleEdit(category)"
              >
                编辑
              </div>
              <div
                class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold shadow-lg hover:shadow-xl"
                @click.stop="handleDelete(category)"
              >
                删除
              </div>
            </div>
          </template>
        </van-swipe-cell>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="categories.length === 0" class="p-16 text-center animate-fade-in">
      <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center shadow-warm">
        <span class="text-5xl animate-pulse-warm">📦</span>
      </div>
      <p class="text-gray-600 font-display font-bold text-lg mb-2">暂无分类</p>
      <p class="text-sm text-gray-400 mb-6">点击右上角按钮创建您的第一个分类</p>
      <van-button 
        type="primary" 
        size="small" 
        icon="plus" 
        @click="showCategoryForm = true"
        class="rounded-xl shadow-warm"
      >
        立即创建
      </van-button>
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
      class="dialog-warm"
    >
      <div class="p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span class="text-3xl">⚠️</span>
        </div>
        <p class="text-gray-800 font-display font-semibold text-base mb-2">确定要删除分类</p>
        <p class="text-warm-600 font-bold text-lg mb-4">"{{ editingCategory?.name }}"</p>
        <p class="text-sm text-gray-500">删除后无法恢复，请谨慎操作</p>
      </div>
    </van-dialog>

    <!-- 禁用确认对话框 -->
    <van-dialog
      v-model:show="showDisableConfirm"
      title="确认禁用"
      show-cancel-button
      @confirm="confirmDisable"
      class="dialog-warm"
    >
      <div class="p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-100 flex items-center justify-center">
          <span class="text-3xl">🔒</span>
        </div>
        <p class="text-gray-800 font-display font-semibold text-base mb-2">确定要禁用系统分类</p>
        <p class="text-warm-600 font-bold text-lg mb-4">"{{ editingCategory?.name }}"</p>
        <p class="text-sm text-gray-500 leading-relaxed">禁用后该分类将不再显示在支出选择列表中，但不会影响其他用户使用。</p>
      </div>
    </van-dialog>
  </div>
</div>
</template>

<script setup lang="ts">
import { categoryApi } from '@/api/category';
import { userCategoryApi } from '@/api/user-category';
import type { CategoryData } from '@/api/category';
import CategoryForm from '@/components/CategoryForm.vue';

const router = useRouter();
const showCategoryForm = ref(false);
const editingCategory = ref<CategoryData | null>(null);
const showDeleteConfirm = ref(false);
const showDisableConfirm = ref(false);

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

const handleCategoryClick = (category: CategoryData) => {
  router.push({
    path: '/expenses',
    query: { category: category.id }
  });
};

const handleDisableSystemCategory = (category: CategoryData) => {
  if (!category.isSystem) return;
  
  editingCategory.value = category;
  showDisableConfirm.value = true;
};

const confirmDisable = async () => {
  if (!editingCategory.value) return;
  
  try {
    await userCategoryApi.updatePermission(editingCategory.value.id, { isDisabled: true });
    await fetchCategories(); // 重新获取分类列表
    showDisableConfirm.value = false;
    editingCategory.value = null;
    showToast('分类已禁用');
  } catch (error) {
    console.error('禁用分类失败:', error);
    showToast('禁用分类失败');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.category-item {
  animation: fadeInUp 0.4s ease-out both;
}

.category-item :deep(.van-swipe-cell) {
  @apply rounded-2xl overflow-hidden mb-3;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-item :deep(.van-swipe-cell:hover) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.category-item :deep(.van-swipe-cell__right) {
  @apply h-full;
  width: 130px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
  font-weight: 600;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
  transform: scale(0.98);
}

/* 对话框样式优化 */
.dialog-warm :deep(.van-dialog__header) {
  @apply text-xl font-display font-bold text-gray-900;
  padding: 1.5rem 1.5rem 0.5rem;
}

.dialog-warm :deep(.van-dialog__content) {
  padding: 0;
}

.dialog-warm :deep(.van-dialog__footer) {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--color-warm-200);
}

.dialog-warm :deep(.van-button--default) {
  border-color: var(--color-warm-300);
  color: var(--color-warm-700);
  font-weight: 600;
}

.dialog-warm :deep(.van-button--default:active) {
  background: var(--color-warm-50);
  border-color: var(--color-warm-400);
}

.dialog-warm :deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
  font-weight: 600;
}

.dialog-warm :deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}
</style>
