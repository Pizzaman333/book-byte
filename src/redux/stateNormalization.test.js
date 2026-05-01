import booksReducer, {
  booksReceived,
  fetchBooks,
  selectBookById,
  selectBooks,
} from './books/booksSlice';
import cartReducer, { fetchCart } from './cart/cartSlice';
import {
  selectCartHasItems,
  selectCartItemCount,
  selectCartLineItems,
  selectCartSubtotal,
} from './cart/cartSelectors';
import { normalizeCartItems } from './cart/cartUtils';

describe('state normalization', () => {
  it('stores books in normalized state and exposes ordered selectors', () => {
    const apiBooks = [
      { id: 2, title: 'Second', price: 12, quantity: 99 },
      { id: 1, title: 'First', price: 8 },
    ];

    const state = {
      books: booksReducer(undefined, fetchBooks.fulfilled(apiBooks, 'request-1')),
    };

    expect(state.books.ids).toEqual(['2', '1']);
    expect(state.books.entities['2']).toEqual({ id: 2, title: 'Second', price: 12 });
    expect(selectBooks(state)).toEqual([
      { id: 2, title: 'Second', price: 12 },
      { id: 1, title: 'First', price: 8 },
    ]);
    expect(selectBookById(state, '1')).toEqual({ id: 1, title: 'First', price: 8 });
  });

  it('joins normalized cart lines with canonical books for UI selectors', () => {
    const booksState = booksReducer(
      undefined,
      booksReceived([
        { id: 1, title: 'Dune', price: 10 },
        { id: 2, title: 'Foundation', price: 15 },
      ]),
    );

    const rawCartItems = [
      { id: 1, title: 'Dune', price: 10, quantity: 2 },
      { id: 2, title: 'Foundation', price: 15, quantity: 1 },
    ];

    const cartState = cartReducer(
      undefined,
      fetchCart.fulfilled(normalizeCartItems(rawCartItems), 'request-2'),
    );

    const state = {
      books: booksState,
      cart: cartState,
    };

    expect(selectCartHasItems(state)).toBe(true);
    expect(selectCartItemCount(state)).toBe(3);
    expect(selectCartSubtotal(state)).toBe(35);
    expect(selectCartLineItems(state)).toEqual([
      { id: 1, title: 'Dune', price: 10, quantity: 2, lineTotal: 20 },
      { id: 2, title: 'Foundation', price: 15, quantity: 1, lineTotal: 15 },
    ]);
  });
});
