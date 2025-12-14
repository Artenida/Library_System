import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  borrowBook,
  createBook,
  getBooksList,
  getSingleBook,
  listUserBooks,
  softDeleteBook,
  updateBook,
} from "../controllers/bookControllers";
const router = Router();

router.get("/", authenticate, getBooksList);
router.get("/user/:user_id/books", authenticate, listUserBooks);
router.post("/:book_id/borrow", authenticate, borrowBook);
router.put("/:id", authenticate, updateBook);
router.get("/:id", authenticate, getSingleBook);

router.post("/admin", authenticate, createBook);
router.delete("/admin/:id", authenticate, isAdmin, softDeleteBook);

export default router;
