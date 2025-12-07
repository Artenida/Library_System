import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import { deleteBook, getSingleBook, updateBook } from "../controllers/bookControllers"
const router = Router();

//router.get("/", authenticate, getBooks);
router.post("/", authenticate, getSingleBook);
router.put("/:id", authenticate, updateBook);
router.delete("/:id", authenticate, isAdmin, deleteBook);

export default router