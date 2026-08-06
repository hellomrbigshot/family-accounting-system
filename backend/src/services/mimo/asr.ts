import { mimoChat } from './client';

export async function transcribeAudio(audioBuffer: Buffer, mimeType = 'audio/wav'): Promise<string> {
  const base64 = audioBuffer.toString('base64');

  const result = await mimoChat({
    model: process.env.MIMO_ASR_MODEL || 'mimo-v2.5-asr',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'input_audio',
            input_audio: {
              data: `data:${mimeType};base64,${base64}`,
            },
          },
        ],
      },
    ],
    asr_options: {
      language: 'zh',
    },
  });

  const text = result.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('未能识别语音内容，请重试');
  }

  return text;
}
