import { Router } from "express";
import { askAssistant } from "../controllers/assistantController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post("/ask", authenticate, isAdmin, askAssistant);

export default router;