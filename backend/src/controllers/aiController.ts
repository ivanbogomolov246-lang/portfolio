import type { RequestHandler } from "express";
import { generateSummary } from "../services/aiService.js";
import { HttpError } from "../utils/errors.js";
import { aiSummarySchema, extractFieldErrors } from "../utils/validators.js";

export const createAiSummary: RequestHandler = async (request, response) => {
  const parsed = aiSummarySchema.safeParse(request.body);

  if (!parsed.success) {
    throw new HttpError(
      400,
      "Проверьте текст проекта и попробуйте снова.",
      extractFieldErrors(parsed.error.issues),
    );
  }

  const summary = await generateSummary(parsed.data.projectText);

  response.status(200).json({
    summary,
  });
};
