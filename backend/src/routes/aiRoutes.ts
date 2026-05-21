import { Router } from "express";
import { createAiSummary } from "../controllers/aiController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const aiRoutes = Router();

aiRoutes.post("/", asyncHandler(createAiSummary));

export { aiRoutes };
