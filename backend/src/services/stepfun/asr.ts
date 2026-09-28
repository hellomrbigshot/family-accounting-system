import { getStepfunConfig } from './client';

interface AsrSseDoneEvent {
  type: 'transcript.text.done';
  text?: string;
}

interface AsrSseErrorEvent {
  type: 'error';
  message?: string;
}

type AsrSseEvent = AsrSseDoneEvent | AsrSseErrorEvent | { type: string; [key: string]: unknown };

const parseSseChunk = (chunk: string): AsrSseEvent[] => {
  const events: AsrSseEvent[] = [];
  const blocks = chunk.split(/\n\n+/);

  for (const block of blocks) {
    const dataLines = block
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .filter(Boolean);

    if (dataLines.length === 0) {
      continue;
    }

    const payload = dataLines.join('\n');
    if (payload === '[DONE]') {
      continue;
    }

    try {
      events.push(JSON.parse(payload) as AsrSseEvent);
    } catch {
      // 忽略无法解析的中间片段
    }
  }

  return events;
};

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType = 'audio/wav'
): Promise<string> {
  const { baseUrl, apiKey } = getStepfunConfig();
  const formatType = mimeType.includes('wav')
    ? 'wav'
    : mimeType.includes('mp3')
      ? 'mp3'
      : mimeType.includes('m4a')
        ? 'm4a'
        : mimeType.includes('ogg')
          ? 'ogg'
          : 'wav';

  const response = await fetch(`${baseUrl}/audio/asr/sse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      audio: {
        data: audioBuffer.toString('base64'),
        input: {
          transcription: {
            model: process.env.STEPFUN_ASR_MODEL || 'stepaudio-2.5-asr',
            language: 'zh',
            enable_itn: true,
          },
          format: {
            type: formatType,
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`StepFun ASR 请求失败: ${response.status} ${errorText}`);
  }

  if (!response.body) {
    throw new Error('StepFun ASR 未返回响应流');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split(/\n\n/);
    buffer = parts.pop() || '';

    for (const part of parts) {
      for (const event of parseSseChunk(part + '\n\n')) {
        if (event.type === 'error') {
          throw new Error(
            `StepFun ASR 识别失败: ${(event as AsrSseErrorEvent).message || '未知错误'}`
          );
        }
        if (event.type === 'transcript.text.done') {
          finalText = ((event as AsrSseDoneEvent).text || '').trim();
        }
      }
    }
  }

  if (buffer.trim()) {
    for (const event of parseSseChunk(buffer + '\n\n')) {
      if (event.type === 'error') {
        throw new Error(
          `StepFun ASR 识别失败: ${(event as AsrSseErrorEvent).message || '未知错误'}`
        );
      }
      if (event.type === 'transcript.text.done') {
        finalText = ((event as AsrSseDoneEvent).text || '').trim();
      }
    }
  }

  if (!finalText) {
    throw new Error('未能识别语音内容，请重试');
  }

  return finalText;
}
