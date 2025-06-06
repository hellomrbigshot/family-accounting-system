<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    class="category-form-popup"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4 border-b">
        <span class="text-lg font-medium">{{ props.category ? '编辑分类' : '新建分类' }}</span>
        <van-icon name="cross" @click="handleCancel" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <van-form @submit="handleSubmit">
          <van-cell-group inset>
            <van-field
              v-model="form.name"
              name="name"
              label="名称"
              placeholder="输入分类名称"
              :rules="[{ required: true, message: '请输入分类名称' }]"
            />
          </van-cell-group>

          <van-cell-group inset>
            <van-cell title="图标" />
            <div class="grid grid-cols-8 gap-3 p-4 bg-gray-50">
              <button
                v-for="icon in icons"
                :key="icon"
                type="button"
                @click="form.icon = icon"
                class="w-10 h-10 rounded-lg flex items-center justify-center text-base hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                :class="{ 'bg-white shadow-sm ring-2 ring-primary-500 ring-offset-2': form.icon === icon }"
              >
                {{ icon }}
              </button>
            </div>
          </van-cell-group>

          <div class="flex justify-end space-x-3 p-4">
            <van-button
              type="default"
              @click="handleCancel"
              class="!px-4"
            >
              取消
            </van-button>
            <van-button
              type="primary"
              native-type="submit"
              class="!px-4"
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
import { reactive, watch, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import type { CategoryData } from '@/api/category';
import dayjs from '@/utils/dayjs';
;

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
  type: 'expense',
  updatedAt: dayjs().format()
});

const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
};

const handleCancel = () => {
  emit('cancel');
};

const handleSubmit = async () => {
  try {
    let success;
    if (props.category) {
      success = await categoryStore.updateCategory(props.category.id, form);
    } else {
      success = await categoryStore.createCategory(form);
    }
    if (success) {
      showToast(props.category ? '更新成功' : '创建成功');
      emit('success');
    }
  } catch (error) {
    console.error(props.category ? '更新分类失败:' : '创建分类失败:', error);
    showToast(props.category ? '更新分类失败' : '创建分类失败');
  }
};

// 监听编辑状态
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.name = newCategory.name;
    form.icon = newCategory.icon || '';
    form.type = newCategory.type;
    form.updatedAt = dayjs().format();
  } else {
    form.name = '';
    form.icon = '';
    form.type = 'expense';
    form.updatedAt = dayjs().format();
  }
}, { immediate: true });

// 常用图标列表
const icons = [
  '📦', '🍔', '🚗', '🏠', '👕', '📱', '💊', '🎓',
  '🎮', '🎬', '✈️', '🚌', '🚇', '🚲', '🚕', '🚢',
  '💼', '🎁', '🎂', '🎄', '🎈', '🎉', '🎊', '🎯',
  '🎨', '🎭', '🎪', '🎫', '🎟️', '🎠', '🎡', '🎢',
  '🎪', '🎭', '🎨', '🎬', '🎮', '🎲', '🎯', '🎳',
  '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
  '🏓', '🏸', '🏒', '🏑', '🏏', '🎿', '⛷️', '🏂',
  '🏋️', '🤼', '🤸', '⛹️', '🤾', '️', '🏇', '🧘',
];
</script>

<style scoped>
.category-form-popup {
  display: flex;
  flex-direction: column;
  height: 70vh !important;
}

.van-form {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.van-cell-group {
  margin-bottom: 16px;
}

.van-button {
  min-width: 80px;
}

:deep(.van-popup) {
  height: 70vh !important;
}

:deep(.van-cell-group--inset) {
  margin: 16px;
}

:deep(.van-popup__content) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.van-cell) {
  padding: 12px;
}

:deep(.van-field__label) {
  width: 60px;
}
</style> 