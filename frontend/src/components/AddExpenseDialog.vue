<template>
  <van-dialog
    :show="show"
    @update:show="emit('update:show', $event)"
    title="添加支出"
    :show-cancel-button="true"
    class="expense-dialog"
    @confirm="handleConfirm"
    destroy-on-close
    close-on-click-overlay
  >
    <div class="p-4">
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">金额</div>
        <div class="flex items-center">
          <span class="text-lg mr-2">¥</span>
          <input
            type="text"
            v-model="expenseAmount"
            class="flex-1 text-lg outline-none"
            readonly
            @focus="showNumberKeyboard = true"
          />
        </div>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">分类</div>
        <van-field
          v-model="selectedCategory"
          readonly
          clickable
          label=""
          placeholder="选择分类"
          @click="showCategoryPicker = true"
        />
        <van-popup v-model:show="showCategoryPicker" position="bottom" round>
          <van-picker
            :columns="categoryColumns"
            @confirm="onCategoryConfirm"
            @cancel="showCategoryPicker = false"
            show-toolbar
            title="选择分类"
            confirm-button-text="确认"
            cancel-button-text="取消"
          />
        </van-popup>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">日期</div>
        <van-field
          v-model="formattedDate"
          readonly
          clickable
          label=""
          placeholder="选择日期"
          @click="showDatePicker = true"
        />
        <van-popup v-model:show="showDatePicker" position="bottom" round>
          <van-date-picker
            v-model="expenseDate"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onDateConfirm"
            @cancel="showDatePicker = false"
            :columns-type="['year', 'month', 'day']"
            :formatter="dateFormatter"
            confirm-button-text="确认"
            cancel-button-text="取消"
          />
        </van-popup>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">备注</div>
        <van-field
          v-model="expenseDescription"
          type="textarea"
          placeholder="请输入备注"
          rows="2"
          autosize
        />
      </div>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model:show="showNumberKeyboard"
      v-model="expenseAmount"
      @input="onAmountInput"
      @delete="onAmountDelete"
      @blur="showNumberKeyboard = false"
      :maxlength="10"
      theme="custom"
      close-button-text="完成"
      :extra-key="['00', '.']"
      :z-index="3000"
      teleport="body"
    />
  </van-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { showToast } from 'vant';
import dayjs from 'dayjs';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

// 表单数据
const form = reactive({
  category: ''
});

// 添加支出对话框
const showNumberKeyboard = ref(false);
const expenseAmount = ref('');
const selectedCategory = ref('');
const showCategoryPicker = ref(false);
const expenseDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);
const showDatePicker = ref(false);
const expenseDescription = ref('');

// 日期显示
const formattedDate = computed(() => {
  if (expenseDate.value.length !== 3) return '';
  const [year, month, day] = expenseDate.value;
  return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
});

// 日期范围
const minDate = new Date(2020, 0, 1);
const maxDate = new Date();

// 分类选择器
const categoryColumns = computed(() => {
  return categoryStore.categories
    .filter(category => category.type === 'expense')
    .map(category => ({
      text: `${category.icon} ${category.name}`,
      value: category.id
    }));
});

// 处理分类选择
const onCategoryConfirm = ({ selectedOptions }: { selectedOptions: { text: string; value: string }[] }) => {
  const selected = selectedOptions[0];
  selectedCategory.value = selected.text;
  form.category = selected.value;  // 保存分类 ID
  showCategoryPicker.value = false;
};

// 处理数字输入
const onAmountInput = (value: string) => {
  // 如果输入的是小数点，且已经存在小数点，则不添加
  if (value === '.' && expenseAmount.value.includes('.')) {
    return;
  }

  // 如果输入的是小数点，且是第一个字符，则添加前导零
  if (value === '.' && !expenseAmount.value) {
    expenseAmount.value = '0.';
    return;
  }

  // 如果已经有两个小数位，则不再添加
  if (expenseAmount.value.includes('.')) {
    const [, decimal] = expenseAmount.value.split('.');
    if (decimal.length >= 2) {
      return;
    }
  }

  // 如果输入的是 00，且当前值为空或为 0，则不添加
  if (value === '00' && (!expenseAmount.value || expenseAmount.value === '0')) {
    return;
  }

  // 如果当前值为 0，且输入的不是小数点，则替换当前值
  if (expenseAmount.value === '0' && value !== '.') {
    expenseAmount.value = value;
    return;
  }

  expenseAmount.value += value;
};

// 处理删除
const onAmountDelete = () => {
  expenseAmount.value = expenseAmount.value.slice(0, -1);
};

// 处理日期选择
const onDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  expenseDate.value = selectedValues;
  showDatePicker.value = false;
};

// 处理确认
const handleConfirm = async () => {
  if (!expenseAmount.value) {
    showToast('请输入金额');
    return;
  }

  const amount = parseFloat(expenseAmount.value);
  if (isNaN(amount) || amount <= 0) {
    showToast('请输入有效的金额');
    return;
  }

  if (!form.category) {
    showToast('请选择分类');
    return;
  }

  try {
    await expenseStore.createExpense({
      amount,
      category: form.category,
      date: formattedDate.value,
      description: expenseDescription.value
    });

    showToast('添加成功');
    emit('update:show', false);
    expenseAmount.value = '';
    selectedCategory.value = '';
    form.category = '';
    expenseDescription.value = '';
  } catch (error: any) {
    showToast(error.response?.data?.message || '添加失败');
  }
};

// 日期格式化
const dateFormatter = (type: string, option: any) => {
  if (type === 'year') {
    option.text += '年';
  }
  if (type === 'month') {
    option.text += '月';
  }
  if (type === 'day') {
    option.text += '日';
  }
  return option;
};
</script>

<style>
:deep(.expense-dialog .van-dialog__content) {
  max-height: 60vh;
  overflow-y: auto;
}
</style> 