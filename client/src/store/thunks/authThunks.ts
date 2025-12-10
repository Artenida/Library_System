import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserService } from "../../services/authService";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserService(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
