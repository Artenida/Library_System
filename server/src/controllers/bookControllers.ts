import { Book } from "../models/book";
import { AuthRequest } from "../types/types";
import type { Request, Response } from "express";

export const getSingleBook = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Book ID is required" });

    const currentUserId = (req.user as any)?.id;
    const currentUserRole = (req.user as any)?.role;

    const book = await Book.getSingleBook(id, currentUserId, currentUserRole);

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

export const getBooksList = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const currentUserId = (req.user as any)?.id;
    const currentUserRole = (req.user as any)?.role;

    const books = await Book.getBooks(
      page,
      limit,
      currentUserId,
      currentUserRole
    );

    res.status(200).json({
      success: true,
      page,
      limit,
      count: books.length,
      data: books,
    });
  } catch (error: any) {
    console.error("Error in getBooksController:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve books" });
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author_ids, genre_ids } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!author_ids || !author_ids.length)
      return res
        .status(400)
        .json({ message: "At least one author is required" });
    if (!genre_ids || !genre_ids.length)
      return res
        .status(400)
        .json({ message: "At least one genre is required" });

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
    if (!book_id)
      return res.status(400).json({ message: "Book ID is required" });

    const currentUserId = (req.user as any)?.id;
    const currentUserRole = (req.user as any)?.role;

    // If user is NOT admin, enforce ownership check
    const userBook = req.body.user_books?.[0];
    if (currentUserRole !== "admin" && userBook?.user_book_id) {
      const dbUserBook = await Book.findUserBookById(userBook.user_book_id);

      if (!dbUserBook) {
        return res.status(404).json({ message: "User book not found" });
      }

      if (dbUserBook.user_id !== currentUserId) {
        return res.status(403).json({
          message: "You cannot update another user's book reservation",
        });
      }
    }

    // Continue with update
    await Book.updateBook(book_id, req.body);

    return res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error: any) {
    console.error("updateBook:", error.message);
    return res.status(500).json({ message: "Failed to update book" });
  }
};

export const softDeleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const book_id = req.params.id;
    if (!book_id)
      return res.status(400).json({ message: "Book ID is required" });

    try {
      const success = await Book.deleteBook(book_id);

      if (!success) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to delete book" });
  }
};

export const borrowBook = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const book_id = req.params.book_id;
    const { from_date, to_date } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!book_id || !from_date) {
      return res.status(400).json({
        success: false,
        message: "book_id (in route) and from_date are required",
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

export const listUserBooks = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.params?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const books = await Book.getBooksByUser(user_id);

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
