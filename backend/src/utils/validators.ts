import { z } from "zod";

const phonePattern = /^[0-9+\-() ]{7,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Имя должно содержать минимум 2 символа."),
  phone: z
    .string()
    .trim()
    .min(7, "Телефон должен содержать минимум 7 символов.")
    .max(20, "Телефон слишком длинный.")
    .regex(phonePattern, "Введите корректный номер телефона."),
  email: z.string().trim().email("Введите корректный email."),
  comment: z.string().trim().min(10, "Комментарий должен содержать минимум 10 символов.").max(2000),
});

export const aiSummarySchema = z.object({
  projectText: z
    .string()
    .trim()
    .min(20, "Опишите проект минимум в 20 символах.")
    .max(5000, "Текст проекта должен быть короче 5000 символов."),
});

export type ContactPayload = z.infer<typeof contactSchema>;
export type AiSummaryPayload = z.infer<typeof aiSummarySchema>;

export const extractFieldErrors = (issues: z.ZodIssue[]) => {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const fieldName = issue.path[0];
    if (!fieldName || fieldErrors[String(fieldName)]) {
      continue;
    }

    fieldErrors[String(fieldName)] = issue.message;
  }

  return fieldErrors;
};
