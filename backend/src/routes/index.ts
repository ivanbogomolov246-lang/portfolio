import { Router } from "express";
import rateLimit from "express-rate-limit";
import { aiRoutes } from "./aiRoutes.js";
import { contactRoutes } from "./contactRoutes.js";
import { healthRoutes } from "./healthRoutes.js";

const apiRoutes = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Слишком много AI-запросов. Повторите через минуту." },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Слишком много отправок формы. Повторите через минуту." },
});

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/contact", contactLimiter, contactRoutes);
apiRoutes.use("/ai-summary", aiLimiter, aiRoutes);

export { apiRoutes };
