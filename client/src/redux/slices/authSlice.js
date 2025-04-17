import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { user } from "../../assets/data";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Check if the response has the expected format
      if (!response.data.user || !response.data.token) {
        return rejectWithValue({ 
          message: 'Invalid response format from server' 
        });
      }
      
      return response.data;
    } catch (error) {
      // Extract error message from the response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const checkEmail = createAsyncThunk(
  'auth/checkEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/check-email`, { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email check failed';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  token: localStorage.getItem("token") || null,
  status: 'idle',
  error: null,
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed';
      })
      // Check Email
      .addCase(checkEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(checkEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Email check failed';
      });
  }
});

export const { logout, setCredentials, setOpenSidebar, clearError } = authSlice.actions;

export default authSlice.reducer;