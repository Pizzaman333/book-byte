import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  clearAuthHeader,
  fetchCurrentUser,
  login,
  logout,
  setAuthHeader,
  signup,
} from '../../services/auth-api';
import {
  clearStoredToken,
  loadStoredToken,
  storeToken,
} from './authStorage';

function normalizeUserPayload(payload) {
  return payload?.user ?? payload ?? null;
}

const persistedToken = loadStoredToken();

if (persistedToken) {
  setAuthHeader(persistedToken);
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      return await signup(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await login(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Logout failed');
    }

    return null;
  },
);

export const refreshCurrentUser = createAsyncThunk(
  'auth/refreshCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    if (!token) {
      return rejectWithValue('No auth token');
    }

    try {
      setAuthHeader(token);
      return await fetchCurrentUser();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Unable to load current user');
    }
  },
  {
    condition: (_, { getState }) => Boolean(getState().auth.token),
  },
);

const initialState = {
  user: null,
  token: persistedToken,
  isAuthenticated: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = normalizeUserPayload(action.payload);
        const token = action.payload?.token || state.token;

        state.isLoading = false;
        state.user = user;
        state.token = token;
        state.isAuthenticated = Boolean(token && user);
        state.error = null;

        if (token) {
          storeToken(token);
          setAuthHeader(token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = normalizeUserPayload(action.payload);
        const token = action.payload?.token || state.token;

        state.isLoading = false;
        state.user = user;
        state.token = token;
        state.isAuthenticated = Boolean(token && user);
        state.error = null;

        if (token) {
          storeToken(token);
          setAuthHeader(token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        clearStoredToken();
        clearAuthHeader();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshCurrentUser.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshCurrentUser.fulfilled, (state, action) => {
        state.user = normalizeUserPayload(action.payload);
        state.isAuthenticated = true;
        state.isRefreshing = false;
        state.error = null;
      })
      .addCase(refreshCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isRefreshing = false;
        state.error = action.payload;
        clearStoredToken();
        clearAuthHeader();
      });
  },
});

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthLoading = (state) => state.auth.isLoading;
export const selectIsAuthRefreshing = (state) => state.auth.isRefreshing;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
