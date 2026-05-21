import type { ErrorRequestHandler, RequestHandler } from "express";

export class HttpError extends Error {
  statusCode: number;
  fieldErrors?: Record<string, string>;

  constructor(statusCode: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new HttpError(404, `Маршрут ${request.method} ${request.originalUrl} не найден.`));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      fieldErrors: error.fieldErrors,
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    message: "Внутренняя ошибка сервера. Попробуйте позже.",
  });
};
