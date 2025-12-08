import { BookFilters } from "../models/bookFilters";
import type { Response } from "express";
import { AuthRequest } from "../types/types";

export const getBooksByGenre = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({
        message: "Genre query parameter is required",
      });
    }

    const books = await BookFilters.getBooksByGenre(genre as string);

    return res.status(200).json({
      message: `Books filtered by genre: ${genre}`,
      books,
    });
  } catch (error: any) {
    console.error("Error in getBooksByGenre:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
