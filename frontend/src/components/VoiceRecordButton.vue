<template>
  <van-floating-bubble
    class="home-floating-action home-floating-action--voice"
    :class="{
      'home-floating-action--recording': isRecording,
      'home-floating-action--processing': processing,
    }"
    axis="xy"
    magnetic="x"
    :gap="{ x: 24, y: 132 }"
    teleport="body"
    :icon="bubbleIcon"
    @click="handleClick"
  />

  <VoiceRecordingOverlay
    :show="isRecording || processing"
    :is-recording="isRecording"
    :processing="processing"
    @finish="handleFinishRecording"
  />
</template>

<script setup lang="ts">
import { useVoiceExpenseRecording } from '@/composables/useVoiceExpenseRecording';
import type { VoiceExpenseResult } from '@/api/voice';
import VoiceRecordingOverlay from '@/components/VoiceRecordingOverlay.vue';

const emit = defineEmits<{
  (e: 'success', value: VoiceExpenseResult): void;
}>();

const {
  isRecording,
  isSupported,
  processing,
  startRecording,
  finishRecording,
} = useVoiceExpenseRecording();

const bubbleIcon = computed(() => {
  if (processing.value) {
    return 'loading';
  }
  if (isRecording.value) {
    return 'stop-circle-o';
  }
  return 'audio';
});

const handleClick = async () => {
  if (processing.value) {
    return;
  }

  if (!isRecording.value) {
    await startRecording();
    return;
  }

  await handleFinishRecording();
};

const handleFinishRecording = async () => {
  const result = await finishRecording();
  if (result) {
    emit('success', result);
  }
};
</script>
