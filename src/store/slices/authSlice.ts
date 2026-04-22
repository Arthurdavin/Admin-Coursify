import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  imageUrl: string | null;
  bgImageUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login
    // In setCredentials reducer
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      // ✅ also set cookie so middleware can read it
      document.cookie = `authToken=${action.payload.token}; path=/`;
    },

    // In logout reducer
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // ✅ clear cookie too
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },

    // Restore from localStorage
    restoreAuth: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  logout,
  restoreAuth,
  setError,
  setLoading,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
