import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import {
  createBook,
  deleteBook,
  getSingleBook,
  updateBook,
} from "../controllers/bookControllers";
const router = Router();

//router.get("/", authenticate, getBooks);
router.get("/:id", authenticate, getSingleBook);
router.post("/", authenticate, isAdmin,createBook);
router.put("/:id", authenticate, updateBook);
router.delete("/:id", authenticate, isAdmin, deleteBook);

export default router;
