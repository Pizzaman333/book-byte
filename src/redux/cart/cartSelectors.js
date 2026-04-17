import { createSelector } from 'reselect';

export const selectCartItems = (state) => state.cart.items;
export const selectIsCartLoading = (state) => state.cart.isLoading;

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartHasItems = createSelector(
  [selectCartItems],
  (items) => items.length > 0
);

export const selectCartLineItems = createSelector([selectCartItems], (items) =>
  items.map((item) => ({
    ...item,
    lineTotal: item.price * item.quantity,
  }))
);
