import { createSlice } from "@reduxjs/toolkit";
import { fetchInsightsForUser } from "../thunks/aiThunks";

interface InsightsState {
  insightsData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: InsightsState = {
  insightsData: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {
    clearInsights: (state) => {
      state.insightsData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsightsForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.insightsData = null;
      })
      .addCase(fetchInsightsForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.insightsData = action.payload;
      })
      .addCase(fetchInsightsForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearInsights } = aiSlice.actions;
export default aiSlice.reducer;
