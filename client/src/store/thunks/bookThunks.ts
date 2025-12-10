import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { getBooks, getSingleBook } from "../../services/bookService";
import type { IBook } from "../../types/bookTypes";

export const fetchBooks = createAsyncThunk<
  IBook[],
  { page: number; limit: number },
  { state: RootState }
>(
  "books/fetchBooks",
  async ({ page, limit }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token!;
      return await getBooks(token, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchBookDetails = createAsyncThunk<
  IBook,
  string,
  { state: RootState }
>(
  "bookDetails/fetchBookDetails",
  async (bookId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await getSingleBook(bookId, token!);

      return response.book;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch book");
    }
  }
);
