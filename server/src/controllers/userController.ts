import type { Request, Response } from "express";
import { User, type IUser } from "../models/user";

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.getUsers();
    if (users && users.length > 0) {
      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } else {
      return res.status(404).json({
        message: "No users found",
      });
    }
  } catch (error: any) {
    console.error("Get users error: ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.getUser(id);

    if (user) {
      return res.status(200).json({
        message: "User retrieved successfully!",
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        message: "No users found",
      });
    }
  } catch (error: any) {
    console.error("Get user error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Partial<IUser> = req.body;

    if (!id) return res.status(400).json({ message: "USer ID is required!" });

    const updateUser = await User.updateUser(id, data);

    const { password_hash, ...safeUser } = updateUser;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Update user error:", error.message);
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    await User.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error.message);
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
