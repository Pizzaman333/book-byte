import { createSelector } from 'reselect';
import { selectBookEntities } from '../books/booksSlice';

export const selectCartItemIds = (state) => state.cart.itemIds;
export const selectCartQuantitiesById = (state) => state.cart.quantitiesById;
export const selectIsCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;

export const selectCartItems = createSelector(
  [selectCartItemIds, selectCartQuantitiesById],
  (itemIds, quantitiesById) =>
    itemIds.map((id) => ({
      id,
      quantity: quantitiesById[id],
    })),
);

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartLineItems = createSelector(
  [selectCartItems, selectBookEntities],
  (items, booksById) =>
    items.reduce((lineItems, item) => {
      const book = booksById[item.id];

      if (!book) {
        return lineItems;
      }

      lineItems.push({
        ...book,
        quantity: item.quantity,
        lineTotal: book.price * item.quantity,
      });

      return lineItems;
    }, []),
);

export const selectCartSubtotal = createSelector([selectCartLineItems], (items) =>
  items.reduce((total, item) => total + item.lineTotal, 0),
);

export const selectCartHasItems = createSelector(
  [selectCartItemIds],
  (itemIds) => itemIds.length > 0,
);
