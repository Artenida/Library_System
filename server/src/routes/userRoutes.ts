import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/userController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate,isAdmin,getUsers);
router.get("/:user_id", authenticate, getUser);
router.put("/:user_id", authenticate, updateUser);
router.delete("/:user_id", authenticate, deleteUser);

export default router