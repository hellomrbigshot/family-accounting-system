<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '70vh' }"
    teleport="body"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-6 border-b border-warm-200 bg-gradient-warm-subtle">
        <span class="text-xl font-display font-bold text-gray-900">{{ props.category ? '编辑分类' : '新建分类' }}</span>
        <van-icon name="cross" size="22" class="text-gray-600 hover:text-warm-600 cursor-pointer transition-colors" @click="handleCancel" />
      </div>

      <div class="flex-1 overflow-y-auto bg-white">
        <van-form @submit="handleSubmit" class="flex flex-col h-full p-6">
          <van-cell-group inset class="mb-4">
            <van-field
              v-model="form.name"
              name="name"
              label="名称"
              placeholder="输入分类名称"
              :rules="[{ required: true, message: '请输入分类名称' }]"
              class="category-field"
            />
          </van-cell-group>

          <van-cell-group inset class="flex-1 flex flex-col">
            <van-cell title="图标" class="font-semibold" />
            <div class="flex-1 min-h-0 overflow-y-auto">
              <div class="grid grid-cols-6 gap-3 p-4 bg-warm-50 rounded-xl">
                <button
                  v-for="icon in icons"
                  :key="icon"
                  type="button"
                  @click="form.icon = icon"
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-xl hover:bg-white hover:shadow-md focus:outline-none transition-all duration-200 border-2"
                  :class="form.icon === icon 
                    ? 'bg-white shadow-md border-warm-500 scale-110' 
                    : 'bg-warm-100 border-warm-200 hover:border-warm-300 hover:scale-105'"
                >
                  {{ icon }}
                </button>
              </div>
            </div>
          </van-cell-group>

          <div class="flex justify-end space-x-3 pt-6">
            <van-button
              type="default"
              @click="handleCancel"
              class="!px-6 min-w-[100px] rounded-lg"
            >
              取消
            </van-button>
            <van-button
              type="primary"
              native-type="submit"
              class="!px-6 min-w-[100px] rounded-lg"
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
import { useCategoryStore } from '@/stores/category';
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
  type: 'expense',
  isSystem: false
});

// 重置表单数据
const resetForm = () => {
  form.name = '';
  form.icon = '';
  form.type = 'expense';
  form.isSystem = false;
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

// 常用图标列表 - 按消费场景分类
const icons = [
  // 基础生活
  '🏠', '🍔', '👕', '📱', '💊', '🛏️', '🚿', '🧴',
  
  // 交通出行
  '🚗', '🚌', '🚇', '✈️', '🚕', '🚲', '🚢', '🚁',
  
  // 娱乐休闲
  '🎬', '🎮', '🎭', '🎫', '🎪', '🎨', '🎯', '🎲',
  
  // 运动健身
  '⚽', '🏃‍♂️', '🏋️', '🧘', '🏊‍♂️', '🚴‍♂️',
  
  // 医疗健康
  '🏥', '🩺', '💉', '🦷', '👁️', '🫀', '🧬',
  
  // 教育学习
  '📚', '✏️', '🎓', '📝', '🔬', '📖', '🎒',
  
  // 数码科技
  '💻', '⌚', '📷', '🎧', '🔋', '💾', '🖥️',
  
  // 美容美妆
  '💄', '💅', '💇‍♀️', '🧴', '🪞', '💋', '👄',
  
  // 宠物服务
  '🐕', '🐱', '🐦', '🐠', '🐰', '🐹', '🦜',
  
  // 家居装修
  '🛋️', '🪑', '🛏️', '🚪', '🪟', '🛁', '🚽',
  
  // 购物消费
  '🛒', '🛍️', '💰', '💳', '📦', '🎁', '🛍️',
  
  // 餐饮美食
  '🍕', '🍜', '🍣', '🍰', '☕', '🍺', '🍷',
  
  // 水果食品
  '🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🥭',
  
  // 旅游度假
  '🏖️', '🗺️', '🏝️', '🌴', '🏔️', '🗽', '🗼',
  
  // 金融服务
  '💰', '💳', '📈', '🏦', '💎', '🏛️', '📊',
  
  // 通讯网络
  '📞', '🌐', '📡', '📶', '💻', '📺'
];
</script>

<style scoped>
.category-field :deep(.van-field__label) {
  width: 60px;
  font-weight: 600;
  color: var(--color-gray-700);
  font-family: var(--font-body);
}

.category-field :deep(.van-field) {
  background: var(--color-warm-50);
  border-radius: 0.75rem;
  border: 1px solid var(--color-warm-200);
  transition: all 0.2s ease;
}

.category-field :deep(.van-field:focus-within) {
  background: white;
  border-color: var(--color-warm-400);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.category-field :deep(.van-field__control) {
  color: var(--color-gray-900);
  font-family: var(--font-body);
}

:deep(.van-popup__content) {
  padding-bottom: env(safe-area-inset-bottom);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
  font-weight: 600;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}

:deep(.van-button--default) {
  border-color: var(--color-warm-300);
  color: var(--color-warm-700);
}

:deep(.van-button--default:active) {
  background: var(--color-warm-50);
  border-color: var(--color-warm-400);
}
</style> 