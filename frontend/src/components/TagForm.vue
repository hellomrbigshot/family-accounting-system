<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    class="h-[50vh] flex flex-col"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4 border-b">
        <span class="text-lg font-medium">{{ props.tag ? '编辑标签' : '新建标签' }}</span>
        <van-icon name="cross" @click="handleCancel" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <van-form @submit="handleSubmit" class="flex flex-col h-full p-4">
          <van-cell-group inset>
            <van-field
              v-model="form.name"
              name="name"
              label="名称"
              placeholder="请输入标签名称"
              :rules="[{ required: true, message: '请输入标签名称' }]"
              class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
            />
          </van-cell-group>

          <van-cell-group inset class="mt-4 flex-1 flex flex-col">
            <van-cell title="颜色" />
            <div class="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
              <div class="grid grid-cols-6 gap-2 p-3 bg-gray-50">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  type="button"
                  @click="form.color = color"
                  class="w-9 h-9 rounded-lg flex items-center justify-center hover:ring-2 hover:ring-offset-2 hover:ring-primary-500 transition-all duration-200"
                  :class="{ 'ring-2 ring-primary-500 ring-offset-2': form.color === color }"
                  :style="{ backgroundColor: color }"
                >
                  <van-icon v-if="form.color === color" name="success" class="text-white" />
                </button>
              </div>
              <div v-if="!form.color" class="px-3 py-1 text-red-500 text-sm">
                请选择颜色
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
import { useTagStore } from '@/stores/tag';
import type { TagData } from '@/api/tag';

const props = defineProps<{
  tag?: TagData;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const tagStore = useTagStore();

const form = reactive<{
  name: string;
  color: string;
}>({
  name: '',
  color: '#6366F1'
});

// 重置表单数据
const resetForm = () => {
  form.name = '';
  form.color = '#6366F1';
};

// 常用颜色列表
const colorOptions = [
  '#6366F1', // 靛蓝色
  '#EC4899', // 粉色
  '#F59E0B', // 橙色
  '#EF4444', // 红色
  '#10B981', // 绿色
  '#3B82F6', // 蓝色
  '#8B5CF6', // 紫色
  '#F43F5E', // 玫瑰红
  '#14B8A6', // 青色
  '#F97316', // 橙红色
  '#84CC16', // 黄绿色
  '#A855F7', // 紫罗兰
  '#06B6D4', // 天蓝色
  '#EAB308', // 黄色
  '#22C55E', // 翠绿色
  '#FACC15', // 金黄色
  '#4F46E5', // 靛青色
  '#7C3AED', // 紫色
  '#DB2777', // 粉红色
  '#EA580C', // 橙红色
  '#16A34A', // 深绿色
  '#2563EB', // 深蓝色
  '#9333EA', // 深紫色
  '#DC2626', // 深红色
];

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
  if (!form.color) {
    showToast('请选择颜色');
    return;
  }

  if (props.tag) {
      await tagStore.updateTag(props.tag.id, form);
    } else {
      await tagStore.createTag(form);
    }
    showToast(props.tag ? '更新成功' : '创建成功');
    emit('success');
    
    // 根据模式处理表单数据
    if (!props.tag) {
      // 新建模式：提交成功后重置表单，方便继续创建
      resetForm();
    }
};

// 监听编辑状态
watch(() => props.tag, (newTag) => {
  if (newTag) {
    form.name = newTag.name;
    form.color = newTag.color || '';
  } else {
    // 新建模式：使用统一的重置方法
    resetForm();
  }
}, { immediate: true });
</script>

<style scoped>
:deep(.van-field__label) {
  width: 60px;
}

:deep(.van-popup__content) {
  padding-bottom: env(safe-area-inset-bottom);
}
</style> 