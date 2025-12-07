import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  borrowBook,
  createBook,
  deleteBook,
  getSingleBook,
  getUserBooks,
  updateBook,
} from "../controllers/bookControllers";
const router = Router();

//router.get("/", authenticate, getBooks);
router.post("/", authenticate, isAdmin, createBook);
router.get("/user", authenticate, getUserBooks);
router.post("/borrow", authenticate, borrowBook);
router.get("/:id", authenticate, getSingleBook);
router.put("/:id", authenticate, updateBook);
router.delete("/:id", authenticate, isAdmin, deleteBook);

export default router;
