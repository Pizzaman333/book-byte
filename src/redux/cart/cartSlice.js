import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartApi from '../../services/cart-api';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  return await cartApi.fetchCart();
});

export const addToCart = createAsyncThunk('cart/add', async (book, { getState }) => {
  const currentItems = getState().cart.items;
  let newItems = [...currentItems];
  
  const existingIndex = newItems.findIndex(item => item.id === book.id);
  if (existingIndex >= 0) {
    newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 };
  } else {
    newItems.push({ ...book, quantity: 1 });
  }

  return await cartApi.updateCart(newItems);
});

export const removeFromCart = createAsyncThunk('cart/remove', async (bookId, { getState }) => {
  const newItems = getState().cart.items.filter(item => item.id !== bookId);
  return await cartApi.updateCart(newItems);
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, amount }, { getState }) => {
  let newItems = [...getState().cart.items];
  const itemIndex = newItems.findIndex(item => item.id === id);
  
  if (itemIndex >= 0) {
    const newQuantity = newItems[itemIndex].quantity + amount;
    
    if (newQuantity <= 0) {
      newItems = newItems.filter(item => item.id !== id); // Remove if drops to 0
    } else {
      newItems[itemIndex] = { ...newItems[itemIndex], quantity: newQuantity };
    }
  }

  return await cartApi.updateCart(newItems);
});

export const clearCart = createAsyncThunk('cart/clear', async () => {
  return await cartApi.updateCart([]);
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isLoading: false,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('cart/'),
        (state, action) => {
          state.items = action.payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.startsWith('cart/'),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('cart/'),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export default cartSlice.reducer;
