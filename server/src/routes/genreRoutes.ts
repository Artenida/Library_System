import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  createGenre,
  deleteGenre,
  getGenreBooks,
  getGenres,
  updateGenre,
} from "../controllers/genreControllers";

const router = Router();

router.get("/", authenticate, isAdmin, getGenres);
router.post("/", authenticate, isAdmin, createGenre);
router.put("/:id", authenticate, isAdmin, updateGenre);
router.delete("/:id", authenticate, isAdmin, deleteGenre);
router.get("/:id/books", authenticate, isAdmin, getGenreBooks);

export default router;
