import type { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "access_token";
const TOKEN_EXPIRY = "1h";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.createUser({
      username,
      email,
      password_hash: password,
      role,
    });

    const { password_hash, ...userData } = newUser as any;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error: any) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.getUserByEmail(email);
    if (!user || !user?.password_hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    const { password_hash, ...userData } = user;
    res.json({ message: "Login successful", user: userData, token });
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out!" });
};
