<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">标签列表</h2>
      <van-button type="primary" size="small" icon="plus" @click="showTagForm = true" />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
            {{ tagCount }} 个标签
          </span>
        </div>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: tag.color }" />
              <span class="text-gray-900">{{ tag.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <van-button
                type="primary"
                size="small"
                icon="edit"
                @click="handleEdit(tag)"
              />
              <van-button
                type="danger"
                size="small"
                icon="delete"
                @click="handleDelete(tag)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签表单弹窗 -->
    <van-popup v-model:show="showTagForm" position="bottom" round>
      <div class="p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingTag ? '编辑标签' : '新增标签' }}
        </h2>
        <van-form @submit="handleSubmit">
          <van-cell-group inset>
            <van-field
              v-model="tagForm.name"
              name="name"
              label="名称"
              placeholder="请输入标签名称"
              :rules="[{ required: true, message: '请输入标签名称' }]"
              class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
            />
            <van-field
              v-model="tagForm.color"
              name="color"
              label="颜色"
              placeholder="请输入颜色代码"
              :rules="[{ required: true, message: '请输入颜色代码' }]"
              class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
            />
          </van-cell-group>
          <div class="mt-4 flex justify-end space-x-2">
            <van-button plain type="default" size="small" @click="showTagForm = false">
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
        <p class="text-gray-700">确定要删除标签 "{{ deletingTag?.name }}" 吗？</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTagStore } from '@/stores/tag';
;
import type { TagData } from '@/api/tag';

interface TagWithId extends TagData {
  _id: string;
}

const tagStore = useTagStore();

const showTagForm = ref(false);
const editingTag = ref<TagData | null>(null);
const showDeleteConfirm = ref(false);
const deletingTag = ref<TagData | undefined>();

const tags = computed(() => (tagStore.tags as TagWithId[]).map(tag => ({
  ...tag,
  id: tag._id
})));

const tagCount = computed(() => tags.value.length);

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
];

const tagForm = ref({
  name: '',
  color: colorOptions[0]
});

// 初始化数据
const initData = async () => {
  try {
    await tagStore.fetchTags();
  } catch (error) {
    console.error('Failed to fetch tags:', error);

    showToast({
      message: '加载标签数据失败',
      type: 'fail'
    });
  }
};

const handleEdit = (tag: TagData) => {
  editingTag.value = tag;
  tagForm.value = {
    name: tag.name,
    color: tag.color || '#6366F1'
  };
  showTagForm.value = true;
};

const handleDelete = (tag: TagData) => {
  deletingTag.value = tag;
  showDeleteConfirm.value = true;
};

const handleSubmit = async () => {
  try {
    if (editingTag.value) {
      await tagStore.updateTag(editingTag.value.id, tagForm.value);
      showToast({
        message: '更新成功',
        type: 'success'
      });
    } else {
      await tagStore.createTag(tagForm.value);
      showToast({
        message: '添加成功',
        type: 'success'
      });
    }
    showTagForm.value = false;
    editingTag.value = null;
    await initData();
  } catch (error) {
    console.error('Failed to submit tag:', error);
    showToast({
      message: '操作失败',
      type: 'fail'
    });
  }
};

const confirmDelete = async () => {
  if (!deletingTag.value) return;

  try {
    await tagStore.deleteTag(deletingTag.value.id);
    showDeleteConfirm.value = false;
    deletingTag.value = undefined;
    showToast({
      message: '删除成功',
      type: 'success'
    });
    await initData();
  } catch (error) {
    console.error('Failed to delete tag:', error);
    showToast({
      message: '删除失败',
      type: 'fail'
    });
  }
};

onMounted(() => {
  initData();
});
</script>
