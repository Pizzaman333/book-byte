import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import * as bookShelfAPI from '../../services/bookshelf-api';

const booksAdapter = createEntityAdapter({
  selectId: (book) => String(book.id),
});

function sanitizeBook(book) {
  const { quantity, ...bookWithoutQuantity } = book;
  return bookWithoutQuantity;
}

function sanitizeBooks(books) {
  return books.map(sanitizeBook);
}

const initialState = booksAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      return await bookShelfAPI.fetchBooks();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  },
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId, { rejectWithValue }) => {
    try {
      return await bookShelfAPI.fetchBookById(bookId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch book');
    }
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    booksReceived: (state, action) => {
      booksAdapter.upsertMany(state, sanitizeBooks(action.payload));
    },
    bookReceived: (state, action) => {
      booksAdapter.upsertOne(state, sanitizeBook(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        booksAdapter.setAll(state, sanitizeBooks(action.payload));
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        booksAdapter.upsertOne(state, sanitizeBook(action.payload));
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { booksReceived, bookReceived } = booksSlice.actions;

const booksSelectors = booksAdapter.getSelectors((state) => state.books);

export const selectBooks = booksSelectors.selectAll;
export const selectBookById = booksSelectors.selectById;
export const selectBookEntities = booksSelectors.selectEntities;
export const selectBookIds = booksSelectors.selectIds;
export const selectIsBooksLoading = (state) => state.books.isLoading;
export const selectBooksError = (state) => state.books.error;

export default booksSlice.reducer;
