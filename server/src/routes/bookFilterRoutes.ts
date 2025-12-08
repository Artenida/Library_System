import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getBooksByGenre } from "../controllers/booksFilterController";

const router = Router();

router.get("/filter/", authenticate, getBooksByGenre);

export default router;
