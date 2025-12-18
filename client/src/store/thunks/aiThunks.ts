import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInsightsForUser } from "../../services/aiService";

interface FetchInsightsPayload {
  userName: string;
}

export const fetchInsightsForUser = createAsyncThunk(
  "insights/fetchForUser",
  async ({ userName }: FetchInsightsPayload, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const data = await getInsightsForUser(userName, token);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch insights");
    }
  }
);
