import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  borrowBook,
  createBook,
  deleteBook,
  getBooks,
  getBooksByUser,
  getSingleBook,
  updateBookAdmin,
  updateUserBookStatus,
} from "../controllers/bookControllers";
const router = Router();

//router.get("/", authenticate, getBooks);
router.get("/", authenticate, getBooks);
router.get("/:id", authenticate, getSingleBook);
router.get("/user/books", authenticate, getBooksByUser);
router.post("/borrow", authenticate, borrowBook);
router.put("/user/books/:user_book_id", authenticate, updateUserBookStatus);

router.post("/admin/books", authenticate, isAdmin, createBook);
router.put("/admin/books/:id", authenticate, isAdmin, updateBookAdmin);
router.delete("/admin/books/:id", authenticate, isAdmin, deleteBook);

export default router;
