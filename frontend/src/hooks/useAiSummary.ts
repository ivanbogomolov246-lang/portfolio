import { useState } from "react";
import { ApiError, requestAiSummary } from "../services/api";
import type { AiSummaryState } from "../types";

const MIN_LENGTH = 20;

const initialState: AiSummaryState = {
  input: "",
  output: "",
  isLoading: false,
  error: null,
};

export const useAiSummary = () => {
  const [state, setState] = useState<AiSummaryState>(initialState);

  const setInput = (input: string) => {
    setState((prev) => ({
      ...prev,
      input,
      error: null,
    }));
  };

  const generateSummary = async () => {
    if (state.input.trim().length < MIN_LENGTH) {
      setState((prev) => ({
        ...prev,
        error: `Опишите проект подробнее (минимум ${MIN_LENGTH} символов).`,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      output: "",
    }));

    try {
      const response = await requestAiSummary(state.input.trim());
      setState((prev) => ({
        ...prev,
        isLoading: false,
        output: response.summary,
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Не удалось сгенерировать summary. Попробуйте позже.",
      }));
    }
  };

  return {
    state,
    setInput,
    generateSummary,
  };
};
