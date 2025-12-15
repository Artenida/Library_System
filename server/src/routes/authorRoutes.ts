import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  createAuthor,
  deleteAuthor,
  getAuthorBooks,
  getAuthors,
  updateAuthor,
} from "../controllers/authorControllers";

const router = Router();

router.get("/", authenticate, isAdmin, getAuthors);
router.post("/", authenticate, isAdmin, createAuthor);
router.put("/:id", authenticate, isAdmin, updateAuthor);
router.delete("/:id", authenticate, isAdmin, deleteAuthor);
router.get("/:id/books", authenticate, isAdmin, getAuthorBooks);

export default router;
