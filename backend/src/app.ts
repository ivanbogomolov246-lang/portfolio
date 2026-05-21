import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRoutes } from "./routes/index.js";
import { env } from "./utils/env.js";
import { errorHandler, notFoundHandler } from "./utils/errors.js";

const app = express();
const allowedOrigins = new Set(env.clientOrigins);

const isDevLoopbackOrigin = (origin: string) => {
  return /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
};

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      if (env.nodeEnv !== "production" && isDevLoopbackOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS policy."));
    },
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
