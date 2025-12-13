import { Router } from "express";
import { deleteUser, getUser, getUsers, searchUsers, updateUser } from "../controllers/userController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate,isAdmin,getUsers);
router.get("/:id", authenticate, getUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

router.get("/search", authenticate, isAdmin, searchUsers);
export default router