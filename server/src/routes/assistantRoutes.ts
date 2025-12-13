import { Router } from "express";
import { askAssistant, askInsights } from "../ai/controllers/assistantController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post("/ask", authenticate, isAdmin, askAssistant);
router.get("/insights", authenticate, askInsights);

export default router;