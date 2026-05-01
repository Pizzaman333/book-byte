import {
  selectBookById,
  selectBookEntities,
  selectBookIds,
  selectBooks,
  selectBooksError,
  selectIsBooksLoading,
} from './booksSlice';

export {
  selectBookById,
  selectBookEntities,
  selectBookIds,
  selectBooks,
  selectBooksError,
  selectIsBooksLoading,
};

export const getBooks = selectBooks;
