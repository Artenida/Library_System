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

export const getBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const books = await Book.getBooks(page, limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      count: books.length,
      data: books,
    });
  } catch (error: any) {
    console.error("Error in getBooksController:", error.message);
    res.status(500).json({ success: false, message: "Failed to retrieve books" });
  }
};


export const createBook = async (req: AuthRequest, res: Response) => {
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
    const book_id = req.params.id;

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
    const book_id = req.params.id;

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

export const borrowBook = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const { book_id, from_date, to_date } = req.body;

    if (!user_id || !book_id || !from_date) {
      return res.status(400).json({
        success: false,
        message: "user_id, book_id, and from_date are required",
      });
    }
    const result = await Book.borrowBook(user_id, book_id, from_date, to_date);

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserBooks = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;
    let user_id: string | undefined;
    let includeDeleted = false;

    if (role === "admin") {
      // admin selects which user to view
      user_id = req.query.user_id as string;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "user_id is required for admin requests",
        });
      }

      includeDeleted = true;
    } else {
      // normal user → use authenticated ID
      user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      includeDeleted = false;
    }

    const books = await Book.getBooksByUser(user_id, includeDeleted);

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
