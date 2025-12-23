<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <h2 class="text-xl font-display font-bold text-gray-900">支出标签</h2>
          <div class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-warm-100 text-warm-700 shadow-sm">
            {{ tagCount }} 个标签
          </div>
        </div>
        <van-button 
          size="small" 
          type="primary" 
          icon="plus" 
          @click="showTagForm = true"
          class="rounded-lg"
        />
      </div>
    </div>
    <div class="space-y-3 px-6 pb-6">
      <van-swipe-cell
        v-for="tag in tags"
        :key="tag.id"
        class="mb-2 tag-item"
      >
        <div
          class="flex items-center justify-between p-4 bg-warm-50 rounded-xl cursor-pointer hover:bg-warm-100 transition-all duration-200 card-hover border border-warm-200"
          @click="handleTagClick(tag)"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-4 h-4 rounded-full shadow-sm ring-2 ring-white" 
              :style="{ backgroundColor: tag.color }" 
            />
            <span class="font-semibold text-gray-900 font-display">{{ tag.name }}</span>
          </div>
        </div>
        <template #right>
          <div class="flex h-full ml-[2px]">
            <div
              class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 font-medium shadow-md"
              @click="handleEdit(tag)"
            >
              编辑
            </div>
            <div
              class="h-full flex-1 cursor-pointer text-white whitespace-nowrap flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-medium shadow-md"
              @click="handleDelete(tag)"
            >
              删除
            </div>
          </div>
        </template>
      </van-swipe-cell>
      
      <!-- 空状态 -->
      <div v-if="tags.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-100 flex items-center justify-center">
          <span class="text-3xl">🏷️</span>
        </div>
        <p class="text-gray-500 font-medium">暂无标签</p>
        <p class="text-sm text-gray-400 mt-2">点击右上角按钮创建标签</p>
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
import { useTagStore } from '@/stores/tag';
import type { TagData } from '@/api/tag';
import TagForm from './TagForm.vue';

const router = useRouter();
const tagStore = useTagStore();

const showTagForm = ref(false);
const editingTag = ref<TagData | undefined>(undefined);
const showDeleteConfirm = ref(false);
const deletingTag = ref<TagData | undefined>();

const tags = computed(() => tagStore.tags);

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

const handleTagClick = (tag: TagData) => {
  router.push({
    path: '/expenses',
    query: { tags: tag.id }
  });
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

<style scoped>
.tag-item :deep(.van-swipe-cell) {
  @apply rounded-xl overflow-hidden mb-3;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.tag-item :deep(.van-swipe-cell:hover) {
  box-shadow: var(--shadow-md);
}

.tag-item :deep(.van-swipe-cell__right) {
  @apply h-full;
  width: 130px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}
</style>
