import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookShelfAPI from '../../services/bookshelf-api';

// =======================================
// 1. THE THUNK (Async Operations)
// =======================================
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const books = await bookShelfAPI.fetchBooks();
      return books;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

// =======================================
// 2. THE SLICE (State & Reducers)
// =======================================
const booksSlice = createSlice({
  name: 'books',
  initialState: {
    entities: [],
    isLoading: false,
    error: null,
  },
  reducers: {}, // No synchronous actions needed right now
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear old errors when starting a new fetch
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities = action.payload; // Immer handles the mutation safely
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// =======================================
// 3. THE SELECTORS
// =======================================
export const selectBooks = (state) => state.books.entities;
export const selectIsBooksLoading = (state) => state.books.isLoading;
export const selectBooksError = (state) => state.books.error;

// =======================================
// 4. EXPORT DEFAULT REDUCER
// =======================================
export default booksSlice.reducer;