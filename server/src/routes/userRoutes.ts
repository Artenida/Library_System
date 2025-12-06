import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/userController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/users", authenticate,isAdmin,getUsers);
router.get("/user/:user_id", authenticate, getUser);
router.put("/update/:user_id", authenticate, updateUser);
router.delete("/delete/:user_id", authenticate, deleteUser);