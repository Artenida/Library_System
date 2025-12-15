import { createSlice } from "@reduxjs/toolkit";
import {
  getGenresThunk,
  createGenreThunk,
  updateGenreThunk,
  deleteGenreThunk,
  getGenreBooksThunk,
} from "../thunks/genreThunks";

interface GenreState {
  genres: any[];
  genre: any;
  books: any[];
  loading: boolean;
  error: string | null;
}

const initialState: GenreState = {
  genres: [],
  genre: null,
  books: [],
  loading: false,
  error: null,
};

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get genres
    builder
      .addCase(getGenresThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGenresThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(getGenresThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create genre
    builder
      .addCase(createGenreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGenreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.genre = action.payload;
        state.genres.push(action.payload);
      })
      .addCase(createGenreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update genre
    builder
      .addCase(updateGenreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGenreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.genre = action.payload;
        state.genres = state.genres.map((g) =>
          g.genre_id === action.payload.genre_id ? action.payload : g
        );
      })
      .addCase(updateGenreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete genre
    builder
      .addCase(deleteGenreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGenreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = state.genres.filter(
          (g) => g.genre_id !== action.meta.arg
        );
        state.genre = null;
      })
      .addCase(deleteGenreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get books by genre
    builder
      .addCase(getGenreBooksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGenreBooksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getGenreBooksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default genreSlice.reducer;
