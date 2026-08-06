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

  <van-overlay :show="isRecording || processing" z-index="2000">
    <div class="voice-overlay" @click.stop>
      <div class="voice-overlay__panel">
        <div
          class="voice-overlay__pulse"
          :class="{ 'voice-overlay__pulse--active': isRecording }"
        ></div>
        <p class="voice-overlay__title">
          {{ processing ? '正在识别...' : isRecording ? '正在录音' : '' }}
        </p>
        <p class="voice-overlay__hint">
          {{ processing ? '请稍候，AI 正在解析记账内容' : '说完后再次点击结束录音' }}
        </p>
        <van-button
          v-if="isRecording && !processing"
          type="primary"
          size="small"
          class="mt-4"
          @click="finishRecording"
        >
          结束并识别
        </van-button>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
import { useVoiceRecorder } from '@/composables/useVoiceRecorder';
import { voiceApi, type VoiceExpenseResult } from '@/api/voice';

const emit = defineEmits<{
  (e: 'success', value: VoiceExpenseResult): void;
}>();

const { isRecording, isSupported, start, stop, cancel } = useVoiceRecorder();
const processing = ref(false);

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

  if (!isSupported) {
    showToast('当前浏览器不支持录音');
    return;
  }

  if (!isRecording.value) {
    try {
      await start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      showToast(error instanceof Error ? error.message : '无法开始录音');
    }
    return;
  }

  await finishRecording();
};

const finishRecording = async () => {
  if (processing.value || !isRecording.value) {
    return;
  }

  processing.value = true;

  try {
    const audio = await stop();
    if (audio.size < 1000) {
      showToast('录音太短，请重试');
      return;
    }

    const result = await voiceApi.expenseFromVoice(audio);
    emit('success', result);
  } catch (error) {
    console.error('Voice expense failed:', error);
    if (!error || typeof error !== 'object' || !('response' in error)) {
      showToast(error instanceof Error ? error.message : '语音识别失败');
    }
  } finally {
    processing.value = false;
    if (isRecording.value) {
      await cancel();
    }
  }
};
</script>

<style scoped>
.voice-overlay {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.voice-overlay__panel {
  width: min(100%, 320px);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
}

.voice-overlay__pulse {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.12);
  position: relative;
}

.voice-overlay__pulse--active::after {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 9999px;
  background: #ef4444;
  animation: pulse 1.2s ease-in-out infinite;
}

.voice-overlay__title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.voice-overlay__hint {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.92);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}
</style>
