<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">记一笔</h1>
        <router-link to="/expenses" class="text-sm text-gray-500 hover:text-gray-700">
          返回列表
        </router-link>
      </div>

      <van-form @submit="handleSubmit" class="space-y-6">
        <van-cell-group inset>
          <van-field
            v-model="form.type"
            name="type"
            label="类型"
            :rules="[{ required: true, message: '请选择类型' }]"
          >
            <template #input>
              <van-radio-group v-model="form.type" direction="horizontal">
                <van-radio name="expense">支出</van-radio>
                <van-radio name="income">收入</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-model="form.date"
            name="date"
            label="日期"
            :rules="[{ required: true, message: '请选择日期' }]"
            readonly
            is-link
            @click="showDatePicker = true"
          />

          <van-field
            v-model="form.category"
            name="category"
            label="类别"
            :rules="[{ required: true, message: '请选择类别' }]"
            is-link
            readonly
            @click="showCategoryPicker = true"
          />

          <van-field
            v-model="form.amount"
            name="amount"
            label="金额"
            placeholder="请输入金额"
            :rules="[{ validator: amountValidator }]"
            type="number"
            inputmode="decimal"
            class="rounded-lg"
          />

          <van-field
            v-model="form.paymentMethod"
            name="paymentMethod"
            label="支付方式"
            :rules="[{ required: true, message: '请选择支付方式' }]"
            is-link
            readonly
            @click="showPaymentMethodPicker = true"
          />

          <van-field
            v-model="form.description"
            name="description"
            label="描述"
            rows="3"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入描述"
            show-word-limit
          />
        </van-cell-group>

        <div class="flex justify-end space-x-3">
          <van-button
            type="default"
            @click="$router.push('/expenses')"
            class="w-24"
          >
            取消
          </van-button>
          <van-button
            type="primary"
            native-type="submit"
            class="w-24"
          >
            保存
          </van-button>
        </div>
      </van-form>

      <!-- 类别选择器 -->
      <van-popup
        v-model:show="showCategoryPicker"
        position="bottom"
        round
      >
        <van-picker
          :columns="categories"
          @confirm="onCategoryConfirm"
          @cancel="showCategoryPicker = false"
          show-toolbar
          title="选择类别"
        />
      </van-popup>

      <!-- 支付方式选择器 -->
      <van-popup
        v-model:show="showPaymentMethodPicker"
        position="bottom"
        round
      >
        <van-picker
          :columns="paymentMethods"
          @confirm="onPaymentMethodConfirm"
          @cancel="showPaymentMethodPicker = false"
          show-toolbar
          title="选择支付方式"
        />
      </van-popup>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useExpenseStore } from '@/stores/expense';
import { showToast } from 'vant';

const router = useRouter();
const expenseStore = useExpenseStore();

const categories = [
  { text: '食品餐饮', value: '食品餐饮' },
  { text: '购物消费', value: '购物消费' },
  { text: '出行交通', value: '出行交通' },
  { text: '休闲娱乐', value: '休闲娱乐' },
  { text: '医疗保健', value: '医疗保健' },
  { text: '教育学习', value: '教育学习' },
  { text: '其他', value: '其他' }
];

const paymentMethods = [
  { text: '支付宝', value: '支付宝' },
  { text: '微信', value: '微信' },
  { text: '银联', value: '银联' },
  { text: '现金', value: '现金' }
];

const showCategoryPicker = ref(false);
const showPaymentMethodPicker = ref(false);
const showDatePicker = ref(false);

const minDate = new Date(2020, 0, 1);
const maxDate = new Date();

interface FormData {
  type: string;
  date: string;
  category: string;
  amount: number;
  paymentMethod: string;
  description: string;
}

const amountValidator = (value: string) => {
  if (!value) {
    return '请输入金额';
  }
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return '金额必须大于0';
  }
  if (!/^\d+(\.\d{1})?$/.test(value)) {
    return '金额只能有一位小数';
  }
  return true;
};

const form = reactive<FormData>({
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
  category: '',
  amount: 0,
  paymentMethod: '',
  description: '',
});

const currentDate = ref<string[]>([
  new Date().getFullYear().toString(),
  (new Date().getMonth() + 1).toString(),
  new Date().getDate().toString()
]);

const onDateConfirm = (value: string[]) => {
  const [year, month, day] = value;
  form.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  showDatePicker.value = false;
};

const onCategoryConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  form.category = selectedValues[0];
  showCategoryPicker.value = false;
};

const onPaymentMethodConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  form.paymentMethod = selectedValues[0];
  showPaymentMethodPicker.value = false;
};

const handleSubmit = async () => {
  try {
    const expenseData = {
      ...form,
      amount: parseFloat(form.amount.toString())
    };
    await expenseStore.createExpense(expenseData);
    showToast({
      type: 'success',
      message: '保存成功',
      onClose: () => {
        router.push('/expenses');
      },
    });
  } catch (error) {
    showToast({
      type: 'fail',
      message: '保存失败',
    });
    console.error('Failed to create expense:', error);
  }
};
</script>

<style>
.van-stepper {
  width: 100%;
}
</style> 