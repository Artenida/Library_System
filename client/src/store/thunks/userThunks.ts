import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserService } from "../../services/userService";
import type { RootState } from "../store";

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
