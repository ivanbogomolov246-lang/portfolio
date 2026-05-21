import type { RequestHandler } from "express";

export const healthCheck: RequestHandler = (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "portfolio-backend",
    timestamp: new Date().toISOString(),
  });
};
