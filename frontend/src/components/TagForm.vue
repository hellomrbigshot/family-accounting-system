<template>
  <van-popup
    :show="show"
    @update:show="handleShowUpdate"
    position="bottom"
    round
    :style="{ height: '72vh' }"
    teleport="body"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-6 border-b border-warm-200 bg-gradient-warm-subtle">
        <span class="text-xl font-display font-bold text-gray-900">{{ props.tag ? '编辑标签' : '新建标签' }}</span>
        <van-icon name="cross" size="22" class="text-gray-600 hover:text-warm-600 cursor-pointer transition-colors" @click="handleCancel" />
      </div>

      <div class="flex-1 overflow-y-auto bg-white">
        <van-form @submit="handleSubmit" class="flex flex-col h-full p-6">
          <van-cell-group inset class="mb-4">
            <van-field
              v-model="form.name"
              name="name"
              label="名称"
              placeholder="请输入标签名称"
              :rules="[{ required: true, message: '请输入标签名称' }]"
              class="tag-field"
            />
          </van-cell-group>

          <van-cell-group inset class="mb-4">
            <van-field name="type" label="类型" class="tag-field">
              <template #input>
                <van-radio-group v-model="form.type" direction="horizontal">
                  <van-radio name="normal">普通</van-radio>
                  <van-radio name="temporary">限时</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <template v-if="form.type === 'temporary'">
              <van-field
                v-model="form.startDate"
                label="开始"
                readonly
                is-link
                placeholder="选择开始日期"
                :rules="[{ required: true, message: '请选择开始日期' }]"
                class="tag-field"
                @click="openDatePicker('start')"
              />
              <van-field
                v-model="form.endDate"
                label="结束"
                readonly
                is-link
                placeholder="选择结束日期"
                :rules="[{ required: true, message: '请选择结束日期' }]"
                class="tag-field"
                @click="openDatePicker('end')"
              />
              <van-field name="autoApply" label="自动选中" class="tag-field">
                <template #input>
                  <div class="flex items-center justify-between w-full">
                    <span class="text-sm text-gray-500">有效期内新增支出默认带上</span>
                    <van-switch v-model="form.autoApply" size="20" active-color="#f97316" />
                  </div>
                </template>
              </van-field>
            </template>
          </van-cell-group>

          <van-cell-group inset class="mt-4 flex-1 flex flex-col">
            <van-cell title="颜色" class="font-semibold" />
            <div class="flex-1 min-h-0 overflow-y-auto">
              <div class="choice-grid color-choice-grid">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  type="button"
                  @click="form.color = color"
                  class="choice-button color-choice"
                  :class="{
                    'is-selected': form.color === color
                  }"
                  :style="{ backgroundColor: color }"
                >
                  <van-icon v-if="form.color === color" name="success" class="text-white text-lg" />
                </button>
              </div>
              <div v-if="!form.color" class="px-4 py-2 text-red-500 text-sm font-medium mt-2">
                请选择颜色
              </div>
            </div>
          </van-cell-group>

          <div class="flex justify-end space-x-3 pt-6">
            <van-button
              type="default"
              @click="handleCancel"
              class="!px-6 min-w-[100px] rounded-lg"
            >
              取消
            </van-button>
            <van-button
              type="primary"
              native-type="submit"
              data-testid="tag-save"
              class="!px-6 min-w-[100px] rounded-lg"
            >
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </van-popup>

  <van-popup v-model:show="showDatePicker" position="bottom" round teleport="body">
    <van-date-picker
      v-model="pickerDate"
      :title="datePickerTitle"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="handleDateConfirm"
      @cancel="showDatePicker = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { useTagStore } from '@/stores/tag';
import type { TagData } from '@/api/tag';
import dayjs from '@/utils/dayjs';

const props = defineProps<{
  tag?: TagData;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const tagStore = useTagStore();

const form = reactive<{
  name: string;
  color: string;
  type: 'normal' | 'temporary';
  startDate: string;
  endDate: string;
  autoApply: boolean;
}>({
  name: '',
  color: '#F97316', // 默认使用温暖橙色
  type: 'normal',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  autoApply: true
});

// 重置表单数据
const resetForm = () => {
  form.name = '';
  form.color = '#F97316'; // 默认使用温暖橙色
  form.type = 'normal';
  form.startDate = dayjs().format('YYYY-MM-DD');
  form.endDate = dayjs().format('YYYY-MM-DD');
  form.autoApply = true;
};

const showDatePicker = ref(false);
const activeDateField = ref<'start' | 'end'>('start');
const minDate = dayjs('2020-01-01').toDate();
const maxDate = dayjs().add(10, 'year').toDate();
const pickerDate = ref<string[]>([
  dayjs().year().toString(),
  (dayjs().month() + 1).toString().padStart(2, '0'),
  dayjs().date().toString().padStart(2, '0')
]);

const datePickerTitle = computed(() => activeDateField.value === 'start' ? '选择开始日期' : '选择结束日期');

const syncPickerDate = (date: string) => {
  const dateObj = dayjs(date);
  pickerDate.value = [
    dateObj.year().toString(),
    (dateObj.month() + 1).toString().padStart(2, '0'),
    dateObj.date().toString().padStart(2, '0')
  ];
};

const openDatePicker = (field: 'start' | 'end') => {
  activeDateField.value = field;
  syncPickerDate(field === 'start' ? form.startDate : form.endDate);
  showDatePicker.value = true;
};

const handleDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const [year, month, day] = selectedValues;
  const selectedDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  if (activeDateField.value === 'start') {
    form.startDate = selectedDate;
    if (dayjs(form.endDate).isBefore(dayjs(selectedDate))) {
      form.endDate = selectedDate;
    }
  } else {
    form.endDate = selectedDate;
    if (dayjs(form.startDate).isAfter(dayjs(selectedDate))) {
      form.startDate = selectedDate;
    }
  }
  showDatePicker.value = false;
};

// 常用颜色列表 - 与温暖主题搭配
const colorOptions = [
  // 温暖色系
  '#F97316', // 温暖橙
  '#EA580C', // 深橙
  '#FB923C', // 浅橙
  '#FDBA74', // 柔和橙
  '#F59E0B', // 金色
  '#EAB308', // 黄色
  '#FACC15', // 金黄色

  // 辅助色系（与温暖色搭配）
  '#10B981', // 翠绿
  '#059669', // 深绿
  '#22C55E', // 浅绿
  '#84CC16', // 黄绿

  // 蓝色系（与橙色互补）
  '#3B82F6', // 蓝色
  '#2563EB', // 深蓝
  '#0EA5E9', // 天蓝
  '#0284C7', // 钢蓝

  // 紫色系（与橙色形成对比）
  '#8B5CF6', // 紫色
  '#7C3AED', // 深紫
  '#A855F7', // 紫罗兰
  '#9333EA', // 深紫罗兰

  // 红色系（与温暖色相近）
  '#EF4444', // 红色
  '#DC2626', // 深红
  '#F43F5E', // 玫瑰红
  '#EC4899', // 粉色

  // 青色系
  '#14B8A6', // 青色
  '#06B6D4', // 天青
  '#0891B2', // 深青
];

const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
  if (!value) {
    // 关闭弹窗时清空表单
    resetForm();
  }
};

const handleCancel = () => {
  emit('cancel');
  // 取消时清空表单
  resetForm();
};

const handleSubmit = async () => {
  if (!form.color) {
    showToast('请选择颜色');
    return;
  }

  if (form.type === 'temporary' && dayjs(form.startDate).isAfter(dayjs(form.endDate))) {
    showToast('开始日期不能晚于结束日期');
    return;
  }

  const payload = {
    name: form.name,
    color: form.color,
    type: form.type,
    startDate: form.type === 'temporary' ? form.startDate : undefined,
    endDate: form.type === 'temporary' ? form.endDate : undefined,
    autoApply: form.type === 'temporary' ? form.autoApply : false
  };

  if (props.tag) {
      await tagStore.updateTag(props.tag.id, payload);
    } else {
      await tagStore.createTag(payload);
    }
    showToast(props.tag ? '更新成功' : '创建成功');
    emit('success');

    // 根据模式处理表单数据
    if (!props.tag) {
      // 新建模式：提交成功后重置表单，方便继续创建
      resetForm();
    }
};

// 监听编辑状态
watch(() => props.tag, (newTag) => {
  if (newTag) {
    form.name = newTag.name;
    form.color = newTag.color || '';
    form.type = newTag.type || 'normal';
    form.startDate = newTag.startDate || dayjs().format('YYYY-MM-DD');
    form.endDate = newTag.endDate || dayjs().format('YYYY-MM-DD');
    form.autoApply = newTag.autoApply !== false;
  } else {
    // 新建模式：使用统一的重置方法
    resetForm();
  }
}, { immediate: true });

</script>

<style scoped>
.tag-field :deep(.van-field__label) {
  width: 60px;
  font-weight: 600;
  color: var(--color-gray-700);
  font-family: var(--font-body);
}

.tag-field :deep(.van-field) {
  background: var(--color-warm-50);
  border-radius: 0.75rem;
  border: 1px solid var(--color-warm-200);
  transition: all 0.2s ease;
}

.tag-field :deep(.van-field:focus-within) {
  background: white;
  border-color: var(--color-warm-400);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.tag-field :deep(.van-field__control) {
  color: var(--color-gray-900);
  font-family: var(--font-body);
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 0.875rem;
  place-items: center;
  padding: 1rem;
  background: var(--color-warm-50);
  border-radius: 0.75rem;
}

.choice-button {
  width: 44px;
  height: 44px;
  border-radius: 0.75rem;
  border: 2px solid white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.choice-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

.color-choice {
  box-shadow: 0 4px 10px rgba(124, 45, 18, 0.08);
}

.color-choice:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(124, 45, 18, 0.14);
}

.color-choice.is-selected {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.36), 0 10px 18px rgba(124, 45, 18, 0.14);
}

:deep(.van-popup__content) {
  padding-bottom: env(safe-area-inset-bottom);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
  border: none;
  box-shadow: var(--shadow-warm);
  font-weight: 600;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}

:deep(.van-button--default) {
  border-color: var(--color-warm-300);
  color: var(--color-warm-700);
}

:deep(.van-button--default:active) {
  background: var(--color-warm-50);
  border-color: var(--color-warm-400);
}
</style>
