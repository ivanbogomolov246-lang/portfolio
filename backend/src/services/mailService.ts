import nodemailer from "nodemailer";
import { env } from "../utils/env.js";
import { HttpError } from "../utils/errors.js";
import { buildOwnerEmail, buildUserEmail } from "../utils/contactTemplates.js";
import type { ContactPayload } from "../utils/validators.js";

let transporter: nodemailer.Transporter | null = null;
let fallbackTransporter: nodemailer.Transporter | null = null;
let isPrimaryVerified = false;
let isFallbackVerified = false;

const hasPlaceholderSmtpConfig = () => {
  const host = env.smtpHost.toLowerCase();
  const user = env.smtpUser.toLowerCase();
  const pass = env.smtpPass.toLowerCase();

  return (
    host.includes("example.com") ||
    host === "smtp.example.com" ||
    user === "smtp-user" ||
    pass === "smtp-password"
  );
};

const mapMailErrorToMessage = (error: unknown) => {
  const nodeError = error as NodeJS.ErrnoException & { responseCode?: number };
  const code = nodeError?.code || "";
  const responseCode = nodeError?.responseCode || 0;

  if (code === "EAUTH") {
    return "SMTP: ошибка авторизации. Проверьте SMTP_USER и SMTP_PASS (обычно нужен пароль приложения).";
  }

  if (code === "ESOCKET" || code === "ECONNECTION" || code === "ETIMEDOUT" || code === "EENOTFOUND") {
    return "SMTP: нет соединения с сервером. Проверьте SMTP_HOST/SMTP_PORT, сеть и VPN.";
  }

  if (responseCode === 534 || responseCode === 535) {
    return "SMTP: Google отклонил вход. Проверьте App Password и раздел Google Security -> Recent activity.";
  }

  if (responseCode === 550 || responseCode === 553) {
    return "SMTP: сервер отклонил отправителя. Проверьте MAIL_FROM_EMAIL и настройки аккаунта.";
  }

  return "Не удалось отправить письмо. Проверьте SMTP-настройки и попробуйте снова.";
};

const isConnectionError = (error: unknown) => {
  const code = (error as NodeJS.ErrnoException)?.code || "";
  return code === "ESOCKET" || code === "ECONNECTION" || code === "ETIMEDOUT";
};

const canFallbackToGmailStartTls = () => {
  return env.smtpHost.toLowerCase() === "smtp.gmail.com" && env.smtpSecure && env.smtpPort === 465;
};

const createTransporter = (port: number, secure: boolean) => {
  const isGmail = env.smtpHost.toLowerCase() === "smtp.gmail.com";

  return nodemailer.createTransport({
    ...(isGmail ? { service: "gmail" } : {}),
    pool: true,
    maxConnections: 1,
    maxMessages: Infinity,
    host: env.smtpHost,
    port,
    secure,
    requireTLS: !secure,
    connectionTimeout: 12_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter(env.smtpPort, env.smtpSecure);
  }
  return transporter;
};

const getFallbackTransporter = () => {
  if (!fallbackTransporter) {
    fallbackTransporter = createTransporter(587, false);
  }
  return fallbackTransporter;
};

const buildFromAddress = () => {
  return `"${env.mailFromName}" <${env.mailFromEmail}>`;
};

export const sendContactEmails = async (payload: ContactPayload) => {
  if (hasPlaceholderSmtpConfig()) {
    throw new HttpError(
      500,
      "SMTP не настроен. Заполните реальные SMTP_HOST, SMTP_USER и SMTP_PASS в backend/.env.",
    );
  }

  const ownerEmail = buildOwnerEmail(payload);
  const userEmail = buildUserEmail(payload);
  const from = buildFromAddress();

  const ensureVerified = async (
    transport: nodemailer.Transporter,
    kind: "primary" | "fallback",
  ) => {
    const alreadyVerified = kind === "primary" ? isPrimaryVerified : isFallbackVerified;
    if (alreadyVerified) {
      return;
    }

    await transport.verify();
    if (kind === "primary") {
      isPrimaryVerified = true;
    } else {
      isFallbackVerified = true;
    }
  };

  const sendViaTransport = async (transport: nodemailer.Transporter, kind: "primary" | "fallback") => {
    await ensureVerified(transport, kind);

    await transport.sendMail({
      from,
      to: env.mailOwnerEmail,
      subject: ownerEmail.subject,
      text: ownerEmail.text,
      html: ownerEmail.html,
      replyTo: payload.email,
    });

    await transport.sendMail({
      from,
      to: payload.email,
      subject: userEmail.subject,
      text: userEmail.text,
      html: userEmail.html,
    });
  };

  const primaryTransport = getTransporter();

  try {
    await sendViaTransport(primaryTransport, "primary");
  } catch (error) {
    isPrimaryVerified = false;

    if (isConnectionError(error) && canFallbackToGmailStartTls()) {
      try {
        await sendViaTransport(getFallbackTransporter(), "fallback");
        return;
      } catch (fallbackError) {
        isFallbackVerified = false;
        console.error("Mail send failed on Gmail STARTTLS fallback:", fallbackError);
        throw new HttpError(502, mapMailErrorToMessage(fallbackError));
      }
    }

    console.error("Mail send failed:", error);
    throw new HttpError(502, mapMailErrorToMessage(error));
  }
};
