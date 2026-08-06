interface MimoChatCompletionResponse {
  choices: Array<{
    message: {
      content: string | null;
    };
  }>;
}

const getMimoConfig = () => {
  const baseUrl = process.env.MIMO_BASE_URL;
  const apiKey = process.env.MIMO_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('MiMo API 未配置，请设置 MIMO_BASE_URL 和 MIMO_API_KEY');
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
};

export async function mimoChat(body: Record<string, unknown>): Promise<MimoChatCompletionResponse> {
  const { baseUrl, apiKey } = getMimoConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiMo API 请求失败: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<MimoChatCompletionResponse>;
}
