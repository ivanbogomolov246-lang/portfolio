import type { ContactPayload } from "./validators.js";

const sanitize = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
};

export const buildOwnerEmail = (payload: ContactPayload) => {
  const safe = {
    name: sanitize(payload.name),
    phone: sanitize(payload.phone),
    email: sanitize(payload.email),
    comment: sanitize(payload.comment),
  };

  const subject = `Новая заявка с портфолио от ${safe.name}`;

  const text = [
    "Новая заявка с лендинга-портфолио.",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Email: ${payload.email}`,
    "",
    "Комментарий:",
    payload.comment,
  ].join("\n");

  const html = `
    <h2>Новая заявка с лендинга-портфолио</h2>
    <p><strong>Имя:</strong> ${safe.name}</p>
    <p><strong>Телефон:</strong> ${safe.phone}</p>
    <p><strong>Email:</strong> ${safe.email}</p>
    <p><strong>Комментарий:</strong></p>
    <p>${safe.comment.replaceAll("\n", "<br />")}</p>
  `;

  return { subject, text, html };
};

export const buildUserEmail = (payload: ContactPayload) => {
  const safeName = sanitize(payload.name);

  const subject = "Ваша заявка получена";
  const text = [
    `Здравствуйте, ${payload.name}!`,
    "",
    "Спасибо за обращение. Я получил вашу заявку и свяжусь с вами в ближайшее время.",
    "",
    "Ваш комментарий:",
    payload.comment,
    "",
    "С уважением,",
    "Иван Богомолов",
  ].join("\n");

  const html = `
    <p>Здравствуйте, ${safeName}!</p>
    <p>Спасибо за обращение. Я получил вашу заявку и свяжусь с вами в ближайшее время.</p>
    <p><strong>Ваш комментарий:</strong></p>
    <p>${sanitize(payload.comment).replaceAll("\n", "<br />")}</p>
    <p>С уважением,<br />Иван Богомолов</p>
  `;

  return { subject, text, html };
};
