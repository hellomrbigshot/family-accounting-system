<template>
  <van-popup
    :show="show"
    position="center"
    round
    :style="{ width: '90%', maxWidth: '400px' }"
    teleport="body"
    @update:show="handleShowUpdate"
  >
    <div class="flex flex-col overflow-hidden">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-6 border-b border-warm-200 bg-gradient-warm-subtle">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center shadow-warm">
            <span class="text-2xl">💰</span>
          </div>
          <h2 class="text-xl font-display font-bold text-gray-900">设置预算</h2>
        </div>
        <van-icon name="cross" size="22" class="text-gray-600 hover:text-warm-600 cursor-pointer transition-colors" @click="handleClose" />
      </div>

      <!-- 内容 -->
      <div class="p-6 bg-white">
        <div class="mb-4">
          <van-field
            :model-value="formattedMonth"
            readonly
            clickable
            label="选择月份"
            placeholder="选择月份"
            @click="showMonthPicker = true"
          />
          <van-popup v-model:show="showMonthPicker" position="bottom" round teleport="body">
            <van-date-picker
              v-model="selectedMonth"
              type="year-month"
              title="选择月份"
              is-link
              :min-date="minDate"
              :max-date="maxDate"
              :columns-type="['year', 'month']"
              @confirm="onMonthConfirm"
              @cancel="showMonthPicker = false"
            />
          </van-popup>
        </div>
        <div class="mb-4">
          <van-field
            :model-value="budgetAmount"
            readonly
            clickable
            label="预算金额"
            placeholder="请输入金额"
            is-link
            @click="handleAmountFieldClick"
          >
            <template #button>
              <span class="text-gray-500 font-medium">¥</span>
            </template>
          </van-field>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="flex justify-end space-x-3 p-6 border-t border-warm-200 bg-warm-50/30">
        <van-button 
          type="default" 
          @click="handleClose"
          class="!px-6 min-w-[100px] rounded-lg border-warm-300 text-warm-700 hover:bg-warm-50"
        >
          取消
        </van-button>
        <van-button 
          type="primary" 
          :loading="loading" 
          @click="handleConfirm"
          class="!px-6 min-w-[100px] rounded-lg shadow-warm"
        >
          确定
        </van-button>
      </div>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model:show="showNumberKeyboard"
      :model-value="budgetAmount"
      :maxlength="10"
      theme="custom"
      close-button-text="完成"
      :extra-key="['00', '.']"
      teleport="body"
      :z-index="3000"
      @update:model-value="budgetAmount = $event"
      @input="onAmountInput"
      @delete="onAmountDelete"
      @blur="handleAmountFieldBlur"
      @close="showNumberKeyboard = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { useBudgetStore } from '@/stores/budget';
import dayjs from 'dayjs';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const budgetStore = useBudgetStore();
const showNumberKeyboard = ref(false);
const budgetAmount = ref('');
const showMonthPicker = ref(false);
const loading = ref(false);
const selectedMonth = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0')
]);

// 格式化显示的月份
const formattedMonth = computed(() => {
  if (selectedMonth.value.length !== 2) return '';
  const [year, month] = selectedMonth.value;
  return `${year}年${month}月`;
});

// 日期范围
const minDate = new Date(dayjs().year(), dayjs().month(), 1); // 本月第一天
const maxDate = new Date(dayjs().add(5, 'year').year(), 11, 31); // 5年后的12月31日

// 处理月份选择
const onMonthConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  selectedMonth.value = selectedValues;
  showMonthPicker.value = false;
};

// 处理关闭前验证
const handleBeforeClose = async (action: string) => {
  if (action === 'confirm') {
    if (!budgetAmount.value) {
      showToast({
        message: '请输入预算金额',
        position: 'middle',
        duration: 2000
      })
      return false
    }

    const amount = parseFloat(budgetAmount.value)
    if (isNaN(amount) || amount <= 0) {
      showToast({
        message: '请输入有效的预算金额',
        position: 'middle',
        duration: 2000
      })
      return false
    }

    try {
      const [year, month] = selectedMonth.value
      await budgetStore.updateBudget(amount, parseInt(year), parseInt(month))
      showToast({
        message: '设置成功',
        position: 'middle',
        duration: 2000
      })
      return true
    } catch (error: any) {
      showToast({
        message: error.response?.data?.message || '设置失败',
        position: 'middle',
        duration: 2000
      })
      return false
    }
  }
  return true
}

// 处理数字输入
const onAmountInput = (value: string) => {
  // 如果输入的是小数点，且已经存在小数点，则不添加
  if (value === '.' && budgetAmount.value.includes('.')) {
    return;
  }

  // 如果输入的是小数点，且是第一个字符，则添加前导零
  if (value === '.' && !budgetAmount.value) {
    budgetAmount.value = '0.';
    return;
  }

  // 如果已经有两个小数位，则不再添加
  if (budgetAmount.value.includes('.')) {
    const [, decimal] = budgetAmount.value.split('.');
    if (decimal.length >= 2) {
      return;
    }
  }

  // 如果输入的是 00，且当前值为空或为 0，则不添加
  if (value === '00' && (!budgetAmount.value || budgetAmount.value === '0')) {
    return;
  }

  // 如果当前值为 0，且输入的不是小数点，则替换当前值
  if (budgetAmount.value === '0' && value !== '.') {
    budgetAmount.value = value;
    return;
  }

  budgetAmount.value += value;
};

// 处理删除
const onAmountDelete = () => {
  budgetAmount.value = budgetAmount.value.slice(0, -1);
};

// 重置表单数据
const resetForm = () => {
  budgetAmount.value = '';
  selectedMonth.value = [
    dayjs().year().toString(),
    (dayjs().month() + 1).toString().padStart(2, '0')
  ];
  showNumberKeyboard.value = false;
  showMonthPicker.value = false;
};

const handleShowUpdate = (value: boolean) => {
  if (value) {
    // 弹窗显示时初始化表单
    resetForm();
  } else {
    // 弹窗关闭时重置表单
    resetForm();
  }
  emit('update:show', value);
};

const handleClose = () => {
  resetForm();
  handleShowUpdate(false);
};

const handleConfirm = async () => {
  loading.value = true;
  try {
    if (await handleBeforeClose('confirm')) {
      resetForm();
      handleShowUpdate(false);
    }
  } finally {
    loading.value = false;
  }
};

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
.budget-dialog .van-dialog__content {
  max-height: 60vh;
  overflow-y: auto;
}

:deep(.van-cell) {
  @apply px-2;
}

:deep(.van-field) {
  background: var(--color-warm-50);
  border-radius: 0.75rem;
  border: 1px solid var(--color-warm-200);
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

:deep(.van-field:focus-within) {
  background: white;
  border-color: var(--color-warm-400);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

:deep(.van-field__label) {
  color: var(--color-gray-700);
  font-weight: 600;
  font-family: var(--font-body);
}

:deep(.van-field__control) {
  color: var(--color-gray-900);
  font-family: var(--font-body);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}

:deep(.van-button--default) {
  background: white;
}

:deep(.van-button--default:active) {
  background: var(--color-warm-50);
}
</style> 