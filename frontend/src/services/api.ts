import type { ApiErrorPayload, ContactFormValues } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000";
const CONTACT_REQUEST_TIMEOUT_MS = 60_000;
const AI_REQUEST_TIMEOUT_MS = 90_000;

class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const parseResponse = async <T>(response: Response): Promise<T | ApiErrorPayload> => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T | ApiErrorPayload;
  }

  return { message: "Сервер вернул неожиданный ответ." };
};

const apiRequest = async <T>(path: string, body: unknown, timeoutMs: number): Promise<T> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await parseResponse<T>(response);

    if (!response.ok) {
      const errorPayload = data as ApiErrorPayload;
      throw new ApiError(
        errorPayload.message || "Сервер вернул ошибку.",
        response.status,
        errorPayload.fieldErrors,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Превышено время ожидания запроса. Попробуйте снова.", 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Ошибка сети. Проверьте подключение и повторите попытку.", 0);
  } finally {
    window.clearTimeout(timeout);
  }
};

export const sendContactRequest = async (payload: ContactFormValues) => {
  return apiRequest<{ message: string }>("/api/contact", payload, CONTACT_REQUEST_TIMEOUT_MS);
};

export const requestAiSummary = async (projectText: string) => {
  return apiRequest<{ summary: string }>("/api/ai-summary", { projectText }, AI_REQUEST_TIMEOUT_MS);
};

export { ApiError };
