import { config } from "dotenv";
import { z } from "zod";

config();

const parseBoolean = (value: unknown, defaultValue: boolean) => {
  if (typeof value !== "string") {
    return defaultValue;
  }

  return value.toLowerCase() === "true";
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  AI_PROVIDER: z.enum(["openai", "deepseek", "ollama"]).default("openai"),
  MAIL_OWNER_EMAIL: z.string().email(),
  MAIL_FROM_NAME: z.string().min(1).default("Ivan Bogomolov Portfolio"),
  MAIL_FROM_EMAIL: z.string().email().optional(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  DEEPSEEK_API_KEY: z.string().optional(),
  DEEPSEEK_MODEL: z.string().min(1).default("deepseek-v4-flash"),
  DEEPSEEK_BASE_URL: z.string().url().default("https://api.deepseek.com"),
  OLLAMA_BASE_URL: z.string().url().default("http://127.0.0.1:11434/v1"),
  OLLAMA_MODEL: z.string().min(1).default("llama3.2:3b"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formatted = parsedEnv.error.flatten().fieldErrors;
  console.error("Invalid environment variables:", formatted);
  process.exit(1);
}

const clientOrigins = parsedEnv.data.CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  clientOrigins,
  aiProvider: parsedEnv.data.AI_PROVIDER,
  mailOwnerEmail: parsedEnv.data.MAIL_OWNER_EMAIL,
  mailFromName: parsedEnv.data.MAIL_FROM_NAME,
  mailFromEmail: parsedEnv.data.MAIL_FROM_EMAIL || parsedEnv.data.MAIL_OWNER_EMAIL,
  smtpHost: parsedEnv.data.SMTP_HOST,
  smtpPort: parsedEnv.data.SMTP_PORT,
  smtpSecure: parseBoolean(process.env.SMTP_SECURE, false),
  smtpUser: parsedEnv.data.SMTP_USER,
  smtpPass: parsedEnv.data.SMTP_PASS,
  openAiApiKey: parsedEnv.data.OPENAI_API_KEY?.trim() || "",
  openAiModel: parsedEnv.data.OPENAI_MODEL,
  deepseekApiKey: parsedEnv.data.DEEPSEEK_API_KEY?.trim() || "",
  deepseekModel: parsedEnv.data.DEEPSEEK_MODEL,
  deepseekBaseUrl: parsedEnv.data.DEEPSEEK_BASE_URL,
  ollamaBaseUrl: parsedEnv.data.OLLAMA_BASE_URL,
  ollamaModel: parsedEnv.data.OLLAMA_MODEL,
};
