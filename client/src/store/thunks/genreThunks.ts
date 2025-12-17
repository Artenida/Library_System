import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  getGenresService,
  createGenreService,
  updateGenreService,
  deleteGenreService,
  getGenreBooksService,
} from "../../services/genreService";

// Get all genres
export const getGenresThunk = createAsyncThunk(
  "genre/getAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Missing token");

      const res = await getGenresService(token);
      return res.data.genres;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch genres"
      );
    }
  }
);

// Create genre
export const createGenreThunk = createAsyncThunk(
  "genre/create",
  async (payload: { name: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Missing token");

      const res = await createGenreService(payload, token);
      return res.data.genre;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Create genre failed"
      );
    }
  }
);

// Update genre
export const updateGenreThunk = createAsyncThunk(
  "genre/update",
  async (
    payload: { id: string; data: { name: string } },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Missing token");

      const res = await updateGenreService(payload.id, payload.data, token);
      return res.data.genre;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update genre failed"
      );
    }
  }
);

// Delete genre
export const deleteGenreThunk = createAsyncThunk(
  "genre/delete",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Missing token");

      const res = await deleteGenreService(id, token);
      return res.data.message || "Genre deleted";
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Delete genre failed"
      );
    }
  }
);

// Get books by genre
export const getGenreBooksThunk = createAsyncThunk(
  "genre/getBooks",
  async (genreId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Missing token");

      const res = await getGenreBooksService(genreId, token);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch genre books"
      );
    }
  }
);
