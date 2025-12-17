import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserService,
  deleteUserService,
  getUsersService,
  updateUserService,
} from "../../services/userService";
import type { RootState } from "../store";

export const getUsersThunk = createAsyncThunk(
  "user/getAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await getUsersService(token);

      return res.data.users; // array of users
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const createUserThunk = createAsyncThunk(
  "user/create",
  async (
    data: { username: string; email: string; password: string; role: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await createUserService(data, token);
      return res.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "user/update",
  async (payload: { id: string; data: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await updateUserService(payload.id, payload.data, token);

      return res.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "user/delete",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) return rejectWithValue("Missing token");

      const res = await deleteUserService(id, token);

      return res.data.message || "User deleted";
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);
