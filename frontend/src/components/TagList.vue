<template>
  <div class="space-y-6 bg-white rounded-b-xl shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <h2 class="text-lg font-medium text-gray-900">支出分类</h2>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
            {{ tagCount }} 个标签
          </span>
        </div>
        <van-button size="small" type="primary" icon="plus" @click="showTagForm = true" />
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

    <!-- 标签表单弹窗 -->
    <tag-form
      v-model:show="showTagForm"
      :tag="editingTag"
      @success="handleFormSuccess"
      @cancel="handleFormCancel"
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
        <p class="text-gray-700">确定要删除标签 "{{ deletingTag?.name }}" 吗？</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTagStore } from '@/stores/tag';
import { showToast } from 'vant';
import type { TagData } from '@/api/tag';
import TagForm from './TagForm.vue';

interface TagWithId extends TagData {
  _id: string;
}

const tagStore = useTagStore();

const showTagForm = ref(false);
const editingTag = ref<TagData | undefined>(undefined);
const showDeleteConfirm = ref(false);
const deletingTag = ref<TagData | undefined>();

const tags = computed(() => (tagStore.tags as TagWithId[]).map(tag => ({
  ...tag,
  id: tag._id
})));

const tagCount = computed(() => tags.value.length);

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
  showTagForm.value = true;
};

const handleDelete = (tag: TagData) => {
  deletingTag.value = tag;
  showDeleteConfirm.value = true;
};

const handleFormSuccess = async () => {
  showTagForm.value = false;
  editingTag.value = undefined;
  await initData();
};

const handleFormCancel = () => {
  showTagForm.value = false;
  editingTag.value = undefined;
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
