<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    class="h-[70vh] flex flex-col"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4 border-b">
        <span class="text-lg font-medium">{{ props.category ? '编辑分类' : '新建分类' }}</span>
        <van-icon name="cross" @click="handleCancel" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <van-form @submit="handleSubmit" class="flex flex-col h-full p-4">
          <van-cell-group inset>
            <van-field
              v-model="form.name"
              name="name"
              label="名称"
              placeholder="输入分类名称"
              :rules="[{ required: true, message: '请输入分类名称' }]"
            />
          </van-cell-group>

          <van-cell-group inset class="flex-1 flex flex-col">
            <van-cell title="图标" />
            <div class="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
              <div class="grid grid-cols-6 gap-2 p-3 bg-gray-50">
                <button
                  v-for="icon in icons"
                  :key="icon"
                  type="button"
                  @click="form.icon = icon"
                  class="w-9 h-9 rounded-lg flex items-center justify-center text-base hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  :class="{ 'bg-white shadow-sm ring-2 ring-primary-500 ring-offset-2': form.icon === icon }"
                >
                  {{ icon }}
                </button>
              </div>
            </div>
          </van-cell-group>

          <div class="flex justify-end space-x-3 pt-4 mr-4">
            <van-button
              type="default"
              @click="handleCancel"
              class="!px-4 min-w-[80px]"
            >
              取消
            </van-button>
            <van-button
              type="primary"
              native-type="submit"
              class="!px-4 min-w-[80px]"
            >
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { showToast } from 'vant';
import type { CategoryData } from '@/api/category';

const props = defineProps<{
  category?: CategoryData;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const categoryStore = useCategoryStore();

const form = reactive<Omit<CategoryData, 'id' | 'createdAt'>>({
  name: '',
  icon: '',
  type: 'expense'
});

// 重置表单数据
const resetForm = () => {
  form.name = '';
  form.icon = '';
  form.type = 'expense';
};

const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
  if (!value) {
    // 关闭弹窗时清空表单
    resetForm();
  }
};

const handleCancel = () => {
  emit('cancel');
  // 取消时清空表单
  resetForm();
};

const handleSubmit = async () => {
  if (props.category) {
    await categoryStore.updateCategory(props.category.id, form);
  } else {
    await categoryStore.createCategory(form);
  }
  showToast(props.category ? '更新成功' : '创建成功');
  emit('success');
  
  // 根据模式处理表单数据
  if (!props.category) {
    // 新建模式：提交成功后重置表单，方便继续创建
    resetForm();
  }
  // 编辑模式：保持当前数据不变，用户可能还需要进一步编辑
};

// 监听编辑状态
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.name = newCategory.name;
    form.icon = newCategory.icon || '';
    form.type = newCategory.type;
  } else {
    resetForm();
  }
}, { immediate: true });

// 常用图标列表
const icons = [
  '📦', '🍔', '🚗', '🏠', '👕', '📱', '💊', '🎓',
  '🎮', '🎬', '✈️', '🚌', '🚇', '🚲', '🚕', '🚢',
  '💼', '🎁', '🎂', '🎄', '🎈', '🎉', '🎊', '🎯',
  '🎨', '🎭', '🎪', '🎫', '🎟️', '🎠', '🎡', '🎢',
  '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
  '🏓', '🏸', '🏒', '🏑', '🏏', '🎿', '⛷️', '🏂',
  '🏋️', '🤼', '🤸', '⛹️', '🤾', '🏇', '🧘'
];
</script>

<style scoped>
/* 仅保留必要的自定义样式 */
:deep(.van-field__label) {
  width: 60px;
}

:deep(.van-popup__content) {
  padding-bottom: env(safe-area-inset-bottom);
}
</style> 