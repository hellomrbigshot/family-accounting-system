import axios from '@/utils/axios';

export interface VoiceExpenseResult {
  rawText: string;
  amount: number;
  categoryName: string;
  categoryId: string;
  description: string;
  date: string;
  isExtra: boolean;
  tags: string[];
  tagNames: string[];
}

class VoiceApi {
  async expenseFromVoice(audio: Blob): Promise<VoiceExpenseResult> {
    const formData = new FormData();
    formData.append('audio', audio, 'recording.wav');

    const response = await axios.post('/voice/expense-from-voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });

    return response.data;
  }
}

export const voiceApi = new VoiceApi();
