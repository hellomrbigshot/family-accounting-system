import { useVoiceRecorder } from '@/composables/useVoiceRecorder';
import { voiceApi, type VoiceExpenseResult } from '@/api/voice';

export function useVoiceExpenseRecording() {
  const { isRecording, isSupported, start, stop, cancel } = useVoiceRecorder();
  const processing = ref(false);

  const finishRecording = async (): Promise<VoiceExpenseResult | null> => {
    if (processing.value || !isRecording.value) {
      return null;
    }

    processing.value = true;

    try {
      const audio = await stop();
      if (audio.size < 1000) {
        showToast('录音太短，请重试');
        return null;
      }

      return await voiceApi.expenseFromVoice(audio);
    } catch (error) {
      console.error('Voice expense failed:', error);
      if (!error || typeof error !== 'object' || !('response' in error)) {
        showToast(error instanceof Error ? error.message : '语音识别失败');
      }
      return null;
    } finally {
      processing.value = false;
      if (isRecording.value) {
        await cancel();
      }
    }
  };

  const startRecording = async (): Promise<boolean> => {
    if (processing.value) {
      return false;
    }

    if (!isSupported) {
      showToast('当前浏览器不支持录音');
      return false;
    }

    if (isRecording.value) {
      return true;
    }

    try {
      await start();
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      showToast(error instanceof Error ? error.message : '无法开始录音');
      return false;
    }
  };

  const cancelRecording = async () => {
    if (processing.value) {
      return;
    }

    await cancel();
  };

  return {
    isRecording,
    isSupported,
    processing,
    startRecording,
    finishRecording,
    cancelRecording,
  };
}
