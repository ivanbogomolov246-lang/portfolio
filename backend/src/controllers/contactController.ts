import type { RequestHandler } from "express";
import { sendContactEmails } from "../services/mailService.js";
import { HttpError } from "../utils/errors.js";
import { contactSchema, extractFieldErrors } from "../utils/validators.js";

export const submitContactForm: RequestHandler = async (request, response) => {
  const parsed = contactSchema.safeParse(request.body);

  if (!parsed.success) {
    throw new HttpError(
      400,
      "Исправьте ошибки валидации и попробуйте снова.",
      extractFieldErrors(parsed.error.issues),
    );
  }

  await sendContactEmails(parsed.data);
  response.status(200).json({
    message: "Сообщение успешно отправлено. Скоро свяжусь с вами.",
  });
};
