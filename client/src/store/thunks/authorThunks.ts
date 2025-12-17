import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  getAuthorsService,
  createAuthorService,
  updateAuthorService,
  deleteAuthorService,
  getAuthorBooksService,
} from "../../services/authorService";

// Get all authors
export const getAuthorsThunk = createAsyncThunk(
  "author/getAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await getAuthorsService(token);

      return res.data.authors; // array of authors
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch authors"
      );
    }
  }
);

// Create author
export const createAuthorThunk = createAsyncThunk(
  "author/create",
  async (
    payload: { name: string; birth_year: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await createAuthorService(payload, token);

      return res.data.author;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Create author failed"
      );
    }
  }
);

// Update author
export const updateAuthorThunk = createAsyncThunk(
  "author/update",
  async (
    payload: { id: string; data: { name: string; birth_year: number } },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await updateAuthorService(payload.id, payload.data, token);

      return res.data.author;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update author failed"
      );
    }
  }
);

// Delete author
export const deleteAuthorThunk = createAsyncThunk(
  "author/delete",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await deleteAuthorService(id, token);

      return res.data.message || "Author deleted";
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Delete author failed"
      );
    }
  }
);

// Get books by author
export const getAuthorBooksThunk = createAsyncThunk(
  "author/getBooks",
  async (authorId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await getAuthorBooksService(authorId, token);

      return res.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch author books"
      );
    }
  }
);
