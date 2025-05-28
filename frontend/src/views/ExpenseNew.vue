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
            name="type"
            label="类型"
            :rules="[{ required: true, message: '请选择类型' }]"
            class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
          >
            <template #value>
              <div class="flex space-x-4">
                <van-radio v-model="form.type" name="expense">支出</van-radio>
                <van-radio v-model="form.type" name="income">收入</van-radio>
              </div>
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
            class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
          />

          <van-field
            v-model="form.category"
            name="category"
            label="类别"
            :rules="[{ required: true, message: '请选择类别' }]"
            is-link
            readonly
            @click="showCategoryPicker = true"
            class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
          />

          <van-field
            v-model="form.amount"
            name="amount"
            label="金额"
            placeholder="请输入金额"
            :rules="[{ validator: amountValidator }]"
            type="number"
            inputmode="decimal"
            class="rounded-lg [&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
          />

          <van-field
            v-model="form.paymentMethod"
            name="paymentMethod"
            label="支付方式"
            :rules="[{ required: true, message: '请选择支付方式' }]"
            is-link
            readonly
            @click="showPaymentMethodPicker = true"
            class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
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
            class="[&_.van-field__label]:text-gray-700 [&_.van-field__label]:font-medium [&_.van-field__control]:text-gray-900"
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
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useExpenseStore } from '@/stores/expense';
import { useCategoryStore } from '@/stores/category';
import { showToast } from 'vant';
import dayjs from '@/utils/dayjs';

const router = useRouter();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

// 获取分类列表
const categories = computed(() => {
  return categoryStore.categories
    .filter(category => category.type === form.type)
    .map(category => ({
      text: `${category.icon} ${category.name}`,
      value: category.id
    }));
});

const paymentMethods = [
  { text: '支付宝', value: '支付宝' },
  { text: '微信', value: '微信' },
  { text: '银联', value: '银联' },
  { text: '现金', value: '现金' }
];

const showCategoryPicker = ref(false);
const showPaymentMethodPicker = ref(false);
const showDatePicker = ref(false);

const minDate = dayjs('2020-01-01').toDate();
const maxDate = dayjs().toDate();

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
  date: dayjs().format('YYYY-MM-DD'),
  category: '',
  amount: 0,
  paymentMethod: '',
  description: ''
});

// 监听类型变化，重置分类
watch(() => form.type, () => {
  form.category = '';
});

const currentDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);

const onDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  form.date = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  showDatePicker.value = false;
};

const onCategoryConfirm = (value: { value: string }) => {
  form.category = value.value;
  showCategoryPicker.value = false;
};

const onPaymentMethodConfirm = (value: { value: string }) => {
  form.paymentMethod = value.value;
  showPaymentMethodPicker.value = false;
};

const handleSubmit = async () => {
  try {
    await expenseStore.createExpense({
      ...form,
      amount: parseFloat(form.amount.toString())
    });
    showToast('保存成功');
    router.push('/expenses');
  } catch (error) {
    console.error('Failed to create expense:', error);
    showToast('保存失败');
  }
};

// 在组件挂载时获取分类列表
onMounted(async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    showToast('获取分类列表失败');
  }
});
</script>

<style>
.van-stepper {
  @apply w-full;
}

.van-button--primary {
  @apply bg-indigo-600 border-indigo-600;
}

.van-button--primary:active {
  @apply bg-indigo-700 border-indigo-700;
}
</style> 