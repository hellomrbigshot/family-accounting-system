interface StepfunChatCompletionResponse {
  choices: Array<{
    message: {
      content: string | null;
    };
  }>;
}

export const getStepfunConfig = () => {
  const baseUrl = process.env.STEPFUN_BASE_URL;
  const apiKey = process.env.STEPFUN_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('StepFun API 未配置，请设置 STEPFUN_BASE_URL 和 STEPFUN_API_KEY');
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
};

export async function stepfunChat(
  body: Record<string, unknown>
): Promise<StepfunChatCompletionResponse> {
  const { baseUrl, apiKey } = getStepfunConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`StepFun API 请求失败: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<StepfunChatCompletionResponse>;
}
