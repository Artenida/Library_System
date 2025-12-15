import { createSlice } from "@reduxjs/toolkit";
import {
  getAuthorsThunk,
  createAuthorThunk,
  updateAuthorThunk,
  deleteAuthorThunk,
  getAuthorBooksThunk,
} from "../thunks/authorThunks";

interface AuthorState {
  authors: any[];
  author: any;
  books: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorState = {
  authors: [],
  author: null,
  books: [],
  loading: false,
  error: null,
};

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get authors
    builder
      .addCase(getAuthorsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuthorsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(getAuthorsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create author
    builder
      .addCase(createAuthorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.author = action.payload;
        state.authors.push(action.payload);
      })
      .addCase(createAuthorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update author
    builder
      .addCase(updateAuthorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.author = action.payload;
        state.authors = state.authors.map((a) =>
          a.author_id === action.payload.author_id ? action.payload : a
        );
      })
      .addCase(updateAuthorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete author
    builder
      .addCase(deleteAuthorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = state.authors.filter(
          (a) => a.author_id !== action.meta.arg
        );
        state.author = null;
      })
      .addCase(deleteAuthorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get books by author
    builder
      .addCase(getAuthorBooksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuthorBooksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getAuthorBooksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authorSlice.reducer;
