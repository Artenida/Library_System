import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IBook } from "../../types/bookTypes";
import * as bookService from "../../services/bookService";

export const fetchBooks = createAsyncThunk<IBook[], { page?: number; limit?: number }>(
  "books/fetchBooks",
  async ({ page = 1, limit = 10 }) => {
    return await bookService.getBooks(page, limit);
  }
);
