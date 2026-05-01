export function normalizeCartItems(items = []) {
  return items.reduce(
    (acc, item) => {
      const bookId = String(item.id);
      const quantity = Number(item.quantity) || 0;

      if (quantity <= 0) {
        return acc;
      }

      acc.itemIds.push(bookId);
      acc.quantitiesById[bookId] = quantity;
      return acc;
    },
    { itemIds: [], quantitiesById: {} },
  );
}

export function buildCartApiItems(itemIds, quantitiesById, booksById) {
  return itemIds.reduce((items, bookId) => {
    const quantity = quantitiesById[bookId];
    const book = booksById[bookId];

    if (!book || quantity <= 0) {
      return items;
    }

    items.push({
      ...book,
      quantity,
    });

    return items;
  }, []);
}
