import { Genre } from "../models/genre";
import type { Response } from "express";
import { AuthRequest } from "../types/types";

export const getGenres = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const genres = await Genre.getGenres();
    if (genres && genres.length > 0) {
      return res.status(200).json({
        success: true,
        count: genres.length,
        genres,
      });
    } else {
      return res.status(404).json({
        message: "No genre found!",
      });
    }
  } catch (error: any) {
    console.error("Get genres error: ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createGenre = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Genre name is required",
      });
    }

    const newGenre = await Genre.createGenre(name);

    return res.status(201).json({
      success: true,
      genre: newGenre,
      message: "Genre created successfully",
    });
  } catch (error: any) {
    console.error("Create genre error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateGenre = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const genre_id = req.params.id;
    const { name } = req.body;

    if (!genre_id) {
      return res
        .status(400)
        .json({ success: false, message: "Genre ID is required" });
    }

    const updatedGenre = await Genre.updateGenre(genre_id, name);

    return res.status(200).json({
      success: true,
      genre: updatedGenre,
      message: "Genre updated successfully",
    });
  } catch (error: any) {
    console.error("Update genre error:", error.message);

    if (error.message === "Genre not found!") {
      return res
        .status(404)
        .json({ success: false, message: "Genre not found" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteGenre = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const genre_id = req.params.id;

    if (!genre_id) {
      return res
        .status(400)
        .json({ success: false, message: "Genre ID is required" });
    }

    await Genre.deleteGenre(genre_id);

    return res.status(200).json({
      success: true,
      message: "Genre deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete genre error:", error.message);

    if (error.message === "Genre not found!") {
      return res
        .status(404)
        .json({ success: false, message: "Genre not found" });
    }

    if (
      error.message === "Cannot delete genre: Genre is associated with books!"
    ) {
      return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getGenreBooks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const genre_id = req.params.id;

    if (!genre_id) {
      return res.status(400).json({
        success: false,
        message: "Genre ID is required",
      });
    }

    const books = await Genre.getBooksByGenreId(genre_id);

    if (!books || books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found for this genre",
      });
    }

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error: any) {
    console.error("Get genre books error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
