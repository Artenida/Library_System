import {createSlice} from "@reduxjs/toolkit"

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  success: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.success = false;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
  },
  extraReducers: (builder) => {},
}})


export const { logout } = authSlice.actions;
export default authSlice.reducer;
