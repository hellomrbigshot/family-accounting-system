<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '90%' }"
  >
    <div class="h-full flex flex-col">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">新增支出</h2>
        <van-icon name="cross" size="20" @click="handleClose" />
      </div>

      <!-- 表单内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <van-form @submit="handleSubmit" class="space-y-4">
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
            @click="showNumberKeyboard = true"
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
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
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
    <van-popup v-model:show="showCategoryPicker" position="bottom">
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
      @input="onAmountInput"
      @delete="onAmountDelete"
      @blur="showNumberKeyboard = false"
      :maxlength="10"
      theme="custom"
      close-button-text="完成"
      :extra-key="['00', '.']"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { showToast } from 'vant';
import dayjs from '@/utils/dayjs';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
}>();

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const loading = ref(false);

// 表单数据
const form = reactive({
  date: dayjs().format('YYYY-MM-DD'),
  category: '',
  amount: '',
  description: ''
});

const categoryName = computed(() => {
  const category = categoryStore.categories.find(category => category.id === form.category);
  return category ? `${category.icon} ${category.name}` : '';
});

// 日期选择器
const showDatePicker = ref(false);
const minDate = dayjs('2020-01-01').toDate();
const maxDate = dayjs().toDate();
const currentDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString(),
  dayjs().date().toString()
]);

// 分类选择器
const showCategoryPicker = ref(false);
const categoryColumns = computed(() => {
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

// 金额验证
const amountValidator = (value: string) => {
  if (!value) return false;
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return false;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return false;
  return true;
};

// 日期确认
const onDateConfirm = (value: string[]) => {
  const [year, month, day] = value;
  form.date = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).format('YYYY-MM-DD');
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
  emit('update:show', false);
};

// 提交表单
const handleSubmit = async () => {
  try {
    loading.value = true;
    await expenseStore.createExpense({
      ...form,
      amount: parseFloat(form.amount)
    });
    showToast('保存成功');
    emit('success');
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
    form.date = dayjs().format('YYYY-MM-DD');
    form.category = '';
    form.amount = '';
    form.description = '';
    
    // 确保分类列表已加载
    if (categoryStore.categories.length === 0) {
      try {
        await categoryStore.fetchCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        showToast('获取分类列表失败');
      }
    }
  }
});

// 在组件挂载时获取分类列表
onMounted(async () => {
  try {
    if (categoryStore.categories.length === 0) {
      await categoryStore.fetchCategories();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    showToast('获取分类列表失败');
  }
});
</script>

<style>
.van-button--primary {
  @apply bg-indigo-600 border-indigo-600;
}

.van-button--primary:active {
  @apply bg-indigo-700 border-indigo-700;
}

.van-field__label {
  @apply text-gray-700 font-medium;
}

.van-field__control {
  @apply text-gray-900;
}
</style> 