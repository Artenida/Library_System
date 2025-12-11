import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IBook } from "../../types/bookTypes";
import {
  fetchBookDetails,
  fetchBooks,
  fetchUserBooks,
  updateBook,
} from "../thunks/bookThunks";

interface BookState {
  books: IBook[];
  book: IBook | null;
  loading: boolean;
  error: string | null;
  updated_book: IBook | null;
  updateError: string | null;
}

const initialState: BookState = {
  books: [],
  book: null,
  loading: false,
  error: null,
  updated_book: null,
  updateError: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBooks.fulfilled,
        (state, action: PayloadAction<IBook[]>) => {
          state.loading = false;
          state.books = action.payload;
        }
      )
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch books";
      })
      .addCase(fetchBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.book = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchUserBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserBooks.rejected, (state, action) => {
        state.error = action.error.message || null;
        state.loading = false;
      })

      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.updateError = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.updated_book = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.updateError = action.error.message || null;
        state.loading = false;
      });
  },
});

export default bookSlice.reducer;
