import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRoutes } from "./routes/index.js";
import { env } from "./utils/env.js";
import { errorHandler, notFoundHandler } from "./utils/errors.js";

const app = express();
const allowedOrigins = new Set(env.clientOrigins);
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const frontendDistPath = path.resolve(currentDirPath, "../../frontend/dist");

const isDevLoopbackOrigin = (origin: string) => {
  return /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
};

const isSameHostOrigin = (origin: string, requestHost: string) => {
  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
};

app.use(helmet());
app.use(
  cors((request, callback) => {
    const origin = request.header("Origin");
    const requestHost = request.header("Host") || "";

    const corsOptions = {
      origin: false,
    };

    if (!origin) {
      callback(null, { origin: true });
      return;
    }

    if (isSameHostOrigin(origin, requestHost)) {
      callback(null, { origin: true });
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, { origin: true });
      return;
    }

    if (env.nodeEnv !== "production" && isDevLoopbackOrigin(origin)) {
      callback(null, { origin: true });
      return;
    }

    callback(new Error("Origin is not allowed by CORS policy."), corsOptions);
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", apiRoutes);

if (env.nodeEnv === "production" && existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api")) {
      next();
      return;
    }

    response.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
