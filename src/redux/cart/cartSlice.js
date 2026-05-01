import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as cartApi from '../../services/cart-api';
import { bookReceived, booksReceived } from '../books/booksSlice';
import { buildCartApiItems, normalizeCartItems } from './cartUtils';

function stripQuantity(items) {
  return items.map(({ quantity, ...book }) => book);
}

function getNextCartState(cartState, updater) {
  const nextState = {
    itemIds: [...cartState.itemIds],
    quantitiesById: { ...cartState.quantitiesById },
  };

  updater(nextState);

  nextState.itemIds = nextState.itemIds.filter(
    (bookId, index, ids) =>
      ids.indexOf(bookId) === index && (nextState.quantitiesById[bookId] || 0) > 0,
  );

  Object.keys(nextState.quantitiesById).forEach((bookId) => {
    if (!nextState.itemIds.includes(bookId) || nextState.quantitiesById[bookId] <= 0) {
      delete nextState.quantitiesById[bookId];
    }
  });

  return nextState;
}

async function persistCart(getState, nextCartState, fallbackBook) {
  const state = getState();
  const booksById = {
    ...state.books.entities,
  };

  if (fallbackBook) {
    booksById[String(fallbackBook.id)] = fallbackBook;
  }

  const payload = buildCartApiItems(
    nextCartState.itemIds,
    nextCartState.quantitiesById,
    booksById,
  );

  return cartApi.updateCart(payload);
}

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const items = await cartApi.fetchCart();
      dispatch(booksReceived(stripQuantity(items)));
      return normalizeCartItems(items);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (bookOrId, { dispatch, getState, rejectWithValue }) => {
    const fallbackBook = typeof bookOrId === 'object' ? bookOrId : null;
    const bookId = String(fallbackBook?.id ?? bookOrId);

    try {
      if (fallbackBook) {
        dispatch(bookReceived(fallbackBook));
      }

      const currentCart = getState().cart;
      const nextCartState = getNextCartState(currentCart, (draft) => {
        if (!draft.itemIds.includes(bookId)) {
          draft.itemIds.push(bookId);
        }

        draft.quantitiesById[bookId] = (draft.quantitiesById[bookId] || 0) + 1;
      });

      const items = await persistCart(getState, nextCartState, fallbackBook);
      dispatch(booksReceived(stripQuantity(items)));
      return normalizeCartItems(items);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (bookId, { dispatch, getState, rejectWithValue }) => {
    const normalizedBookId = String(bookId);

    try {
      const nextCartState = getNextCartState(getState().cart, (draft) => {
        draft.itemIds = draft.itemIds.filter((id) => id !== normalizedBookId);
        delete draft.quantitiesById[normalizedBookId];
      });

      const items = await persistCart(getState, nextCartState);
      dispatch(booksReceived(stripQuantity(items)));
      return normalizeCartItems(items);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  },
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, amount }, { dispatch, getState, rejectWithValue }) => {
    const bookId = String(id);

    try {
      const nextCartState = getNextCartState(getState().cart, (draft) => {
        const nextQuantity = (draft.quantitiesById[bookId] || 0) + amount;

        if (nextQuantity <= 0) {
          draft.itemIds = draft.itemIds.filter((currentId) => currentId !== bookId);
          delete draft.quantitiesById[bookId];
          return;
        }

        if (!draft.itemIds.includes(bookId)) {
          draft.itemIds.push(bookId);
        }

        draft.quantitiesById[bookId] = nextQuantity;
      });

      const items = await persistCart(getState, nextCartState);
      dispatch(booksReceived(stripQuantity(items)));
      return normalizeCartItems(items);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update cart quantity');
    }
  },
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      const items = await cartApi.updateCart([]);
      return normalizeCartItems(items);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemIds: [],
    quantitiesById: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('cart/'),
        (state, action) => {
          state.itemIds = action.payload.itemIds;
          state.quantitiesById = action.payload.quantitiesById;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.startsWith('cart/'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('cart/'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error?.message || null;
        },
      );
  },
});

export default cartSlice.reducer;
