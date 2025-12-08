import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  borrowBook,
  createBook,
  getBooksList,
  getSingleBook,
  listAllUsersWithBooks,
  listUserBooks,
  softDeleteBook,
  updateBookByAdmin,
  updateReadingStatus,
} from "../controllers/bookControllers";
const router = Router();

router.get("/", authenticate, getBooksList);
router.get("/:id", authenticate, getSingleBook);
router.get("/user/books", authenticate, listUserBooks);
router.post("/borrow", authenticate, borrowBook);
router.put("/user/books/:user_book_id", authenticate, updateReadingStatus);

router.get("/admin/users", authenticate, isAdmin, listAllUsersWithBooks);
router.post("/admin/books", authenticate, isAdmin, createBook);
router.put("/admin/books/:id", authenticate, isAdmin, updateBookByAdmin);
router.delete("/admin/books/:id", authenticate, isAdmin, softDeleteBook);

export default router;
