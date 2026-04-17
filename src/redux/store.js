import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './books/booksSlice';
import cartReducer from './cart/cartSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    cart: cartReducer
  },
});
