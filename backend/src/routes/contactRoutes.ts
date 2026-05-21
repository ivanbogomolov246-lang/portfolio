import { Router } from "express";
import { submitContactForm } from "../controllers/contactController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const contactRoutes = Router();

contactRoutes.post("/", asyncHandler(submitContactForm));

export { contactRoutes };
