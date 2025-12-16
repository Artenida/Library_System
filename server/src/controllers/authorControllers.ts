import { Author } from "../models/author";
import type { Response } from "express";
import { AuthRequest } from "../types/types";

export const getAuthors = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const authors = await Author.getAuthors();
    if (authors && authors.length > 0) {
      return res.status(200).json({
        success: true,
        count: authors.length,
        authors,
      });
    } else {
      return res.status(404).json({
        message: "No author found!",
      });
    }
  } catch (error: any) {
    console.error("Get authors error: ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createAuthor = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, birth_year } = req.body;

    if (!name || !birth_year) {
      return res.status(400).json({
        success: false,
        message: "Name and birth year are required",
      });
    }

    const newAuthor = await Author.createAuthor(name, birth_year);

    return res.status(201).json({
      success: true,
      author: newAuthor,
      message: "Author created successfully",
    });
  } catch (error: any) {
    console.error("Create author error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateAuthor = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const author_id = req.params.id;
    const { name, birth_year } = req.body;

    if (!author_id) {
      return res
        .status(400)
        .json({ success: false, message: "Author ID is required" });
    }

    const updatedAuthor = await Author.updateAuthor(
      author_id,
      name,
      birth_year
    );

    return res.status(200).json({
      success: true,
      author: updatedAuthor,
      message: "Author updated successfully",
    });
  } catch (error: any) {
    console.error("Update author error:", error.message);

    if (error.message === "Author not found!") {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAuthor = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const author_id = req.params.id;

    if (!author_id) {
      return res
        .status(400)
        .json({ success: false, message: "Author ID is required" });
    }

    await Author.deleteAuthor(author_id);

    return res.status(200).json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete author error:", error.message);

    if (error.message === "Author not found!") {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    if (
      error.message === "Cannot delete author: Author has associated books!"
    ) {
      return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAuthorBooks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const author_id = req.params.id;

    if (!author_id) {
      return res.status(400).json({
        success: false,
        message: "Author ID is required",
      });
    }

    const books = await Author.getBooksByAuthorId(author_id);

    if (!books || books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found for this author",
      });
    }

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error: any) {
    console.error("Get author books error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
