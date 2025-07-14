<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '90%' }"
    :z-index="3000"
    teleport="body"
  >
    <div class="h-full flex flex-col">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">{{ isEditMode ? '编辑支出' : '新增支出' }}</h2>
        <van-icon name="cross" size="20" @click="handleClose" />
      </div>

      <!-- 表单内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <van-form class="space-y-4" @submit="handleSubmit">
          <!-- 日期选择 -->
          <van-field
            v-model="form.date"
            name="date"
            label="日期"
            placeholder="请选择日期"
            readonly
            is-link
            :rules="[{ required: true, message: '请选择日期' }]"
            @click="showDatePicker = true"
          />

          <!-- 分类选择 -->
          <van-field
            :model-value="categoryName"
            name="category"
            label="分类"
            placeholder="请选择分类"
            readonly
            is-link
            :rules="[{ required: true, message: '请选择分类' }]"
            @click="showCategoryPicker = true"
          />

          <!-- 金额输入 -->
          <van-field
            v-model="form.amount"
            name="amount"
            label="金额"
            placeholder="请输入金额"
            readonly
            is-link
            :rules="[
              { required: true, message: '请输入金额' },
              { validator: amountValidator, message: '金额必须大于0且最多保留两位小数' }
            ]"
            @click="handleAmountFieldClick"
          >
            <template #button>
              <span class="text-gray-500">¥</span>
            </template>
          </van-field>

          <!-- 描述输入 -->
          <van-field
            v-model="form.description"
            name="description"
            label="描述"
            type="textarea"
            placeholder="请输入描述（选填）"
            rows="3"
            autosize
            maxlength="200"
            show-word-limit
          />

          <!-- 标签选择 -->
          <van-field
            name="tags"
            label="标签"
            readonly
            is-link
            @click="showTagPicker = true"
          >
            <template #input>
              <div class="flex flex-wrap gap-2 min-h-[24px]">
                <div
                  v-for="tag in selectedTags"
                  :key="tag.id"
                  class="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  <div 
                    class="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                    :style="{ backgroundColor: tag.color }"
                  ></div>
                  <span class="text-gray-700">{{ tag.name }}</span>
                </div>
                <span v-if="selectedTags.length === 0" class="text-gray-400 text-sm">
                  请选择标签（选填）
                </span>
              </div>
            </template>
          </van-field>

          <!-- 提交按钮 -->
          <div class="mt-6 px-4">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              :disabled="loading"
            >
              {{ isEditMode ? '更新' : '保存' }}
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </van-popup>

  <!-- 日期选择器 -->
  <van-popup v-model:show="showDatePicker" position="bottom" round :z-index="3001" teleport="body">
    <van-date-picker
      v-model="currentDate"
      title="选择日期"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm"
      @cancel="showDatePicker = false"
    />
  </van-popup>

  <!-- 分类选择器 -->
  <van-popup v-model:show="showCategoryPicker" position="bottom" round :z-index="3001" teleport="body">
    <van-picker
      :columns="categoryColumns"
      show-toolbar
      title="选择分类"
      @confirm="onCategoryConfirm"
      @cancel="showCategoryPicker = false"
    />
  </van-popup>

  <!-- 数字键盘 -->
  <van-number-keyboard
    v-model:show="showNumberKeyboard"
    v-model="form.amount"
    :maxlength="10"
    theme="custom"
    close-button-text="完成"
    :extra-key="['00', '.']"
    :z-index="3002"
    teleport="body"
    @input="onAmountInput"
    @delete="onAmountDelete"
    @blur="handleAmountFieldBlur"
    @close="showNumberKeyboard = false"
  />

  <!-- 标签选择器 -->
  <van-popup v-model:show="showTagPicker" position="bottom" round :z-index="3001" teleport="body">
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">选择标签</h3>
        <van-icon name="cross" @click="showTagPicker = false" />
      </div>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <van-checkbox-group v-model="form.tags">
          <van-cell
            v-for="(tag, index) in tagStore.tags"
            :key="tag.id"
            clickable
            class="tag-cell"
            @click="toggle(index)"
          >
            <template #title>
              <div class="flex items-center space-x-3">
                <div 
                  class="w-4 h-4 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: tag.color }"
                ></div>
                <span class="text-gray-900">{{ tag.name }}</span>
              </div>
            </template>
            <template #right-icon>
              <van-checkbox 
                :name="tag.id"
                :ref="el => checkboxRefs[index] = el"
                @click.stop
              />
            </template>
          </van-cell>
        </van-checkbox-group>
      </div>
      <div class="mt-4 flex justify-end space-x-2">
        <van-button type="default" @click="showTagPicker = false">取消</van-button>
        <van-button type="primary" @click="showTagPicker = false">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUpdate } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { useTagStore } from '@/stores/tag';
import { showToast } from 'vant';
import type { TagData } from '@/api/tag';
import dayjs from '@/utils/dayjs';

const props = defineProps<{
  show: boolean;
  editMode?: boolean;
  editData?: {
    id: string;
    date: string;
    category: string;
    amount: number;
    description: string;
    tags: string[];
  };
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
}>();

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();
const loading = ref(false);

// 计算属性处理editMode
const isEditMode = computed(() => props.editMode || false);

// 添加 checkbox 引用数组
const checkboxRefs = ref<any[]>([]);

// 添加 toggle 方法
const toggle = (index: number) => {
  checkboxRefs.value[index]?.toggle();
};

// 在组件更新前清空 checkboxRefs 数组
onBeforeUpdate(() => {
  checkboxRefs.value = [];
});

// 重置表单数据
const resetForm = () => {
  form.date = dayjs().format('YYYY-MM-DD');
  form.category = '';
  form.amount = '';
  form.description = '';
  form.tags = [];
  showNumberKeyboard.value = false;
};

// 表单数据
const form = reactive({
  date: dayjs().format('YYYY-MM-DD'),
  category: '',
  amount: '',
  description: '',
  tags: [] as string[]
});

const categoryName = computed(() => {
  if (!Array.isArray(categoryStore.categories)) return '';
  const category = categoryStore.categories.find(category => category.id === form.category);
  return category ? `${category.icon} ${category.name}` : '';
});

// 日期选择器
const showDatePicker = ref(false);
const minDate = dayjs('2020-01-01').toDate();
const maxDate = dayjs().toDate();
const currentDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);

// 分类选择器
const showCategoryPicker = ref(false);
const categoryColumns = computed(() => {
  if (!Array.isArray(categoryStore.categories)) {
    return [{ text: '暂无分类', value: '' }];
  }
  const expenseCategories = categoryStore.categories.filter(category => category.type === 'expense');
  if (expenseCategories.length === 0) {
    return [{ text: '暂无分类', value: '' }];
  }
  return expenseCategories.map(category => ({
    text: `${category.icon} ${category.name}`,
    value: category.id
  }));
});

// 数字键盘
const showNumberKeyboard = ref(false);

// 标签选择器
const showTagPicker = ref(false);

// 已选标签
const selectedTags = computed(() => {
  return tagStore.tags.filter((tag: TagData) => form.tags.includes(tag.id));
});

// 金额验证
const amountValidator = (value: string) => {
  if (!value) return false;
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return false;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return false;
  return true;
};

// 日期确认
const onDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  form.date = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  showDatePicker.value = false;
};

// 分类确认
const onCategoryConfirm = ({ selectedValues } = { selectedValues: [] }) => {
  if (selectedValues.length) {
    form.category = selectedValues[0]
    showCategoryPicker.value = false;
  }
};

// 金额输入
const onAmountInput = (value: string) => {
  form.amount = value;
};

// 金额删除
const onAmountDelete = () => {
  form.amount = form.amount.slice(0, -1);
};

// 关闭弹窗
const handleClose = () => {
  showNumberKeyboard.value = false;
  emit('update:show', false);
};

// 提交表单
const handleSubmit = async () => {
  try {
    loading.value = true;
    if (isEditMode.value && props.editData) {
      await expenseStore.updateExpense(props.editData.id, {
        ...form,
        amount: parseFloat(form.amount)
      });
      showToast('更新成功');
    } else {
      await expenseStore.createExpense({
        ...form,
        amount: parseFloat(form.amount)
      });
      showToast('保存成功');
    }
    emit('success');
    resetForm(); // 提交成功后重置表单
    handleClose();
  } catch (error) {
    console.error('Failed to create expense:', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 处理显示状态更新
const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
};

// 监听显示状态
watch(() => props.show, async (newValue) => {
  if (newValue) {
    // 重置表单
    resetForm();
    
    // 确保分类列表已加载
    if (categoryStore.categories.length === 0) {
      try {
        await categoryStore.fetchCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        showToast('获取分类列表失败');
      }
    }
    
    // 确保标签列表已加载
    if (tagStore.tags.length === 0) {
      try {
        await tagStore.fetchTags();
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        showToast('获取标签列表失败');
      }
    }

    if (isEditMode.value && props.editData) {
      // 格式化日期，确保只保留日期部分，不包含时分秒
      const formattedDate = dayjs(props.editData.date).format('YYYY-MM-DD');
      form.date = formattedDate;
      
      // 同时更新日期选择器的当前值
      const dateObj = dayjs(formattedDate);
      currentDate.value = [
        dateObj.year().toString(),
        (dateObj.month() + 1).toString().padStart(2, '0'),
        dateObj.date().toString().padStart(2, '0')
      ];
      form.category = props.editData.category;
      form.amount = props.editData.amount.toString();
      form.description = props.editData.description;
      form.tags = props.editData.tags;
    }
  }
});

// 在组件挂载时加载数据
onMounted(async () => {
  try {
    await Promise.all([
      categoryStore.fetchCategories(),
      tagStore.fetchTags()
    ]);
  } catch (error) {
    console.error('Failed to load data:', error);
    showToast('加载数据失败');
  }
});

// 金额输入框点击事件
const handleAmountFieldClick = () => {
  // 只在数字键盘隐藏时才显示，避免与 blur 事件冲突
  if (!showNumberKeyboard.value) {
    showNumberKeyboard.value = true;
  }
};

// 金额输入框失去焦点事件
const handleAmountFieldBlur = () => {
  setTimeout(() => {
    showNumberKeyboard.value = false;
  }, 300);
};
</script>

<style scoped>
:deep(.van-field__label) {
  width: 60px;
}

:deep(.van-popup__content) {
  padding-bottom: env(safe-area-inset-bottom);
}

.tag-cell :deep(.van-cell__title) {
  flex: 1;
}

.tag-cell :deep(.van-checkbox) {
  margin-left: auto;
}
</style> 