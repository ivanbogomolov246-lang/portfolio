import OpenAI from "openai";
import { env } from "../utils/env.js";
import { HttpError } from "../utils/errors.js";

const AI_REQUEST_TIMEOUT_MS = 90_000;
const AI_RETRY_DELAY_MS = 1_500;

let openAiClient: OpenAI | null = null;
let deepSeekClient: OpenAI | null = null;
let ollamaClient: OpenAI | null = null;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getOpenAiClient = () => {
  if (!env.openAiApiKey) {
    throw new HttpError(500, "На сервере не настроен OPENAI_API_KEY.");
  }

  if (!openAiClient) {
    openAiClient = new OpenAI({ apiKey: env.openAiApiKey });
  }

  return openAiClient;
};

const getDeepSeekClient = () => {
  if (!env.deepseekApiKey) {
    throw new HttpError(500, "На сервере не настроен DEEPSEEK_API_KEY.");
  }

  if (!deepSeekClient) {
    deepSeekClient = new OpenAI({
      apiKey: env.deepseekApiKey,
      baseURL: env.deepseekBaseUrl,
    });
  }

  return deepSeekClient;
};

const getOllamaClient = () => {
  if (!ollamaClient) {
    ollamaClient = new OpenAI({
      apiKey: "ollama",
      baseURL: env.ollamaBaseUrl,
    });
  }

  return ollamaClient;
};

const requestOpenAiSummary = async (projectText: string) => {
  const client = getOpenAiClient();

  const response = await client.responses.create(
    {
      model: env.openAiModel,
      temperature: 0.3,
      max_output_tokens: 220,
      instructions:
        "Сделай краткое описание проекта на русском языке (2-4 предложения). Укажи задачу, стек и измеримый результат.",
      input: projectText,
    },
    {
      timeout: AI_REQUEST_TIMEOUT_MS,
    },
  );

  const summary = response.output_text?.trim();
  if (!summary) {
    throw new HttpError(502, "AI вернул пустой ответ.");
  }

  return summary;
};

const requestDeepSeekSummary = async (projectText: string) => {
  const client = getDeepSeekClient();

  const response = await client.chat.completions.create(
    {
      model: env.deepseekModel,
      temperature: 0.3,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content:
            "Сделай краткое описание проекта на русском языке (2-4 предложения). Укажи задачу, стек и измеримый результат.",
        },
        {
          role: "user",
          content: projectText,
        },
      ],
    },
    {
      timeout: AI_REQUEST_TIMEOUT_MS,
    },
  );

  const summary = response.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new HttpError(502, "DeepSeek вернул пустой ответ.");
  }

  return summary;
};

const requestOllamaSummary = async (projectText: string) => {
  const client = getOllamaClient();

  const response = await client.chat.completions.create(
    {
      model: env.ollamaModel,
      temperature: 0.3,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content:
            "Сделай краткое описание проекта на русском языке (2-4 предложения). Укажи задачу, стек и измеримый результат.",
        },
        {
          role: "user",
          content: projectText,
        },
      ],
    },
    {
      timeout: AI_REQUEST_TIMEOUT_MS,
    },
  );

  const summary = response.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new HttpError(502, "Ollama вернул пустой ответ.");
  }

  return summary;
};

const mapApiErrorMessage = (status: number) => {
  if (status === 401) {
    return "Неверный API key. Проверьте ключ в backend/.env.";
  }

  if (status === 402) {
    return "Недостаточно средств на балансе провайдера. Пополните баланс.";
  }

  if (status === 403) {
    return "Доступ к AI API запрещен. Проверьте VPN/регион и права аккаунта.";
  }

  if (status === 404) {
    if (env.aiProvider === "ollama") {
      return "Модель Ollama не найдена локально. Выполните: ollama pull <модель>.";
    }

    return "Указанная модель недоступна. Проверьте модель в backend/.env.";
  }

  if (status === 429) {
    return "Превышена квота API. Проверьте биллинг и лимиты аккаунта.";
  }

  if (status >= 500) {
    return "AI API временно недоступен. Повторите запрос позже.";
  }

  return "Ошибка AI API. Проверьте настройки и попробуйте снова.";
};

const requestSummaryWithRetry = async (projectText: string) => {
  const requestByProvider = {
    openai: requestOpenAiSummary,
    deepseek: requestDeepSeekSummary,
    ollama: requestOllamaSummary,
  } as const;

  const request = requestByProvider[env.aiProvider];

  try {
    return await request(projectText);
  } catch (error) {
    const retryable =
      error instanceof OpenAI.APIConnectionTimeoutError || error instanceof OpenAI.APIConnectionError;

    if (!retryable) {
      throw error;
    }

    await sleep(AI_RETRY_DELAY_MS);
    return request(projectText);
  }
};

export const generateSummary = async (projectText: string) => {
  try {
    return await requestSummaryWithRetry(projectText);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof OpenAI.APIConnectionTimeoutError) {
      throw new HttpError(504, "AI не успел ответить вовремя. Повторите запрос.");
    }

    if (error instanceof OpenAI.APIConnectionError) {
      throw new HttpError(502, "Нет соединения с AI API. Проверьте сеть/VPN и повторите.");
    }

    if (error instanceof OpenAI.APIError) {
      console.error("AI API error:", {
        provider: env.aiProvider,
        status: error.status,
        code: error.code,
        type: error.type,
        message: error.message,
        requestId: error.request_id,
      });

      throw new HttpError(502, mapApiErrorMessage(error.status ?? 0));
    }

    console.error("AI unknown error:", error);
    throw new HttpError(502, "Не удалось сгенерировать summary.");
  }
};
