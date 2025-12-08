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

export const updateReadingStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "user") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user_book_id = req.params.user_book_id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Check ownership
    const ownershipCheck = await Book.findUserBookById(user_book_id);

    if (!ownershipCheck) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (ownershipCheck.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You cannot modify another user's book record" });
    }

    const updated = await Book.updateUserBookStatus(user_book_id, status);

    return res.status(200).json({
      message: "Reading status updated",
      updated,
    });
  } catch (error: any) {
    console.error("updateUserBookStatus:", error.message);
    return res.status(500).json({ message: "Failed to update reading status" });
  }
};

export const updateBookByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const book_id = req.params.id;
    if (!book_id)
      return res.status(400).json({ message: "Book ID is required" });

    await Book.updateBook(book_id, req.body);

    return res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error: any) {
    console.error("updateBookAdmin:", error.message);
    return res.status(500).json({ message: "Failed to update book" });
  }
};

export const softDeleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const book_id = req.params.id;
    if (!book_id)
      return res.status(400).json({ message: "Book ID is required" });

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

export const listUserBooks = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
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

export const listAllUsersWithBooks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await Book.getUsersWithBooks();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err: any) {
    console.error("getAllUsersWithBooks:", err.message);
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
};
