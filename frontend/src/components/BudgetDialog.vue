<template>
  <van-dialog
    :show="show"
    @update:show="emit('update:show', $event)"
    title="设置预算"
    :show-cancel-button="true"
    class="budget-dialog"
    :before-close="handleBeforeClose"
  >
    <div class="p-4">
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">选择月份</div>
        <van-field
          :model-value="formattedMonth"
          readonly
          clickable
          label=""
          placeholder="选择月份"
          @click="showMonthPicker = true"
        />
        <van-popup v-model:show="showMonthPicker" position="bottom">
          <van-date-picker
            v-model="selectedMonth"
            type="year-month"
            title="选择月份"
            :min-date="minDate"
            :max-date="maxDate"
            :columns-type="['year', 'month']"
            @confirm="onMonthConfirm"
            @cancel="showMonthPicker = false"
          />
        </van-popup>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">预算金额</div>
        <van-field
          :model-value="budgetAmount"
          readonly
          clickable
          label=""
          placeholder="请输入金额"
          @click="showNumberKeyboard = true"
          class="amount-field"
          :label-width="0"
          left-icon="￥"
        />
      </div>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model:show="showNumberKeyboard"
      :model-value="budgetAmount"
      @update:model-value="budgetAmount = $event"
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
import { useBudgetStore } from '@/stores/budget';
import { showToast } from 'vant';
import dayjs from 'dayjs';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const budgetStore = useBudgetStore();
const showNumberKeyboard = ref(false);
const budgetAmount = ref('');
const showMonthPicker = ref(false);
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
</script>

<style scoped>
.budget-dialog .van-dialog__content {
  max-height: 60vh;
  overflow-y: auto;
}

.amount-field :deep(.van-field__control) {
  font-size: 16px !important;
  font-weight: 500 !important;
  padding-left: 0 !important;
}

.amount-field :deep(.van-field__left-icon) {
  margin-right: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style> 