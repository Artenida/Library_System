import { Book } from "../models/book";
import { AuthRequest } from "../types/types";
import type { Request, Response } from "express";

export const getSingleBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const book = await Book.getSingleBook(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

export const createBookController = async (req: AuthRequest, res: Response) => {
  try {
    const book = await Book.createBook(req.body);
    return res.status(201).json({ book });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to create book" });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const book_id = req.params.book_id;

    if (req.user?.role === "user") {
      const updated = await Book.updateUserBookStatus(
        req.user.id,
        book_id,
        req.body.status
      );
      return res.status(200).json(updated);
    }

    if (req.user?.role === "admin") {
      await Book.updateBook(book_id, req.body);
      return res.status(200).json({ message: "Book updated successfully" });
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to update book" });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const { book_id } = req.params;

    const success = await Book.deleteBook(book_id);

    if (!success) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to delete book" });
  }
};
