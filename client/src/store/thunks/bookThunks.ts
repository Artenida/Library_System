import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  borrowBookService,
  createBookService,
  deleteBookService,
  getBooks,
  getSingleBook,
  getUserBooks,
  searchBooksByGenre,
  updateBookService,
} from "../../services/bookService";
import type { CreateBookBody, IBook } from "../../types/bookTypes";
import { isAxiosError } from "axios";

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

export const fetchUserBooks = createAsyncThunk<
  IBook[], // return type
  string, // argument type (user_id)
  { state: RootState }
>("books/fetchUserBooks", async (user_id, { getState }) => {
  const token = getState().auth.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  return await getUserBooks(user_id, token);
});

export const createBook = createAsyncThunk<
  IBook,
  CreateBookBody,
  { state: RootState }
>("books/createBook", async (book, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) throw new Error("User not authenticated");
    return await createBookService(book, token);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateBook = createAsyncThunk<
  void,
  IBook,
  { rejectValue: string }
>("books/updateBook", async (book, { rejectWithValue, getState }) => {
  try {
    const state: any = getState();
    const token = state.auth.token;

    await updateBookService(book, token);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update book"
    );
  }
});

export const deleteBook = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("books/deleteBook", async (book_id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) throw new Error("User not authenticated");

    const data = await deleteBookService(book_id, token);
    return data.message;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const borrowBook = createAsyncThunk<
  IBook,
  { book_id: string; from_date: string; to_date?: string },
  { state: RootState }
>(
  "books/borrowBook",
  async ({ book_id, from_date, to_date }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("User not authenticated");
      return await borrowBookService(book_id, { from_date, to_date }, token);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const searchBooks = createAsyncThunk<
  IBook[],
  { genre: string },
  { state: RootState }
>("books/searchBooks", async ({ genre }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token!;
    const data = await searchBooksByGenre(genre, token);

    return data.books;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
    return rejectWithValue("Unknown error");
  }
});
