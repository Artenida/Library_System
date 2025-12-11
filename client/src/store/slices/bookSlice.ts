import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IBook } from "../../types/bookTypes";
import {
  borrowBook,
  fetchBookDetails,
  fetchBooks,
  fetchUserBooks,
  searchBooks,
  updateBook,
} from "../thunks/bookThunks";

interface BookState {
  books: IBook[];
  book: IBook | null;
  loading: boolean;
  error: string | null;
  updated_book: IBook | null;
  updateError: string | null;
  searchResults: IBook[];
  isSearching: boolean;
  searchError: string | null;
}

const initialState: BookState = {
  books: [],
  book: null,
  loading: false,
  error: null,
  updated_book: null,
  updateError: null,
  searchResults: [],
  isSearching: false,
  searchError: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSearch(state) {
      state.searchResults = [];
    },
  },
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
      })

      .addCase(borrowBook.pending, (state) => {
        state.loading = true;
        state.updateError = null;
      })
      .addCase(borrowBook.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.loading = false;
        state.updateError = action.payload as string;
      })

      .addCase(searchBooks.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
        state.searchResults = [];
      });
  },
});

export const { clearSearch } = bookSlice.actions;
export default bookSlice.reducer;
